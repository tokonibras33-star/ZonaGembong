"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingUp,
  Soup,
  ClipboardCheck,
  PlusCircle,
  BarChart4,
  Settings,
  Boxes,
  Database,
  UserCheck,
  Truck,
  Home,
  ClipboardList,
  Store,
  AlertOctagon,
  GitMerge,
  Cookie,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActiveBranch, BRANCH_LIST } from "@/lib/branch-helper";
import { logoutWithFirebaseAuth } from "@/lib/auth-service";

const menuGroups = [
  {
    title: "General",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    ],
  },
  {
    title: "Operasional",
    items: [
      { name: "Closing Toko", icon: PlusCircle, href: "/penjualan/kasir" },
      { name: "Operasional Toko", icon: Store, href: "/operasional/operasional-toko" },
      { name: "Rekapan Stock Kritis", icon: AlertOctagon, href: "/operasional/rekapan-stock-kritis" },
      { name: "Titip Jual (Konsinyasi)", icon: Cookie, href: "/operasional/titip-jual" },
    ],
  },
  {
    title: "Laporan",
    items: [
      { name: "Laporan", icon: BarChart4, href: "/laporan" },
    ],
  },
  {
    title: "Inventori Gudang",
    items: [
      { name: "Input Bahan Baku", icon: Truck, href: "/inventori/input-bahan" },
      { name: "Harga Bahan Baku", icon: TrendingUp, href: "/inventori/harga-bahan-baku" },
      { name: "Stok Bahan Baku", icon: Boxes, href: "/stok/bahan-baku" },
      { name: "Stock Opname", icon: ClipboardList, href: "/inventori/stock-opname" },
      { name: "Katalog Produk", icon: Soup, href: "/master/produk" },
      { name: "Alokasi Bahan Baku", icon: GitMerge, href: "/inventori/alokasi-bahan-baku" },
      { name: "Resep Produk", icon: ClipboardCheck, href: "/master/resep" },
      { name: "Master Bahan Baku", icon: Database, href: "/master/bahan-baku" },
    ],
  },
  {
    title: "Setting",
    items: [
      { name: "Pengaturan Umum", icon: Settings, href: "/pengaturan" },
      { name: "Pengaturan Absensi", icon: UserCheck, href: "/pengaturan/absensi" },
    ],
  },
];

const adminMenuGroups = [
  {
    title: "Admin Menu",
    items: [
      { name: "Closing Toko", icon: PlusCircle, href: "/penjualan/kasir" },
      { name: "Titip Jual (Konsinyasi)", icon: Cookie, href: "/operasional/titip-jual" },
      { name: "Stock Kritis", icon: AlertOctagon, href: "/operasional/rekapan-stock-kritis" },
      { name: "Stock Opname", icon: ClipboardList, href: "/admin/stock-opname" },
      { name: "Belanja Bahan Baku", icon: Truck, href: "/admin/belanja-bahan-baku" },
      { name: "Laporan Closing Toko", icon: ClipboardList, href: "/laporan/closing-toko" },
    ],
  },
];

interface SidebarProps {
  onItemClick?: () => void;
}

export function Sidebar({ onItemClick }: SidebarProps) {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const activeBranch = useActiveBranch();
  const branchInfo = BRANCH_LIST[activeBranch] || BRANCH_LIST.gembong;

  useEffect(() => {
    queueMicrotask(() => {
      setRole(localStorage.getItem("user_role"));
    });
  }, []);

  const groups = role === "admin" ? adminMenuGroups : menuGroups;

  return (
    <div className="flex h-full flex-col py-5 bg-gradient-to-b from-[#1e110a] via-[#160c06] to-[#0f0804] text-[#f8f2e8] select-none">
      {/* Brand & Active Outlet Header in Sidebar */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between bg-white/[0.05] p-3 rounded-2xl border border-[#e6b88a]/20 backdrop-blur-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative h-8 w-8 rounded-full bg-white p-0.5 shrink-0 ring-1 ring-[#e6b88a]/40 overflow-hidden">
              <Image
                src="/images/hero/logo-zonawaktu.png"
                alt="Zona Waktu"
                fill
                sizes="32px"
                className="object-contain rounded-full"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#e6b88a]/75">
                Outlet Aktif
              </span>
              <span className="text-xs font-black uppercase italic text-[#fdfaf5] leading-tight truncate">
                {branchInfo.shortName}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase border border-[#e6b88a]/35 bg-[#e6b88a]/15 text-[#e6b88a] shrink-0">
            <span className="inline-block h-1.5 w-1.5 rounded-full mr-1 bg-[#e6b88a] animate-pulse" />
            {branchInfo.code}
          </span>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <nav className="space-y-7 pb-10">
          {groups.map((group) => (
            <div key={group.title}>
              <h4 className="px-3.5 text-[9px] font-black uppercase tracking-[0.28em] text-[#e6b88a]/55 mb-3">
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
                        "group flex items-center justify-between rounded-2xl px-4 py-3 text-[11px] font-bold transition-all duration-300 uppercase tracking-wider",
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

      {/* Footer Back to Landing Page */}
      <div className="px-4 mt-auto pt-3 border-t border-white/[0.08]">
        <Link
          href="/"
          onClick={() => {
            void logoutWithFirebaseAuth();
            onItemClick?.();
          }}
        >
          <Button
            variant="ghost"
            className="w-full justify-start gap-3.5 rounded-2xl h-12 text-[#e6b88a]/80 hover:text-[#fdfaf5] hover:bg-white/[0.08] font-black uppercase tracking-widest text-[10px] transition-all"
          >
            <Home className="h-4 w-4 text-[#e6b88a]" />
            Landing Page
          </Button>
        </Link>
      </div>
    </div>
  );
}
