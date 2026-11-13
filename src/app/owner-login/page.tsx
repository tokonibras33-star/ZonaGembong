"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { loginWithFirebaseAuth } from "@/lib/auth-service";
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function OwnerLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("current_branch", "gembong");
    document.documentElement.setAttribute("data-branch", "gembong");
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const result = await loginWithFirebaseAuth({
      username,
      password,
      expectedRole: "owner",
      expectedBranch: "gembong"
    });

    if (result.success) {
      localStorage.setItem("current_branch", "gembong");
      localStorage.setItem("user_role", "owner");
      setUsername("");
      setPassword("");
      router.push("/dashboard");
    } else {
      setError(result.error || "Username atau password salah");
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        jakarta.className,
        "min-h-[100dvh] bg-[#f2e9dc] text-[#1e120a] overflow-hidden relative flex flex-col justify-center items-center px-4 py-10"
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

      {/* Back Button */}
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
        {/* Brand Header on Dark Espresso Backdrop */}
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
            Outlet &amp; Gudang Utama Gembong
          </span>
        </div>

        {/* Warm Ivory Cream Login Card with Dark Chocolate Accents */}
        <div className="w-full p-6 sm:p-8 bg-[#fdfaf5] border border-[#e2d2bc] rounded-[2rem] shadow-[0_24px_60px_-15px_rgba(24,14,7,0.18)]">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4ecdf] border border-[#e2d2bc] text-[#6b3c16] text-[9px] font-extrabold uppercase tracking-[0.2em] mb-2.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#8b4d20]" />
              Otoritas Pemilik
            </div>
            <h1
              className={cn(
                playfair.className,
                "text-2xl sm:text-3xl font-bold text-[#1e120a] tracking-tight"
              )}
            >
              Owner <span className="italic font-semibold text-[#8b4d20]">Portal</span>
            </h1>
            <p className="text-[11px] font-medium text-[#785c42] mt-1">
              Masuk untuk mengakses analisa keuangan &amp; kontrol penuh outlet.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label
                htmlFor="username"
                className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#57402c]"
              >
                Username Owner
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 rounded-xl bg-[#f8f2e8] border-[#dccab0] text-[#1e120a] placeholder:text-[#a88e72] font-semibold focus-visible:ring-[#6b3c16]"
                placeholder="Masukkan username owner"
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#57402c]"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl bg-[#f8f2e8] border-[#dccab0] text-[#1e120a] placeholder:text-[#a88e72] font-semibold pr-11 focus-visible:ring-[#6b3c16]"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-1.5 flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword((s) => !s)}
                    className="h-9 w-9 rounded-lg text-[#785c42] hover:text-[#1e120a] hover:bg-[#eadcc9]/60"
                    type="button"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-rose-700 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#1e120a] via-[#2b180c] to-[#3b2212] hover:from-[#2b180c] hover:to-[#4c2b15] text-[#f8f2e8] border border-[#e6b88a]/30 font-extrabold text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-[#1e120a]/20 transition-all"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#e6b88a]" />}
              {loading ? "Memproses..." : "Login Owner"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
