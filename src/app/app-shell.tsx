"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { FirebaseClientProvider, getActiveBranch } from "@/firebase";
import { Toaster } from "@/components/ui/toaster";

const Sidebar = dynamic(() => import("@/components/layout/sidebar").then((m) => m.Sidebar), {
  ssr: false,
});
const Header = dynamic(() => import("@/components/layout/header").then((m) => m.Header), {
  ssr: false,
});

// Daftar rute yang diizinkan untuk role "admin"
const ADMIN_ALLOWED_ROUTES = [
  "/penjualan/kasir",
  "/operasional/titip-jual",
  "/operasional/rekapan-stock-kritis",
  "/admin/stock-opname",
  "/admin/belanja-bahan-baku",
  "/laporan/closing-toko",
];

function isRouteAllowedForAdmin(pathname: string): boolean {
  return ADMIN_ALLOWED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<"checking" | "authorized" | "unauthorized">("checking");

  const isStandalonePage =
    pathname === "/" ||
    pathname === "/zona_gembong" ||
    pathname.startsWith("/zona_gembong") ||
    pathname === "/absensi" ||
    pathname === "/owner-login" ||
    pathname === "/admin-login" ||
    pathname.startsWith("/employee");

  useEffect(() => {
    const updateBranchAttr = () => {
      const active = getActiveBranch();
      document.documentElement.setAttribute("data-branch", active);
    };
    updateBranchAttr();
    window.addEventListener("branch_changed", updateBranchAttr);
    return () => window.removeEventListener("branch_changed", updateBranchAttr);
  }, [pathname]);

  // Strict Route Guard untuk seluruh halaman Owner & Admin (Non-Standalone)
  useEffect(() => {
    if (isStandalonePage) {
      queueMicrotask(() => setAuthStatus("authorized"));
      return;
    }

    queueMicrotask(() => {
      try {
        const role = localStorage.getItem("user_role");

        // 1. Jika belum login atau role adalah employee -> tolak akses ke halaman Owner/Admin
        if (!role) {
          setAuthStatus("unauthorized");
          router.replace("/owner-login");
          return;
        }

        if (role === "employee") {
          setAuthStatus("unauthorized");
          router.replace("/employee/dashboard");
          return;
        }

        // 2. Jika role adalah "admin", pastikan hanya bisa membuka rute yang diizinkan untuk Admin
        if (role === "admin") {
          if (!isRouteAllowedForAdmin(pathname)) {
            setAuthStatus("unauthorized");
            router.replace("/penjualan/kasir");
            return;
          }
          setAuthStatus("authorized");
          return;
        }

        // 3. Jika role adalah "owner", izinkan akses penuh ke seluruh rute manajemen
        if (role === "owner") {
          setAuthStatus("authorized");
          return;
        }

        // Fallback: role tidak dikenal
        setAuthStatus("unauthorized");
        router.replace("/");
      } catch {
        setAuthStatus("unauthorized");
        router.replace("/");
      }
    });
  }, [pathname, isStandalonePage, router]);

  return (
    <FirebaseClientProvider>
      {isStandalonePage ? (
        <main className="w-full min-h-[100dvh]">{children}</main>
      ) : authStatus !== "authorized" ? (
        <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#f2e9dc] gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#6b3c16]" />
          <p className="text-xs font-black uppercase tracking-widest text-[#785c42]">
            Memverifikasi Otoritas Akses...
          </p>
        </div>
      ) : (
        <div className="zw-app-shell flex h-[100dvh] overflow-hidden p-0 lg:p-3.5 bg-[#f2e9dc]">
          <aside className="hidden lg:flex w-72 flex-col rounded-[2.25rem] overflow-hidden shadow-2xl shadow-[#1e120a]/25 bg-gradient-to-b from-[#1e110a] via-[#160c06] to-[#0f0804] border border-[#e6b88a]/15 z-30 shrink-0">
            <Sidebar />
          </aside>

          <div className="flex flex-1 flex-col overflow-hidden relative ml-0 lg:ml-4">
            <Header />

            <main className="flex-1 overflow-y-auto px-3 sm:px-5 md:px-8 pt-2 pb-16 md:py-4 custom-scrollbar">
              <div className="mx-auto max-w-7xl w-full">{children}</div>
            </main>
          </div>
        </div>
      )}
      <Toaster />
    </FirebaseClientProvider>
  );
}
