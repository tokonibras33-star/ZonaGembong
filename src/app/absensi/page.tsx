"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { 
  Clock, 
  MapPin, 
  LogOut, 
  Home, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  CalendarDays, 
  User,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFirestore, collection, doc } from "@/firebase";
import { addDoc, updateDoc, query, where, getDocs, serverTimestamp, orderBy, limit, getDoc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { normalizeBranchId } from "@/lib/branch-helper";
import { loginWithFirebaseAuth, logoutWithFirebaseAuth } from "@/lib/auth-service";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// --- Types ---
interface KaryawanUser {
  id: string;
  nama: string;
  username: string;
  status?: string;
  shift?: string;
  cabang?: string;
  [key: string]: unknown;
}

interface AttendanceLog {
  id: string;
  karyawanId: string;
  nama: string;
  tanggal: string;
  jamMasuk: string;
  jamPulang: string;
  selfieUrl?: string;
  selfieMasukUrl?: string;
  selfiePulangUrl?: string;
  cabang?: string;
  [key: string]: unknown;
}

interface AbsensiConfig {
  lat: string;
  lng: string;
  radius: string;
  cloudinaryCloudName?: string;
  cloudinaryUploadPreset?: string;
  cloudinaryFolder?: string;
  location?: AbsensiConfig;
  [key: string]: unknown;
}

// Function to calculate distance between coordinates (meters)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function GembongAbsensiPage() {
  const db = useFirestore();
  const router = useRouter();
  const [user, setUser] = useState<KaryawanUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceToday, setAttendanceToday] = useState<AttendanceLog | null>(null);
  const [isWithinRadius, setIsWithinRadius] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [history, setHistory] = useState<AttendanceLog[]>([]);
  const [config, setConfig] = useState<AbsensiConfig | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      const gembongDocRef = doc(db, "settings", "absensi_config_gembong");
      const gembongSnap = await getDoc(gembongDocRef);
      if (gembongSnap.exists()) {
        setConfig(gembongSnap.data() as AbsensiConfig);
        return;
      }

      const docRef = doc(db, "settings", "absensi_config");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setConfig(snap.data() as AbsensiConfig);
      }
    } catch (e) {
      console.error("Failed to fetch location config", e);
    }
  }, [db]);

  const fetchAttendanceData = useCallback(async (karyawanId: string) => {
    const today = new Date().toLocaleDateString('id-ID');
    const q = query(
      collection(db, "absensi_logs"), 
      where("karyawanId", "==", karyawanId),
      orderBy("timestamp", "desc"),
      limit(5)
    );
    const snapshot = await getDocs(q);
    const logs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AttendanceLog));
    setHistory(logs);
    
    const todayLog = logs.find((l) => l.tanggal === today);
    if (todayLog) setAttendanceToday(todayLog);
  }, [db]);

  const checkPersistedUser = useCallback(async () => {
    await Promise.resolve();
    try {
      const saved = localStorage.getItem("absensi_user_gembong") || localStorage.getItem("absensi_user");
      if (saved) {
        const userData = JSON.parse(saved) as KaryawanUser;
        const userCabang = normalizeBranchId(userData.cabang);
        if (userCabang === "gembong") {
          setUser(userData);
          await fetchAttendanceData(userData.id);
        } else {
          localStorage.removeItem("absensi_user_gembong");
          localStorage.removeItem("absensi_user");
        }
      }
    } catch (e) {
      console.error("Auth check failed", e);
    } finally {
      setCheckingAuth(false);
    }
  }, [fetchAttendanceData]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("current_branch", "gembong");
    document.documentElement.setAttribute("data-branch", "gembong");
    queueMicrotask(() => {
      checkPersistedUser();
      fetchConfig();
    });
  }, [checkPersistedUser, fetchConfig]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputUsername = (loginData.username || "").trim();
    const inputPassword = (loginData.password || "").trim();
    if (!inputUsername || !inputPassword) {
      alert("Silakan masukkan Username dan Password!");
      return;
    }
    
    setLoading(true);
    try {
      const res = await loginWithFirebaseAuth(db, inputUsername, inputPassword, {
        expectedRole: "employee",
        expectedBranch: "gembong",
        loginType: "absensi",
        storageKey: "absensi_user_gembong",
        branchStorageKey: "current_branch",
      });

      if (!res.success || !res.user) {
        alert(res.error || "Username atau Password salah! Pastikan huruf besar/kecil dan spasi sudah sesuai.");
        return;
      }

      const userData: KaryawanUser = {
        id: res.user.id || `emp_${res.user.username}`,
        nama: res.user.nama || res.user.username,
        username: res.user.username,
        cabang: res.user.cabang || "gembong",
        ...res.user
      };

      setUser(userData);
      setLoginData({ username: "", password: "" }); 
      await fetchAttendanceData(userData.id);
    } catch (err: unknown) {
      console.error("Login error", err);
      const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan sistem saat login.";
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutWithFirebaseAuth(["absensi_user_gembong", "absensi_user"]);
    setUser(null);
    setAttendanceToday(null);
    setHistory([]);
    setLoginData({ username: "", password: "" }); 
  };

  const handleHomeExit = async () => {
    await handleLogout();
    router.push("/");
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraReady(false);
  };

  const startCamera = async () => {
    if (!isWithinRadius) {
      alert("Anda berada di luar radius toko Gembong. Mendekat terlebih dahulu sebelum membuka kamera.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Browser ini tidak mendukung kamera. Gunakan perangkat mobile atau browser modern.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch (error) {
      console.error("Camera failed", error);
      alert("Tidak bisa membuka kamera. Pastikan izin kamera sudah diberikan.");
    }
  };

  const captureSelfie = async () => {
    if (!videoRef.current || !cameraReady) {
      alert("Kamera belum siap. Silakan buka kamera terlebih dahulu.");
      return;
    }

    setCapturing(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Gagal inisialisasi context kamera");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
      setSelfiePreview(dataUrl);
      stopCamera();
    } catch (e) {
      console.error("Failed to capture selfie", e);
      alert("Gagal mengambil foto. Coba kembali.");
    } finally {
      setCapturing(false);
    }
  };

  const [checkingLocation, setCheckingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const validateLocation = useCallback(async (manual = false) => {
    if (!config) return;

    if (!navigator.geolocation) {
      setLocationError("Perangkat tidak mendukung GPS.");
      return;
    }

    setCheckingLocation(true);
    setLocationError(null);

    const targetLat = parseFloat(config.location?.lat || config.lat || "-7.5265");
    const targetLng = parseFloat(config.location?.lng || config.lng || "108.8763");
    const maxRadius = parseFloat(config.location?.radius || config.radius || "50");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const dist = getDistance(pos.coords.latitude, pos.coords.longitude, targetLat, targetLng);
        const roundedDist = Math.round(dist);
        setDistance(roundedDist);
        const within = roundedDist <= maxRadius;
        setIsWithinRadius(within);
        setCheckingLocation(false);
        if (manual) {
          alert(`Lokasi terdeteksi! Jarak Anda dari toko: ${roundedDist} meter (Batas: ${maxRadius} meter).`);
        }
      },
      (err) => {
        console.error("Geolocation error", err);
        setCheckingLocation(false);
        let msg = "Gagal mengambil lokasi.";
        if (err.code === 1) msg = "Izin GPS ditolak. Silakan izinkan akses lokasi di pengaturan browser.";
        else if (err.code === 2) msg = "Sinyal GPS lemah / lokasi tidak ditemukan.";
        else if (err.code === 3) msg = "Pencarian lokasi GPS timeout.";
        setLocationError(msg);
        if (manual) alert(msg);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, [config]);

  const handleAbsen = async (type: "masuk" | "pulang") => {
    if (!user) return;
    if (!isWithinRadius) {
      alert("Anda berada di luar radius toko Gembong. Silakan dekati lokasi outlet untuk melakukan absensi.");
      return;
    }

    if (!selfiePreview) {
      alert("Silakan ambil foto selfie terlebih dahulu sebagai bukti kehadiran.");
      return;
    }

    setLoading(true);
    try {
      let finalPhotoUrl = selfiePreview;
      if (selfiePreview.startsWith("data:image")) {
        const cloudName = config?.cloudinaryCloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dkm0s5s2b";
        const uploadPreset = config?.cloudinaryUploadPreset || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "zonawaktu_preset";
        const folder = config?.cloudinaryFolder || "absensi_gembong";
        try {
          const blob = await (await fetch(selfiePreview)).blob();
          const file = new File([blob], `selfie-gembong-${Date.now()}.jpg`, { type: "image/jpeg" });
          finalPhotoUrl = await uploadToCloudinary(file, { cloudinaryCloudName: cloudName, cloudinaryUploadPreset: uploadPreset, cloudinaryFolder: folder });
        } catch (uploadErr) {
          console.warn("Cloudinary upload failed, using local format", uploadErr);
        }
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = now.toLocaleDateString('id-ID');

      if (type === "masuk") {
        const newLog = {
          karyawanId: user.id,
          nama: user.nama,
          tanggal: dateStr,
          jamMasuk: timeStr,
          jamPulang: "-",
          cabang: "gembong",
          selfieUrl: finalPhotoUrl,
          selfieMasukUrl: finalPhotoUrl,
          timestamp: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, "absensi_logs"), newLog);
        setAttendanceToday({ id: docRef.id, ...newLog });
        alert(`Absen MASUK berhasil dicatat pada pukul ${timeStr}!`);
      } else {
        if (!attendanceToday?.id) {
          alert("Data absen masuk tidak ditemukan untuk hari ini.");
          return;
        }
        const logRef = doc(db, "absensi_logs", attendanceToday.id);
        await updateDoc(logRef, {
          jamPulang: timeStr,
          selfiePulangUrl: finalPhotoUrl,
          updatedAt: serverTimestamp()
        });
        setAttendanceToday(prev => prev ? { ...prev, jamPulang: timeStr, selfiePulangUrl: finalPhotoUrl } : null);
        alert(`Absen PULANG berhasil dicatat pada pukul ${timeStr}!`);
      }

      setSelfiePreview(null);
      await fetchAttendanceData(user.id);
    } catch (e) {
      console.error("Attendance submission error", e);
      alert("Gagal menyimpan data absensi. Cek koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && config) {
      const timer = setTimeout(() => validateLocation(false), 0);
      const interval = setInterval(() => validateLocation(false), 30000);
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [user, config, validateLocation]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  if (checkingAuth) {
    return (
      <div className="min-h-[100dvh] bg-[#160c06] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#e6b88a] border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={cn(
          jakarta.className,
          "min-h-[100dvh] bg-[#f2e9dc] text-[#1e120a] flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden"
        )}
      >
        {/* Top Dark Espresso Hero Accent Band */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[44%] rounded-b-[3rem] sm:rounded-b-[4.5rem] shadow-2xl"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 0%, #3d2414 0%, #1c1008 65%, #120a05 100%)",
          }}
        />
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[420px] h-[240px] rounded-full bg-[#e6b88a]/15 blur-[90px]" />

        <div className="absolute top-5 left-5 sm:top-7 sm:left-7 z-20">
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-[#fdfaf5]/15 border border-[#e6b88a]/30 text-[#f8f2e8] hover:bg-[#e6b88a] hover:text-[#160c06] backdrop-blur-md transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative z-10 w-full max-w-[400px] flex flex-col items-center">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-14 w-14 rounded-full bg-[#fdfaf5] p-1.5 flex items-center justify-center border-2 border-[#e6b88a] shadow-[0_12px_30px_rgba(0,0,0,0.4)] mb-3">
              <img
                src="/images/hero/logo-zonawaktu.png"
                alt="Logo Zona Waktu"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-[11px] font-extrabold tracking-[0.28em] uppercase text-[#f8f2e8]">
              ZONA.WAKTU
            </span>
            <span className="text-[9px] font-bold tracking-[0.22em] uppercase text-[#e6b88a] mt-0.5">
              Absensi GPS &amp; Selfie Kehadiran
            </span>
          </div>

          <Card className="w-full rounded-[2rem] p-6 sm:p-8 bg-[#fdfaf5] border border-[#e2d2bc] shadow-[0_24px_60px_-15px_rgba(24,14,7,0.18)]">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4ecdf] border border-[#e2d2bc] text-[#6b3c16] text-[9px] font-extrabold uppercase tracking-[0.2em] mb-2.5">
                <MapPin className="h-3.5 w-3.5 text-[#8b4d20]" />
                Validasi Radius Outlet
              </div>
              <h1
                className={cn(
                  playfair.className,
                  "text-2xl sm:text-3xl font-bold text-[#1e120a] tracking-tight"
                )}
              >
                Portal <span className="italic font-semibold text-[#8b4d20]">Absensi</span>
              </h1>
              <p className="text-[11px] font-medium text-[#785c42] mt-1">
                Zona Waktu Gembong &bull; Coffee &amp; Teh Bakar
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#57402c]">
                  Username
                </Label>
                <Input 
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  className="h-12 rounded-xl border-[#dccab0] bg-[#f8f2e8] text-[#1e120a] font-semibold focus-visible:ring-[#6b3c16]"
                  placeholder="Masukkan username..."
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  autoComplete="username"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#57402c]">
                  Password
                </Label>
                <Input 
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="h-12 rounded-xl border-[#dccab0] bg-[#f8f2e8] text-[#1e120a] font-semibold focus-visible:ring-[#6b3c16]"
                  placeholder="••••••••"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  autoComplete="current-password"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#1e120a] via-[#2b180c] to-[#3b2212] hover:from-[#2b180c] hover:to-[#4c2b15] text-[#f8f2e8] border border-[#e6b88a]/30 font-extrabold uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-[#1e120a]/20"
              >
                {loading ? "Mengecek Akses..." : "Masuk Ke Portal Absensi"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(jakarta.className, "min-h-[100dvh] bg-[#f2e9dc] text-[#1e120a] flex flex-col items-center p-4 sm:p-6 md:p-10 relative")}>
      <div className="w-full max-w-2xl flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-[#1e120a] border border-[#e6b88a]/35 flex items-center justify-center shadow-md">
            <User className="h-6 w-6 sm:h-7 sm:w-7 text-[#e6b88a]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#1e120a] uppercase italic leading-none">{user.nama}</h2>
            <p className="text-[9px] sm:text-[10px] font-black text-[#785c42] uppercase tracking-widest mt-1">
              Cabang Gembong &bull; Status: {user.status || 'Aktif'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleHomeExit} variant="ghost" size="icon" className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-[#fdfaf5] shadow-sm hover:bg-[#eadcc9] border border-[#e2d2bc]" title="Keluar ke Beranda Cabang">
            <Home className="h-5 w-5 text-[#57402c]" />
          </Button>
          <Button onClick={handleLogout} variant="ghost" size="icon" className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-[#fdfaf5] shadow-sm hover:bg-rose-50 border border-[#e2d2bc]" title="Keluar / Logout">
            <LogOut className="h-5 w-5 text-rose-600" />
          </Button>
        </div>
      </div>

      {/* Hero Clock Card in Dark Chocolate Espresso */}
      <Card className="w-full max-w-2xl bg-gradient-to-br from-[#160c06] via-[#26150b] to-[#3b2212] rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 md:p-14 text-[#f8f2e8] shadow-2xl shadow-[#160c06]/25 border border-[#e6b88a]/30 relative overflow-hidden mb-6 sm:mb-8">
        <div className="relative z-10">
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#e6b88a] mb-3 sm:mb-4 tabular-nums">
            {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <div className="flex items-baseline gap-2 mb-6 sm:mb-10">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter tabular-nums text-[#f8f2e8]">
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </h1>
            <span className="text-lg sm:text-2xl text-[#e6b88a]/70 font-black mb-1 sm:mb-2 tabular-nums">
              {currentTime.toLocaleTimeString('id-ID', { second: '2-digit' })}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-xl border",
              isWithinRadius ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-100" : "bg-rose-500/20 border-rose-500/40 text-rose-100"
            )}>
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                {isWithinRadius ? `Dalam Area Gembong (${distance ?? 0}m)` : distance !== null ? `Luar Radius (${distance}m)` : (locationError || 'Mencari GPS...')}
              </span>
              <button 
                type="button"
                onClick={() => validateLocation(true)}
                title="Cek Ulang GPS"
                className="ml-1 p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <RefreshCw className={cn("h-3 w-3", checkingLocation && "animate-spin")} />
              </button>
            </div>
            <div className="flex items-center gap-2 bg-[#e6b88a]/15 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#e6b88a]/30 text-[#f2d6b6]">
              <Clock className="h-3 w-3" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                ZONA GEMBONG AKTIF
              </span>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 -right-10 -translate-y-1/2 opacity-10 pointer-events-none text-[#e6b88a]">
          <Clock className="h-48 w-48 sm:h-64 sm:w-64" />
        </div>
      </Card>

      <Card className="w-full max-w-2xl rounded-3xl sm:rounded-[2rem] bg-[#fdfaf5] p-5 sm:p-6 border border-[#e2d2bc] shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#785c42]">Selfie Absensi Gembong</p>
            <p className="text-xs sm:text-sm font-black text-[#1e120a]">Foto wajib diambil langsung dari kamera</p>
          </div>
          <Button onClick={startCamera} disabled={!isWithinRadius} className="rounded-xl bg-[#6b3c16] hover:bg-[#562f10] text-[#f8f2e8] h-10 px-4 text-[9px] font-black uppercase disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto">Buka Kamera</Button>
        </div>
        <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-4 items-start">
          <div className="rounded-[1.5rem] border border-[#e2d2bc] overflow-hidden bg-[#f8f2e8] min-h-[220px] sm:min-h-[240px] flex items-center justify-center">
            {cameraReady ? (
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
            ) : (
              <p className="text-center text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#947659]">Kamera belum aktif</p>
            )}
          </div>
          <div className="space-y-3">
            <Button onClick={captureSelfie} disabled={capturing || !cameraReady} className="w-full rounded-xl bg-[#1e120a] hover:bg-[#2b180c] text-[#f8f2e8] h-12 font-black uppercase text-[9px]">{capturing ? "Mengambil Foto..." : "Ambil Selfie"}</Button>
            <Button onClick={stopCamera} variant="outline" className="w-full rounded-xl border-[#dccab0] text-[#57402c] hover:bg-[#efe5d5] h-12 font-black uppercase text-[9px]">Tutup Kamera</Button>
            {selfiePreview ? (
              <Image src={selfiePreview} alt="Selfie absensi" width={400} height={160} className="w-full h-40 object-cover rounded-[1.2rem] border border-[#e2d2bc]" unoptimized />
            ) : (
              <div className="rounded-[1.2rem] border border-dashed border-[#dccab0] p-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-[#947659]">Foto selfie belum diambil</div>
            )}
          </div>
        </div>
      </Card>

      <div className="w-full max-w-2xl grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        <Card className="rounded-3xl sm:rounded-[2.5rem] bg-[#fdfaf5] p-5 sm:p-8 border border-[#e2d2bc] shadow-sm flex flex-col items-start gap-2.5 sm:gap-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#785c42]">Masuk</p>
          <p className="text-lg sm:text-2xl font-black text-[#1e120a] tabular-nums">{attendanceToday?.jamMasuk || "--:--:--"}</p>
          {attendanceToday?.jamMasuk && attendanceToday.jamMasuk !== "-" && (
            <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] font-black uppercase">Hadir</div>
          )}
          {!attendanceToday?.jamMasuk && (
             <Button 
               disabled={!isWithinRadius}
               onClick={() => handleAbsen('masuk')} 
               className="mt-2 w-full rounded-xl bg-[#6b3c16] hover:bg-[#562f10] text-[#f8f2e8] font-black uppercase text-[9px] h-10 disabled:opacity-50"
             >
               Absen Masuk
             </Button>
          )}
        </Card>
        <Card className="rounded-3xl sm:rounded-[2.5rem] bg-[#fdfaf5] p-5 sm:p-8 border border-[#e2d2bc] shadow-sm flex flex-col items-start gap-2.5 sm:gap-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#785c42]">Pulang</p>
          <p className="text-lg sm:text-2xl font-black text-[#1e120a] tabular-nums">{attendanceToday?.jamPulang || "--:--:--"}</p>
          {attendanceToday?.jamPulang && attendanceToday.jamPulang !== "-" && (
            <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] font-black uppercase">Selesai</div>
          )}
          {attendanceToday?.jamMasuk && (!attendanceToday?.jamPulang || attendanceToday.jamPulang === "-") && (
             <Button 
               disabled={!isWithinRadius}
               onClick={() => handleAbsen('pulang')} 
               className="mt-2 w-full rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-[9px] h-10 disabled:opacity-50"
             >
               Absen Pulang
             </Button>
          )}
        </Card>
      </div>

      {attendanceToday?.jamMasuk && (
        <Card className="w-full max-w-2xl rounded-[1.5rem] bg-emerald-50 p-5 sm:p-8 border border-emerald-200 flex items-center justify-center gap-3 sm:gap-4 mb-6 animate-in slide-in-from-top-4">
          <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-[0.18em] text-emerald-800">SESI ABSEN GEMBONG TERVERIFIKASI</p>
        </Card>
      )}

      {!isWithinRadius && (
        <Card className="w-full max-w-2xl rounded-[1.5rem] bg-rose-50 p-5 sm:p-6 border border-rose-200 flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest">LUAR RADIUS TOKO GEMBONG</p>
              <p className="text-[8px] font-bold text-rose-500 uppercase mt-0.5">
                Jarak Anda: {distance !== null ? `${distance} meter` : "Mengecek..."}
              </p>
            </div>
          </div>
          <Button 
            onClick={() => validateLocation(true)}
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full hover:bg-rose-100 text-rose-500 shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </Card>
      )}

      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-5 px-2">
          <CalendarDays className="h-5 w-5 text-[#6b3c16]" />
          <h3 className="text-sm font-black uppercase tracking-widest text-[#1e120a]">Riwayat Kehadiran Gembong</h3>
        </div>
        <div className="space-y-3">
          {history.length > 0 ? history.map((log) => (
            <Card key={log.id} className="rounded-3xl p-5 sm:p-6 bg-[#fdfaf5] border border-[#e2d2bc] shadow-sm flex flex-col gap-3 group hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-[#1e120a] uppercase italic tracking-tight">{log.tanggal}</p>
                  <p className="text-[10px] font-bold text-[#785c42] uppercase mt-1 tabular-nums">
                    {log.jamMasuk} - {log.jamPulang}
                  </p>
                </div>
                <div className="px-4 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black uppercase">Hadir</div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-1">
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase text-[#785c42]">Foto Masuk ({log.jamMasuk || "-"})</span>
                  {log.selfieMasukUrl || log.selfieUrl ? (
                    <Image src={(log.selfieMasukUrl || log.selfieUrl) as string} alt="Foto Masuk" width={300} height={120} className="w-full h-28 object-cover rounded-xl border border-[#e2d2bc]" unoptimized />
                  ) : (
                    <div className="w-full h-28 rounded-xl border border-dashed border-[#dccab0] bg-[#f8f2e8] flex items-center justify-center text-[8px] font-black uppercase text-[#947659]">Tidak Ada Foto</div>
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase text-[#785c42]">Foto Pulang ({log.jamPulang || "-"})</span>
                  {log.selfiePulangUrl ? (
                    <Image src={log.selfiePulangUrl as string} alt="Foto Pulang" width={300} height={120} className="w-full h-28 object-cover rounded-xl border border-[#e2d2bc]" unoptimized />
                  ) : (
                    <div className="w-full h-28 rounded-xl border border-dashed border-[#dccab0] bg-[#f8f2e8] flex items-center justify-center text-[8px] font-black uppercase text-[#947659]">Belum Pulang</div>
                  )}
                </div>
              </div>
            </Card>
          )) : (
            <p className="text-center py-10 text-[10px] font-black text-[#947659] uppercase tracking-widest">Belum ada riwayat</p>
          )}
        </div>
      </div>
    </div>
  );
}
