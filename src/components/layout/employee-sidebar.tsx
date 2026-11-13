"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Truck,
  ClipboardList,
  Layers,
  Wallet,
  Gift,
  AlertTriangle,
  Store,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutWithFirebaseAuth } from "@/lib/auth-service";
import { useActiveBranch, BRANCH_LIST } from "@/lib/branch-helper";

const menuGroups = [
  {
    title: "General",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, href: "/employee/dashboard" },
    ],
  },
  {
    title: "Operasional",
    items: [
      { name: "Operasional Kontainer", icon: ClipboardList, href: "/employee/operasional-kontainer" },
      { name: "Keuangan Kontainer", icon: Wallet, href: "/employee/keuangan-kontainer" },
      { name: "Input Free", icon: Gift, href: "/employee/input-free" },
      { name: "Titip Jual (Konsinyasi)", icon: Store, href: "/employee/titip-jual" },
    ],
  },
  {
    title: "Inventori",
    items: [
      { name: "Input Bahan Baku", icon: Truck, href: "/employee/input-bahan-baku" },
      { name: "Input Bahan Rusak", icon: AlertTriangle, href: "/employee/input-bahan-rusak" },
      { name: "Opnam Harian", icon: Layers, href: "/employee/opnam-harian" },
    ],
  },
];

interface EmployeeSidebarProps {
  onItemClick?: () => void;
}

export function EmployeeSidebar({ onItemClick }: EmployeeSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [employeeName, setEmployeeName] = useState<string>("");
  const activeBranch = useActiveBranch();
  const branchInfo = BRANCH_LIST[activeBranch] || BRANCH_LIST.gembong;

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const savedUser =
          localStorage.getItem("karyawan_user") || localStorage.getItem("absensi_user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setEmployeeName(parsed.nama || parsed.username || "");
        } else {
          const storedName = localStorage.getItem("employee_name");
          if (storedName) setEmployeeName(storedName);
        }
      } catch {}
    });
  }, []);

  const handleLogout = async () => {
    onItemClick?.();
    await logoutWithFirebaseAuth();
    router.push("/employee-login");
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#1e110a] via-[#160c06] to-[#0f0804] text-[#f8f2e8] py-5 sm:py-6 select-none">
      {/* Header Profile in Employee Sidebar */}
      <div className="mb-5 px-5">
        <div className="flex items-center gap-3 bg-white/[0.05] p-3 rounded-2xl border border-[#e6b88a]/20">
          <div className="relative h-9 w-9 rounded-full bg-white p-0.5 shrink-0 ring-1 ring-[#e6b88a]/40 overflow-hidden">
            <Image
              src="/images/hero/logo-zonawaktu.png"
              alt="Zona Waktu"
              fill
              sizes="36px"
              className="object-contain rounded-full"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase italic leading-none tracking-wider text-[#fdfaf5]">
                PANEL KARYAWAN
              </span>
            </div>
            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.15em] text-[#e6b88a]">
              {branchInfo.shortName} ({branchInfo.code})
            </span>
          </div>
        </div>

        {employeeName && (
          <div className="mt-2.5 flex items-center gap-2 text-[10px] font-bold uppercase text-[#fdfaf5] bg-white/[0.06] px-3 py-1.5 rounded-xl border border-white/10 w-full truncate">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">{employeeName}</span>
          </div>
        )}
      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <nav className="space-y-7 pb-10">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <h4 className="mb-2.5 px-3 text-[9px] font-black uppercase tracking-[0.28em] text-[#e6b88a]/55">
                {group.title}
              </h4>
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onItemClick}
                      className={cn(
                        "group flex items-center justify-between rounded-2xl px-4 py-3 text-[11px] font-bold transition-all duration-300 uppercase tracking-wider min-h-11",
                        isActive
                          ? "bg-gradient-to-r from-[#e6b88a] to-[#c48945] text-[#160c06] font-black shadow-lg shadow-black/40 scale-[1.01]"
                          : "text-[#f8f2e8]/70 hover:bg-white/[0.06] hover:text-[#fdfaf5]"
                      )}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <item.icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                            isActive
                              ? "text-[#160c06]"
                              : "text-[#e6b88a]/70 group-hover:text-[#e6b88a]"
                          )}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {isActive && (
                        <div className="h-1.5 w-1.5 rounded-full bg-[#160c06] animate-pulse shrink-0" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="mt-auto px-4 pt-3 border-t border-white/[0.08]">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="h-11 w-full justify-start gap-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 hover:text-white transition-all border border-rose-500/25 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Keluar (Logout)
        </Button>
      </div>
    </div>
  );
}
