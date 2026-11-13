"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import {
  ShieldCheck,
  UserCheck,
  Users,
  CalendarCheck,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { useFirestore, useDoc, useMemoFirebase, doc } from "@/firebase";
import { setActiveBranch } from "@/lib/branch-helper";
import { HeroCupVisual, DrinkVariantId } from "@/components/hero/hero-cup-visual";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

interface DrinkShowcase {
  id: DrinkVariantId;
  watermark: string;
  titleLine1: string;
  titleLine2: string;
  badge: string;
  craftHeading: string;
  craftDescription: string;
  description: string;
  bgBase: string;
  bgGradient: string;
  glowColor: string;
  accentHex: string;
  pillBorder: string;
  beansConfig: Array<{
    top: string;
    left: string;
    size: number;
    rotate: number;
    blur?: string;
    type: "bean" | "leaf";
  }>;
}

const SIGNATURE_DRINKS: DrinkShowcase[] = [
  {
    id: "gula-aren",
    watermark: "Gula Aren",
    titleLine1: "Kopi Susu",
    titleLine2: "& Gula Aren",
    badge: "Signature Coffee #01",
    craftHeading: "Slow Brewed, Served Cold",
    craftDescription:
      "Racikan espresso pilihan di atas susu segar dan es kristal, berpadu manis alami gula aren murni.",
    description:
      "Perpaduan house blend espresso dengan susu creamy dan legitnya gula aren asli khas Zona Waktu Gembong.",
    bgBase: "#120a06",
    bgGradient:
      "radial-gradient(ellipse 65% 55% at 50% 52%, #3b2313 0%, #1c1008 52%, #0b0603 100%)",
    glowColor: "rgba(212, 163, 115, 0.28)",
    accentHex: "#e6b88a",
    pillBorder: "rgba(230, 184, 138, 0.35)",
    beansConfig: [
      { top: "14%", left: "12%", size: 44, rotate: -25, blur: "1px", type: "bean" },
      { top: "28%", left: "38%", size: 28, rotate: 35, type: "bean" },
      { top: "18%", left: "63%", size: 34, rotate: -15, type: "bean" },
      { top: "36%", left: "86%", size: 48, rotate: 42, blur: "1.5px", type: "bean" },
      { top: "68%", left: "26%", size: 24, rotate: -48, type: "bean" },
    ],
  },
  {
    id: "teh-bakar",
    watermark: "Teh Bakar",
    titleLine1: "Signature",
    titleLine2: "& Teh Bakar",
    badge: "Authentic Roasted Tea #02",
    craftHeading: "Smoky Roasted, Silky Foam",
    craftDescription:
      "Daun teh pilihan yang dipanggang perlahan menghasilkan aroma karamel smoky yang autentik dan menyegarkan.",
    description:
      "Identitas khas Zona Waktu: teh bakar dengan karakter rasa hangat, segar, dan lapisan buih lembut di atasnya.",
    bgBase: "#160807",
    bgGradient:
      "radial-gradient(ellipse 65% 55% at 50% 52%, #421712 0%, #210b09 52%, #0c0403 100%)",
    glowColor: "rgba(224, 122, 95, 0.30)",
    accentHex: "#f2a68d",
    pillBorder: "rgba(242, 166, 141, 0.35)",
    beansConfig: [
      { top: "16%", left: "15%", size: 42, rotate: 18, blur: "1px", type: "leaf" },
      { top: "24%", left: "36%", size: 28, rotate: -32, type: "leaf" },
      { top: "21%", left: "65%", size: 32, rotate: 28, type: "bean" },
      { top: "32%", left: "84%", size: 46, rotate: -22, blur: "1px", type: "leaf" },
      { top: "64%", left: "29%", size: 26, rotate: 55, type: "leaf" },
    ],
  },
  {
    id: "choco-bengbeng",
    watermark: "Dark Cocoa",
    titleLine1: "Iced Choco",
    titleLine2: "& Beng Beng",
    badge: "Velvet Chocolate #03",
    craftHeading: "Rich Cocoa, Creamy Malt",
    craftDescription:
      "Lelehan cokelat pekat premium yang dipadukan dengan gurihnya malt karamel dalam sajian dingin yang lembut.",
    description:
      "Sensasi cokelat pekat berpadu tekstur creamy malt favorit yang memanjakan di setiap tegukan.",
    bgBase: "#110908",
    bgGradient:
      "radial-gradient(ellipse 65% 55% at 50% 52%, #331c18 0%, #190d0b 52%, #090504 100%)",
    glowColor: "rgba(200, 159, 129, 0.26)",
    accentHex: "#d8b49c",
    pillBorder: "rgba(216, 180, 156, 0.35)",
    beansConfig: [
      { top: "12%", left: "18%", size: 46, rotate: 40, blur: "1px", type: "bean" },
      { top: "31%", left: "35%", size: 26, rotate: -18, type: "bean" },
      { top: "16%", left: "61%", size: 36, rotate: 22, type: "bean" },
      { top: "38%", left: "82%", size: 42, rotate: -35, blur: "1.5px", type: "bean" },
      { top: "70%", left: "31%", size: 28, rotate: 15, type: "bean" },
    ],
  },
  {
    id: "teh-tarik",
    watermark: "Machiato",
    titleLine1: "Teh Tarik",
    titleLine2: "& Machiato",
    badge: "Torched Macchiato #04",
    craftHeading: "Pulled Tea, Torched Cream",
    craftDescription:
      "Kelembutan teh tarik berempah yang ditarik berbusa, ditutup lapisan macchiato gurih yang dibakar tipis.",
    description:
      "Harmoni teh tarik klasik dengan sentuhan modern cream macchiato bakar yang kaya rasa dan beraroma.",
    bgBase: "#140e07",
    bgGradient:
      "radial-gradient(ellipse 65% 55% at 50% 52%, #3d2912 0%, #1f1408 52%, #0a0703 100%)",
    glowColor: "rgba(233, 196, 106, 0.28)",
    accentHex: "#f3cb78",
    pillBorder: "rgba(243, 203, 120, 0.35)",
    beansConfig: [
      { top: "15%", left: "11%", size: 40, rotate: -15, blur: "1px", type: "leaf" },
      { top: "26%", left: "39%", size: 30, rotate: 45, type: "bean" },
      { top: "19%", left: "64%", size: 32, rotate: -28, type: "leaf" },
      { top: "34%", left: "85%", size: 44, rotate: 18, blur: "1px", type: "leaf" },
      { top: "66%", left: "27%", size: 25, rotate: -36, type: "bean" },
    ],
  },
];

function FloatingElementSVG({
  type,
  accent,
}: {
  type: "bean" | "leaf";
  accent: string;
}) {
  if (type === "leaf") {
    return (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-xl">
        <path
          d="M52 12C34 12 16 24 12 48C28 46 48 34 52 12Z"
          fill="url(#leafGrad)"
          stroke={accent}
          strokeWidth="1.5"
          strokeOpacity="0.45"
        />
        <path
          d="M12 48C24 36 36 24 50 14"
          stroke={accent}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.55"
        />
        <defs>
          <linearGradient id="leafGrad" x1="12" y1="12" x2="52" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4a3219" />
            <stop offset="1" stopColor="#1e1208" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-2xl">
      <ellipse
        cx="32"
        cy="32"
        rx="22"
        ry="15"
        transform="rotate(-28 32 32)"
        fill="url(#beanGrad)"
        stroke={accent}
        strokeWidth="1"
        strokeOpacity="0.3"
      />
      <path
        d="M16 41C24 31 38 33 48 23"
        stroke="#120904"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M16 41C24 31 38 33 48 23"
        stroke={accent}
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeOpacity="0.35"
      />
      <defs>
        <radialGradient
          id="beanGrad"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(26 26) rotate(35) scale(26 18)"
        >
          <stop stopColor="#6f4526" />
          <stop offset="0.65" stopColor="#3b2110" />
          <stop offset="1" stopColor="#1c0e06" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default function HomePage() {
  const db = useFirestore();
  const settingsRef = useMemoFirebase(
    () => doc(db, "settings", "store_config_gembong"),
    [db]
  );
  const { data: settings } = useDoc(settingsRef);

  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  useEffect(() => {
    setActiveBranch("gembong");
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SIGNATURE_DRINKS.length);
      setAnimKey((k) => k + 1);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleSelectDrink = (idx: number) => {
    if (idx === activeIdx) return;
    setActiveIdx(idx);
    setAnimKey((k) => k + 1);
  };

  const activeDrink = SIGNATURE_DRINKS[activeIdx];
  const brandName = settings?.name || "Zona Waktu";

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden relative flex flex-col justify-between select-none transition-colors duration-1000 ease-out"
      style={{
        backgroundColor: activeDrink.bgBase,
        backgroundImage: activeDrink.bgGradient,
        color: "#f8f5f0",
      }}
    >
      {/* Keyframe Animations */}
      <style>{`
        @keyframes zwFloatSlow {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-0.6deg); }
          30% { transform: translate3d(0, -10px, 0) rotate(0.9deg); }
          60% { transform: translate3d(0, -5px, 0) rotate(-0.2deg); }
          80% { transform: translate3d(0, -8px, 0) rotate(0.4deg); }
        }
        @keyframes zwCupReveal {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.86) rotate(-4deg);
            filter: blur(6px);
          }
          60% {
            opacity: 1;
            transform: translateY(-6px) scale(1.025) rotate(0.8deg);
            filter: blur(0px);
          }
          82% {
            transform: translateY(2px) scale(0.995) rotate(-0.3deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1) rotate(0deg);
            filter: blur(0px);
          }
        }
        @keyframes zwTextSlide {
          0% {
            opacity: 0;
            transform: translateY(18px);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px);
            filter: blur(0px);
          }
        }
        @keyframes zwWatermarkDrift {
          0% {
            opacity: 0;
            transform: translate(-50%, -46%) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes zwGlowBreath {
          0%, 100% { opacity: 0.85; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.08); }
        }
        .zw-cup-enter {
          animation: zwCupReveal 1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .zw-text-enter {
          animation: zwTextSlide 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .zw-watermark-enter {
          animation: zwWatermarkDrift 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .zw-float-idle {
          animation: zwFloatSlow 7.5s ease-in-out infinite;
          will-change: transform;
        }
        .zw-glow-breath {
          animation: zwGlowBreath 6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .zw-cup-enter, .zw-text-enter, .zw-watermark-enter, .zw-float-idle, .zw-glow-breath {
            animation: none !important;
          }
        }
      `}</style>

      {/* Subtle Vertical Pinstripe & Vignette Texture (like GlacÃ© reference) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 48px)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 45%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* Giant Background Serif Watermark */}
      <div
        key={`wm-${animKey}`}
        className={`${playfair.className} zw-watermark-enter pointer-events-none absolute top-[44%] md:top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 whitespace-nowrap text-center leading-none tracking-tight`}
        style={{
          fontSize: "clamp(4.5rem, 15vw, 15.5rem)",
          color: "rgba(255, 248, 240, 0.055)",
          fontWeight: 500,
        }}
      >
        {activeDrink.watermark}
      </div>

      {/* Ambient Center Glow Behind Cup */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] md:w-[540px] md:h-[540px] rounded-full blur-[100px] transition-all duration-1000 z-0"
        style={{ backgroundColor: activeDrink.glowColor }}
      />

      {/* Floating Coffee Beans & Tea Leaves */}
      <div className="pointer-events-none absolute inset-0 max-w-7xl mx-auto overflow-hidden z-10">
        {activeDrink.beansConfig.map((bean, i) => (
          <div
            key={i}
            className="absolute transition-all duration-1000 ease-out hidden sm:block"
            style={{
              top: bean.top,
              left: bean.left,
              width: `${bean.size}px`,
              height: `${bean.size}px`,
              transform: `rotate(${bean.rotate}deg)`,
              filter: bean.blur ? `blur(${bean.blur})` : undefined,
              opacity: 0.78,
            }}
          >
            <div
              className="w-full h-full zw-float-idle"
              style={{ animationDelay: `${i * 0.7}s` }}
            >
              <FloatingElementSVG type={bean.type} accent={activeDrink.accentHex} />
            </div>
          </div>
        ))}
      </div>

      {/* ================= HEADER / NAVBAR ================= */}
      <header className="relative z-30 w-full max-w-[1360px] mx-auto px-4 sm:px-8 md:px-12 pt-3.5 sm:pt-5 pb-2 sm:pb-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo (Left) */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0">
          <div className="relative h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-white p-0.5 shadow-lg shadow-black/40 ring-1 ring-white/25 overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105">
            <Image
              src={settings?.logoHeader || "/images/hero/logo-zonawaktu.png"}
              alt={brandName}
              fill
              className="object-contain rounded-full"
              sizes="44px"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className={`${playfair.className} text-base sm:text-2xl font-semibold tracking-wide text-[#faf6f0] leading-none truncate`}
            >
              {brandName}
            </span>
            <span className="text-[8px] sm:text-[10px] font-medium tracking-[0.18em] sm:tracking-[0.22em] uppercase text-white/60 mt-1 flex items-center gap-1.5 whitespace-nowrap">
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse shrink-0"
                style={{ backgroundColor: activeDrink.accentHex }}
              />
              Cabang Gembong
            </span>
          </div>
        </Link>

        {/* Center Menu Navigation Links (like GlacÃ© Header) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-wider text-white/70">
          {SIGNATURE_DRINKS.map((drink, index) => {
            const isCurrent = index === activeIdx;
            return (
              <button
                key={drink.id}
                type="button"
                onClick={() => handleSelectDrink(index)}
                className="relative py-1.5 transition-colors duration-300 hover:text-white cursor-pointer"
                style={{ color: isCurrent ? "#ffffff" : undefined }}
              >
                <span>{drink.watermark}</span>
                <span
                  className="absolute bottom-0 left-0 h-[1.5px] transition-all duration-500 rounded-full"
                  style={{
                    width: isCurrent ? "100%" : "0%",
                    backgroundColor: activeDrink.accentHex,
                  }}
                />
              </button>
            );
          })}
        </nav>

        {/* Management Portal Access (Right) - Owner & Admin */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <Link
            href="/owner-login"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 text-white/90 hover:text-white backdrop-blur-md transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            <ShieldCheck
              className="h-3 w-3 sm:h-3.5 sm:w-3.5"
              style={{ color: activeDrink.accentHex }}
            />
            <span>Owner</span>
          </Link>
          <Link
            href="/admin-login"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 text-white/90 hover:text-white backdrop-blur-md transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            <UserCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-300" />
            <span>Admin</span>
          </Link>
        </div>
      </header>

      {/* ================= HERO MAIN SECTION (3-COLUMN GLACÃ‰ LAYOUT) ================= */}
      <main
        className="relative z-20 flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-8 md:px-12 py-2 sm:py-4 md:py-6 flex flex-col justify-center lg:grid lg:grid-cols-12 items-center gap-3.5 sm:gap-6 lg:gap-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={() => {
          setIsPaused(false);
          setTilt({ x: 0, y: 0 });
        }}
      >
        {/* LEFT COLUMN: Editorial Title, Description & Portal Action Buttons */}
        <div className="w-full lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 z-20">
          {/* Outlet Status Pill */}
          <div
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-white/[0.05] backdrop-blur-md mb-2 sm:mb-4 border transition-colors duration-700"
            style={{ borderColor: activeDrink.pillBorder }}
          >
            <Sparkles
              className="h-2.5 w-2.5 sm:h-3 sm:w-3"
              style={{ color: activeDrink.accentHex }}
            />
            <span
              className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] sm:tracking-[0.2em]"
              style={{ color: activeDrink.accentHex }}
            >
              Outlet &amp; Gudang Utama Gembong
            </span>
          </div>

          {/* Animated Drink Editorial Heading */}
          <div key={`title-${animKey}`} className="zw-text-enter space-y-1.5 sm:space-y-3">
            <h1
              className={`${playfair.className} text-3xl sm:text-5xl xl:text-[62px] font-normal leading-[1.05] tracking-tight text-[#fffcf8]`}
            >
              <span className="block">{activeDrink.titleLine1}</span>
              <span className="block italic font-normal text-white/95">
                {activeDrink.titleLine2}
              </span>
            </h1>

            <p className="text-[11px] sm:text-sm text-white/65 max-w-sm sm:max-w-md leading-relaxed font-normal pt-0.5 sm:pt-1 line-clamp-2 sm:line-clamp-none">
              {activeDrink.description}
            </p>
          </div>

          {/* Primary Portal Action Buttons (Karyawan & Absensi GPS â€” Immediately Visible Above the Fold on Mobile) */}
          <div className="w-full max-w-sm mt-3.5 sm:mt-7 pt-1 sm:pt-2 space-y-1.5 sm:space-y-2.5">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-white/45 font-semibold mb-1.5 sm:mb-2">
              Portal Akses Operasional
            </p>

            {/* Primary Pill Buttons (Side-by-Side 2 Columns on Mobile & Desktop) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <Link href="/employee-login" className="group block">
                <div
                  className="h-11 sm:h-12 px-4 sm:px-5 rounded-full flex items-center justify-between gap-2 transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-lg backdrop-blur-md"
                  style={{
                    backgroundColor: activeDrink.accentHex,
                    color: "#140b05",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                    <span className="text-[11px] sm:text-xs font-bold tracking-wide whitespace-nowrap">
                      Karyawan
                    </span>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                </div>
              </Link>

              <Link href="/absensi" className="group block">
                <div
                  className="h-11 sm:h-12 px-4 sm:px-5 rounded-full bg-white/[0.06] hover:bg-white/[0.13] border flex items-center justify-between gap-2 text-white transition-all duration-300 hover:scale-[1.03] active:scale-95 backdrop-blur-md"
                  style={{ borderColor: activeDrink.pillBorder }}
                >
                  <div className="flex items-center gap-2">
                    <CalendarCheck
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0"
                      style={{ color: activeDrink.accentHex }}
                    />
                    <span className="text-[11px] sm:text-xs font-semibold tracking-wide whitespace-nowrap">
                      Absensi GPS
                    </span>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Hero Drink Cup Spotlight */}
        <div className="w-full lg:col-span-3 flex flex-col items-center justify-center order-1 lg:order-2 relative z-20 my-0">
          <div
            className="relative w-[185px] h-[225px] sm:w-[290px] sm:h-[360px] md:w-[360px] md:h-[440px] flex items-center justify-center"
            style={{
              transform: `perspective(1100px) rotateY(${(tilt.x * 14).toFixed(2)}deg) rotateX(${(-tilt.y * 10).toFixed(2)}deg) translate3d(${(tilt.x * 14).toFixed(1)}px, ${(tilt.y * 10).toFixed(1)}px, 0)`,
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Breathing ambient glow behind cup */}
            <div
              className="zw-glow-breath absolute top-1/2 left-1/2 w-[85%] h-[70%] rounded-full blur-[60px] pointer-events-none"
              style={{ backgroundColor: activeDrink.glowColor }}
            />
            {/* Soft Pedestal Shadow under Cup */}
            <div className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 w-32 sm:w-44 h-6 sm:h-8 bg-black/80 blur-xl rounded-full pointer-events-none" />
            <div
              className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 w-20 sm:w-28 h-2 sm:h-2.5 rounded-full blur-md transition-colors duration-700 pointer-events-none"
              style={{ backgroundColor: activeDrink.glowColor }}
            />

            {/* Main Animated High-Res Vector Cup & Dynamic Liquid Splash */}
            <div
              key={`cup-${animKey}`}
              className="zw-cup-enter relative w-full h-full flex items-center justify-center"
            >
              <div className="relative w-full h-full zw-float-idle">
                <HeroCupVisual variant={activeDrink.id} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Craft Note & 4 Interactive Drink Switcher Cards (GlacÃ© Style) */}
        <div className="w-full lg:col-span-4 flex flex-col items-center lg:items-end text-center lg:text-left order-3 z-20">
          <div className="w-full max-w-[340px] space-y-3 sm:space-y-5">
            {/* Craft Subtitle & Story (Hidden on small mobile screens to keep main viewport clean & compact) */}
            <div key={`craft-${animKey}`} className="zw-text-enter hidden sm:block space-y-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                {activeDrink.badge}
              </div>
              <h2
                className={`${playfair.className} italic text-2xl sm:text-3xl font-normal text-[#fffcf8]`}
              >
                {activeDrink.craftHeading}
              </h2>
              <p className="text-xs text-white/60 leading-relaxed">
                {activeDrink.craftDescription}
              </p>
            </div>

            {/* 4 Signature Drink Thumbnail Switcher */}
            <div className="pt-0.5 sm:pt-1">
              <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                {SIGNATURE_DRINKS.map((drink, idx) => {
                  const isSelected = idx === activeIdx;
                  return (
                    <button
                      key={drink.id}
                      type="button"
                      onClick={() => handleSelectDrink(idx)}
                      aria-label={`Pilih ${drink.titleLine1} ${drink.titleLine2}`}
                      className="group relative aspect-[4/4.3] sm:aspect-[3/4] rounded-xl sm:rounded-2xl p-1.5 sm:p-2 flex flex-col items-center justify-between overflow-hidden transition-all duration-300 cursor-pointer backdrop-blur-md"
                      style={{
                        backgroundColor: isSelected
                          ? "rgba(255, 255, 255, 0.11)"
                          : "rgba(255, 255, 255, 0.035)",
                        border: isSelected
                          ? `1.5px solid ${activeDrink.accentHex}`
                          : "1px solid rgba(255, 255, 255, 0.12)",
                        boxShadow: isSelected
                          ? `0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 16px -4px ${activeDrink.glowColor}`
                          : "none",
                        transform: isSelected ? "translateY(-3px)" : "none",
                      }}
                    >
                      <div className="relative w-full h-full flex items-center justify-center py-0.5 transition-transform duration-300 group-hover:scale-110">
                        <HeroCupVisual variant={drink.id} isThumbnail />
                      </div>
                      <span
                        className="text-[7.5px] sm:text-[8px] font-semibold tracking-wider uppercase truncate w-full text-center pt-0.5 sm:pt-1 transition-colors"
                        style={{
                          color: isSelected
                            ? activeDrink.accentHex
                            : "rgba(255,255,255,0.55)",
                        }}
                      >
                        {drink.watermark}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ================= MINIMALIST FOOTER ================= */}
      <footer className="relative z-20 w-full max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] tracking-[0.25em] uppercase text-white/40 border-t border-white/[0.06]">
        <span>Zona Waktu &bull; Coffee &amp; Teh Bakar</span>
        <div className="flex items-center gap-4">
          <span>Cabang Gembong (ZW-01)</span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="hidden sm:inline">Management System</span>
        </div>
      </footer>
    </div>
  );
}
