"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X, Loader2 } from "lucide-react";
import { EmployeeSidebar } from "@/components/layout/employee-sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useActiveBranch, BRANCH_LIST } from "@/lib/branch-helper";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const router = useRouter();
  const activeBranch = useActiveBranch();
  const branchInfo = BRANCH_LIST[activeBranch] || BRANCH_LIST.gembong;

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const role = localStorage.getItem("user_role");

        if (role === "employee" || role === "admin" || role === "owner") {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          router.replace("/employee-login");
        }
      } catch {
        setAuthorized(false);
        router.replace("/employee-login");
      }
    });
  }, [router]);

  if (authorized === null) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#f2e9dc] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#6b3c16]" />
        <p className="text-xs font-black uppercase tracking-widest text-[#785c42]">
          Memeriksa Hak Akses...
        </p>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="zw-app-shell flex h-[100dvh] overflow-hidden bg-[#f2e9dc] p-0 lg:p-3.5">
      <aside className="hidden lg:flex w-72 flex-col overflow-hidden rounded-[2.25rem] shadow-2xl shadow-[#1e120a]/25 bg-gradient-to-b from-[#1e110a] via-[#160c06] to-[#0f0804] border border-[#e6b88a]/15 z-30 shrink-0">
        <EmployeeSidebar />
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden relative ml-0 lg:ml-4">
        {/* Mobile Top Bar */}
        <header className="flex items-center justify-between border-b border-[#e2d2bc] bg-[#fdfaf5]/95 px-4 py-2.5 backdrop-blur-md sm:px-6 lg:hidden z-30 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative h-8 w-8 rounded-full bg-white p-0.5 shadow-sm ring-1 ring-[#6b3c16]/25 shrink-0 overflow-hidden">
              <Image
                src="/images/hero/logo-zonawaktu.png"
                alt="Zona Waktu"
                fill
                sizes="32px"
                className="object-contain rounded-full"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#785c42]">
                  Zona Waktu
                </p>
                <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-[#2b180c] text-[#e6b88a]">
                  {branchInfo.shortName}
                </span>
              </div>
              <p className="text-xs font-black uppercase italic text-[#1e120a] truncate">
                Panel Karyawan
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="h-10 w-10 rounded-2xl bg-[#1e120a] text-[#e6b88a] hover:bg-[#2d1d11] shadow-sm shrink-0"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {/* Mobile Overlay Backdrop */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-[#120a05]/60 backdrop-blur-xs transition-all duration-300 lg:hidden",
            mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />

        {/* Mobile Drawer */}
        <div
          className={cn(
            "fixed left-0 top-0 z-50 h-full w-72 max-w-[85vw] transform border-r border-[#e6b88a]/20 bg-[#160c06] shadow-2xl transition-transform duration-300 lg:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <EmployeeSidebar onItemClick={() => setMobileOpen(false)} />
        </div>

        <main className="flex-1 overflow-y-auto px-3 py-3 sm:px-5 md:px-6 lg:px-8 pb-16 lg:py-4 custom-scrollbar">
          <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
