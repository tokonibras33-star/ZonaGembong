"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, Menu, LogOut, Store, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFirestore, useDoc, useMemoFirebase, doc } from "@/firebase";
import {
  useActiveBranch,
  getStoreConfigDocId,
  getDefaultStoreIdentity,
  BRANCH_LIST,
} from "@/lib/branch-helper";
import { logoutWithFirebaseAuth } from "@/lib/auth-service";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

export function Header() {
  const router = useRouter();
  const db = useFirestore();
  const activeBranch = useActiveBranch();
  const defaultIdentity = getDefaultStoreIdentity(activeBranch);

  const settingsRef = useMemoFirebase(
    () => doc(db, "settings", getStoreConfigDocId(activeBranch)),
    [db, activeBranch]
  );
  const { data: settings } = useDoc(settingsRef);
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  React.useEffect(() => {
    queueMicrotask(() => {
      try {
        setRole(localStorage.getItem("user_role"));
      } catch {}
    });
  }, []);

  const isOwner = role === "owner";
  const homeHref = isOwner ? "/dashboard" : "/penjualan/kasir";

  const storeName = settings?.name || defaultIdentity.name;
  const logoHeader = settings?.logoHeader;

  const branchInfo = BRANCH_LIST[activeBranch] || BRANCH_LIST.gembong;

  const handleLogout = async () => {
    await logoutWithFirebaseAuth();
    router.push("/");
  };

  return (
    <header className="w-full bg-transparent flex flex-col justify-center px-3 sm:px-5 md:px-8 z-40 pt-2.5 pb-1.5 md:py-0 md:h-20 shrink-0">
      <div className="flex items-center justify-between w-full h-12 md:h-full gap-2.5">
        {/* LEFT: Mobile Hamburger + Brand Identity */}
        <div className="flex items-center gap-2.5 md:gap-4 min-w-0">
          {/* MOBILE HAMBURGER MENU */}
          <div className="lg:hidden shrink-0">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-2xl bg-[#1e120a] text-[#e6b88a] hover:bg-[#2d1d11] hover:text-[#fdfaf5] shadow-md border border-[#e6b88a]/25"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="p-0 border-r border-[#e6b88a]/20 w-72 max-w-[85vw] bg-[#160c06]"
              >
                <SheetTitle className="sr-only">Menu Navigasi Zona Waktu</SheetTitle>
                <Sidebar onItemClick={() => setIsOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center min-w-0" suppressHydrationWarning>
            {logoHeader ? (
              <div className="relative h-9 w-32 md:h-11 md:w-44 transition-transform hover:scale-[1.02]">
                <Image
                  src={logoHeader}
                  alt={storeName}
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            ) : (
              <Link href={homeHref} className="flex items-center gap-2.5 min-w-0">
                <div className="relative h-9 w-9 md:h-10 md:w-10 rounded-full bg-white p-0.5 shadow-md ring-1 ring-[#6b3c16]/25 shrink-0 overflow-hidden">
                  <Image
                    src="/images/hero/logo-zonawaktu.png"
                    alt={storeName}
                    fill
                    sizes="40px"
                    className="object-contain rounded-full"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm font-black tracking-tight text-[#1e120a] uppercase italic leading-none block truncate">
                    {storeName}
                  </span>
                  <span className="text-[8px] font-bold text-[#785c42] tracking-[0.18em] uppercase mt-0.5 block truncate">
                    {branchInfo.code} &bull; Gembong
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* CENTER (DESKTOP): STORE IDENTITY BADGE IN DARK ESPRESSO & GOLD */}
        <div className="hidden md:flex flex-1 max-w-xl justify-center py-1">
          <div className="flex items-center bg-gradient-to-r from-[#1e110a] via-[#2b180c] to-[#1e110a] border border-[#e6b88a]/35 rounded-full px-5 py-2 shadow-md gap-2.5">
            <Sparkles className="h-3.5 w-3.5 text-[#e6b88a] shrink-0" />
            <span className="font-black text-[11px] uppercase tracking-[0.18em] text-[#fdfaf5]">
              OUTLET &amp; GUDANG UTAMA GEMBONG
            </span>
            <span className="h-2 w-2 rounded-full bg-[#e6b88a] animate-pulse shrink-0" />
          </div>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl text-[#5a412c] relative bg-[#fdfaf5] shadow-sm hover:bg-[#efe5d5] border border-[#e2d2bc] h-10 w-10 hidden sm:flex"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-[#6b3c16] rounded-full" />
          </Button>

          {/* User Account / Profile Dropdown */}
          <div className="relative">
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 md:gap-2.5 pl-1.5 pr-2.5 md:pr-3 py-1 bg-[#fdfaf5] rounded-2xl shadow-sm border border-[#e2d2bc] cursor-pointer hover:bg-[#f8f2e8] transition-all select-none"
            >
              <Avatar className="h-8 w-8 rounded-xl border border-[#e2d2bc] shadow-xs">
                <AvatarImage src="/images/hero/logo-zonawaktu.png" />
                <AvatarFallback className="bg-[#2b180c] text-[#e6b88a] text-xs font-bold">
                  ZW
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-[10px] font-black text-[#1e120a] leading-none uppercase italic">
                  {isOwner ? "Owner" : "Admin Operasional"}
                </p>
                <p className="text-[8px] font-bold uppercase tracking-widest mt-0.5 text-[#6b3c16]">
                  {branchInfo.shortName}
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[#785c42] ml-0.5" />
            </div>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#fdfaf5] rounded-2xl shadow-2xl border border-[#e2d2bc] p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2.5 border-b border-[#efe5d5] bg-[#f8f2e8] rounded-xl mb-1">
                  <p className="text-xs font-black uppercase text-[#1e120a]">
                    Zona Waktu Gembong
                  </p>
                  <p className="text-[10px] text-[#785c42] font-medium">
                    {isOwner ? "Otoritas Penuh Owner" : "Panel Admin Operasional"}
                  </p>
                </div>

                <div className="py-1 space-y-0.5">
                  {isOwner && (
                    <Link
                      href="/pengaturan"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#422d1d] hover:bg-[#efe5d5] rounded-xl transition-colors"
                    >
                      <Store className="h-4 w-4 text-[#6b3c16]" />
                      <span>Pengaturan Hak Akses</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 text-rose-600" />
                    <span>Keluar / Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE STORE BADGE */}
      <div className="md:hidden w-full pt-1.5">
        <div className="flex items-center justify-center gap-2 py-1.5 px-3 bg-gradient-to-r from-[#1e110a] via-[#2b180c] to-[#1e110a] border border-[#e6b88a]/30 rounded-xl shadow-xs w-full">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e6b88a] animate-pulse shrink-0" />
          <span className="font-black text-[9px] uppercase tracking-[0.18em] text-[#fdfaf5] truncate">
            OUTLET &amp; GUDANG UTAMA GEMBONG
          </span>
        </div>
      </div>
    </header>
  );
}
