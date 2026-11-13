"use client";

import React from "react";

export type DrinkVariantId = "gula-aren" | "teh-bakar" | "choco-bengbeng" | "teh-tarik";

interface VariantPalette {
  liquidTop: string;
  liquidMid: string;
  liquidBottom: string;
  syrupBase: string;
  swirlPrimary: string;
  swirlSecondary: string;
  foamTop: string;
  foamMid: string;
  foamAccent: string;
  splashPrimary: string;
  splashSecondary: string;
  splashHighlight: string;
  iceTint: string;
  hasTorchedBrulee?: boolean;
  hasChocoCrumbs?: boolean;
}

const VARIANT_PALETTES: Record<DrinkVariantId, VariantPalette> = {
  "gula-aren": {
    liquidTop: "#dfb992",
    liquidMid: "#c28f61",
    liquidBottom: "#7c4722",
    syrupBase: "#1e0c04",
    swirlPrimary: "#4d230c",
    swirlSecondary: "#f3dec6",
    foamTop: "#fbf5ec",
    foamMid: "#ead6be",
    foamAccent: "#9c5c2b",
    splashPrimary: "#d8a878",
    splashSecondary: "#5e2d10",
    splashHighlight: "#fff9f0",
    iceTint: "#f7e6d0",
  },
  "teh-bakar": {
    liquidTop: "#c95f28",
    liquidMid: "#8c2f14",
    liquidBottom: "#421106",
    syrupBase: "#1f0702",
    swirlPrimary: "#591808",
    swirlSecondary: "#e88846",
    foamTop: "#fdf4e7",
    foamMid: "#edd5b8",
    foamAccent: "#b84a1c",
    splashPrimary: "#d96b34",
    splashSecondary: "#6e200b",
    splashHighlight: "#fff6eb",
    iceTint: "#f7dec8",
  },
  "choco-bengbeng": {
    liquidTop: "#6e3e28",
    liquidMid: "#452214",
    liquidBottom: "#241008",
    syrupBase: "#120603",
    swirlPrimary: "#1d0b05",
    swirlSecondary: "#a86b49",
    foamTop: "#e6c5ac",
    foamMid: "#9c6647",
    foamAccent: "#2d1208",
    splashPrimary: "#7c472e",
    splashSecondary: "#2c1309",
    splashHighlight: "#f5decb",
    iceTint: "#dfc1aa",
    hasChocoCrumbs: true,
  },
  "teh-tarik": {
    liquidTop: "#e39e42",
    liquidMid: "#bf7421",
    liquidBottom: "#783f0b",
    syrupBase: "#3b1b04",
    swirlPrimary: "#87470d",
    swirlSecondary: "#f7cb83",
    foamTop: "#fffaf0",
    foamMid: "#f2dfc1",
    foamAccent: "#632a06",
    splashPrimary: "#e6a44e",
    splashSecondary: "#85440e",
    splashHighlight: "#fffdf7",
    iceTint: "#fae8c8",
    hasTorchedBrulee: true,
  },
};

export function HeroCupVisual({
  variant,
  isThumbnail = false,
}: {
  variant: DrinkVariantId;
  isThumbnail?: boolean;
}) {
  const p = VARIANT_PALETTES[variant] || VARIANT_PALETTES["gula-aren"];
  const uid = `zw-${variant}-${isThumbnail ? "thumb" : "main"}`;

  if (isThumbnail) {
    return (
      <svg
        viewBox="105 110 290 365"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible select-none"
      >
        <defs>
          <clipPath id={`${uid}-cup-clip`}>
            <path d="M162 146 L338 146 L316 392 C313 422 287 438 250 438 C213 438 187 422 184 392 Z" />
          </clipPath>
          <linearGradient id={`${uid}-liq`} x1="250" y1="146" x2="250" y2="438" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={p.foamTop} />
            <stop offset="14%" stopColor={p.liquidTop} />
            <stop offset="58%" stopColor={p.liquidMid} />
            <stop offset="84%" stopColor={p.liquidBottom} />
            <stop offset="100%" stopColor={p.syrupBase} />
          </linearGradient>
          <linearGradient id={`${uid}-glass`} x1="160" y1="200" x2="340" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
            <stop offset="18%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="82%" stopColor="#000000" stopOpacity="0.18" />
            <stop offset="95%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Mini Bottom Splash Wings on Thumbnail */}
        <path
          d="M192 418 C154 410 124 382 132 362 C138 348 164 374 188 398 Z"
          fill={p.splashPrimary}
          opacity="0.9"
        />
        <path
          d="M308 418 C346 410 376 382 368 362 C362 348 336 374 312 398 Z"
          fill={p.splashHighlight}
          opacity="0.9"
        />
        <circle cx="124" cy="350" r="5" fill={p.splashPrimary} />
        <circle cx="376" cy="348" r="4.5" fill={p.splashHighlight} />

        {/* Cup Body Clipped */}
        <g clipPath={`url(#${uid}-cup-clip)`}>
          <rect x="150" y="140" width="200" height="310" fill={`url(#${uid}-liq)`} />
          {/* Syrup Swirls */}
          <path
            d="M175 390 Q220 340 255 375 T325 360 L330 445 L170 445 Z"
            fill={p.syrupBase}
            opacity="0.85"
          />
          {/* Top Foam */}
          <ellipse cx="250" cy="158" rx="95" ry="20" fill={p.foamTop} />
          {p.hasTorchedBrulee && (
            <ellipse cx="250" cy="154" rx="68" ry="11" fill={p.foamAccent} opacity="0.75" />
          )}
          <rect x="150" y="140" width="200" height="310" fill={`url(#${uid}-glass)`} />
        </g>

        {/* Bottom Splash Front Wave on Thumbnail */}
        <path
          d="M168 424 C205 446 295 446 332 424 C305 452 195 452 168 424 Z"
          fill={p.splashHighlight}
          opacity="0.92"
        />

        {/* Rim */}
        <ellipse
          cx="250"
          cy="146"
          rx="94"
          ry="20"
          fill="rgba(255,255,255,0.12)"
          stroke="rgba(255,255,255,0.65)"
          strokeWidth="3.5"
        />
      </svg>
    );
  }


  const condensation = CONDENSATION_DROPS;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <style>{CUP_CSS}</style>
      <svg
        viewBox="50 100 420 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible select-none drop-shadow-[0_30px_45px_rgba(0,0,0,0.7)]"
      >
        <defs>
          {/* Interior clip: cup wall + elliptical opening (perspective) */}
          <clipPath id={`${uid}-cup`}>
            <path d="M142 150 A118 24 0 0 1 378 150 L344 528 Q341 548 318 550 L202 550 Q179 548 176 528 Z" />
          </clipPath>
          {/* Region above the liquid surface (for ice cube "dry" pass) */}
          <clipPath id={`${uid}-above`}>
            <rect x="120" y="100" width="280" height={SURFACE_Y - 100} />
          </clipPath>

          <linearGradient id={`${uid}-liquid`} x1="260" y1={SURFACE_Y} x2="260" y2="555" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={p.liquidTop} />
            <stop offset="45%" stopColor={p.liquidMid} />
            <stop offset="80%" stopColor={p.liquidBottom} />
            <stop offset="100%" stopColor={p.syrupBase} />
          </linearGradient>

          <radialGradient id={`${uid}-surface`} cx="0.45" cy="0.4" r="0.7">
            <stop offset="0%" stopColor={p.foamTop} />
            <stop offset="70%" stopColor={p.foamMid} />
            <stop offset="100%" stopColor={p.liquidTop} />
          </radialGradient>

          <linearGradient id={`${uid}-empty`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
          </linearGradient>

          {/* Cylindrical plastic shading */}
          <linearGradient id={`${uid}-cyl`} x1="140" y1="0" x2="380" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
            <stop offset="6%" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="20%" stopColor="#ffffff" stopOpacity="0.02" />
            <stop offset="55%" stopColor="#000000" stopOpacity="0.05" />
            <stop offset="84%" stopColor="#000000" stopOpacity="0.3" />
            <stop offset="94%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
          </linearGradient>

          {/* Moving light sheen */}
          <linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id={`${uid}-rim`} x1="138" y1="0" x2="382" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="52%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="78%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
          </linearGradient>

          {/* Water droplet (condensation) */}
          <radialGradient id={`${uid}-drop`} cx="0.4" cy="0.35" r="0.7">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="82%" stopColor="#000000" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.55" />
          </radialGradient>

          {/* Splash liquid tendril (base dark â†’ tip bright) */}
          <linearGradient id={`${uid}-tendril`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={p.splashSecondary} stopOpacity="0.95" />
            <stop offset="45%" stopColor={p.splashPrimary} stopOpacity="0.92" />
            <stop offset="100%" stopColor={p.splashHighlight} stopOpacity="0.95" />
          </linearGradient>

          {/* Splash droplet sphere */}
          <radialGradient id={`${uid}-sdrop`} cx="0.35" cy="0.3" r="0.75">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor={p.splashHighlight} />
            <stop offset="60%" stopColor={p.splashPrimary} />
            <stop offset="100%" stopColor={p.splashSecondary} />
          </radialGradient>

          {/* Fine frost micro-dots */}
          <pattern id={`${uid}-frost`} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="4" r="0.7" fill="#ffffff" opacity="0.4" />
            <circle cx="10" cy="9" r="0.5" fill="#ffffff" opacity="0.35" />
            <circle cx="6" cy="12" r="0.45" fill="#ffffff" opacity="0.3" />
            <circle cx="12" cy="2" r="0.35" fill="#ffffff" opacity="0.3" />
          </pattern>

          <filter id={`${uid}-blur6`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id={`${uid}-blur3`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* ============ 1. GROUND: SHADOW, PUDDLE & RIPPLES ============ */}
        <ellipse cx="260" cy="566" rx="150" ry="20" fill="#000000" opacity="0.5" filter={`url(#${uid}-blur6)`} />
        <ellipse cx="260" cy="560" rx="118" ry="13" fill={p.splashSecondary} opacity="0.55" />
        <ellipse cx="250" cy="557" rx="70" ry="5" fill="#ffffff" opacity="0.12" />
        {[0, 1.2].map((b) => (
          <ellipse key={b} cx="260" cy="560" rx="90" ry="10" fill="none" stroke={p.splashPrimary} strokeWidth="1.4">
            <animate attributeName="rx" values="80;178" dur="2.4s" begin={`-${b}s`} repeatCount="indefinite" />
            <animate attributeName="ry" values="9;25" dur="2.4s" begin={`-${b}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.65;0" dur="2.4s" begin={`-${b}s`} repeatCount="indefinite" />
          </ellipse>
        ))}

        {/* ============ 2. BACK SPLASH CROWN (behind cup) ============ */}
        {BACK_TENDRILS.map((t, i) => (
          <Tendril key={`b${i}`} t={t} uid={uid} />
        ))}

        {/* ============ 3. BACK RIM ARC ============ */}
        <path d="M138 150 A122 24 0 0 1 382 150" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="3" fill="none" />

        {/* ============ 4. CUP INTERIOR ============ */}
        <g clipPath={`url(#${uid}-cup)`}>
          {/* Empty plastic above liquid */}
          <rect x="120" y="100" width="280" height={SURFACE_Y - 90} fill={`url(#${uid}-empty)`} />

          {/* Liquid body */}
          <rect x="120" y={SURFACE_Y} width="280" height={560 - SURFACE_Y} fill={`url(#${uid}-liquid)`} />

          {/* Marbled milk / espresso swirls (slow organic drift) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0; 6 -10; -4 -4; 0 0"
              dur="11s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.35;0.7;1"
              keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"
            />
            <g filter={`url(#${uid}-blur6)`}>
              <path d="M165 230 C200 285 168 345 215 400 C248 438 290 405 315 462" stroke={p.swirlSecondary} strokeWidth="24" strokeLinecap="round" opacity="0.42" />
              <path d="M352 240 C312 300 340 360 288 418 C256 452 214 430 188 482" stroke={p.swirlPrimary} strokeWidth="28" strokeLinecap="round" opacity="0.5" />
              <path d="M240 215 C218 270 272 318 244 388" stroke={p.foamTop} strokeWidth="16" strokeLinecap="round" opacity="0.35" />
            </g>
          </g>

          {/* Settled syrup layer with slow wave */}
          <path fill={p.syrupBase} opacity="0.92">
            <animate
              attributeName="d"
              dur="7s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
              values="M120 476 C175 458 215 492 260 474 C305 456 340 486 400 468 L400 570 L120 570 Z;M120 470 C172 488 220 456 262 476 C304 494 345 462 400 476 L400 570 L120 570 Z;M120 476 C175 458 215 492 260 474 C305 456 340 486 400 468 L400 570 L120 570 Z"
            />
          </path>
          <path
            d="M120 450 C170 430 222 468 266 446 C306 426 342 458 400 440 L400 530 L120 530 Z"
            fill={p.liquidBottom}
            opacity="0.55"
            filter={`url(#${uid}-blur3)`}
          />

          {/* Rising micro-bubbles */}
          {BUBBLES.map((b, i) => (
            <circle key={i} cx={b.x} cy="520" r={b.r} fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="0.8">
              <animate attributeName="cy" values={`520;${SURFACE_Y + 12}`} dur={`${b.dur}s`} begin={`-${b.begin}s`} repeatCount="indefinite" />
              <animate attributeName="cx" values={`${b.x};${b.x + 5};${b.x - 4};${b.x}`} dur={`${b.dur}s`} begin={`-${b.begin}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.12;0.85;1" dur={`${b.dur}s`} begin={`-${b.begin}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Ice cubes â€” submerged pass (tinted by liquid) */}
          {ICE.map((c, i) => (
            <AnimatedIce key={`s${i}`} c={c} p={p} mode="submerged" />
          ))}

          {/* Liquid surface with gentle wobble */}
          <ellipse cx="260" cy={SURFACE_Y} rx="113" ry="18" fill={`url(#${uid}-surface)`}>
            <animate attributeName="ry" values="18;19.8;17.4;18" dur="3.6s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.33;0.66;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1" />
          </ellipse>
          <ellipse cx="260" cy={SURFACE_Y} rx="112" ry="17.5" fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1.4" />
          <ellipse cx="230" cy={SURFACE_Y - 4} rx="26" ry="4" fill="#ffffff" opacity="0.28">
            <animate attributeName="cx" values="215;300;215" dur="8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />
          </ellipse>

          {p.hasTorchedBrulee && (
            <g opacity="0.88">
              <ellipse cx="258" cy={SURFACE_Y - 1} rx="80" ry="13" fill="#b85d18" filter={`url(#${uid}-blur3)`} />
              <ellipse cx="246" cy={SURFACE_Y - 3} rx="46" ry="7" fill="#4a1c03" filter={`url(#${uid}-blur3)`} />
              <ellipse cx="282" cy={SURFACE_Y + 2} rx="30" ry="5" fill="#5e2404" filter={`url(#${uid}-blur3)`} />
            </g>
          )}
          {p.hasChocoCrumbs && (
            <g fill="#230d05" opacity="0.85">
              <ellipse cx="260" cy={SURFACE_Y - 1} rx="76" ry="12" fill="#4f2716" opacity="0.6" />
              <circle cx="222" cy={SURFACE_Y - 2} r="4" />
              <circle cx="242" cy={SURFACE_Y - 6} r="5" />
              <circle cx="264" cy={SURFACE_Y + 1} r="4.5" />
              <circle cx="284" cy={SURFACE_Y - 5} r="5.5" />
              <circle cx="300" cy={SURFACE_Y} r="3.5" />
            </g>
          )}

          {/* Ice cubes â€” dry pass above the surface (bright, crystal clear) */}
          <g clipPath={`url(#${uid}-above)`}>
            {ICE.map((c, i) => (
              <AnimatedIce key={`a${i}`} c={c} p={p} mode="above" />
            ))}
          </g>

          {/* Cup branding print */}
          <g opacity="0.94">
            <circle cx="260" cy="350" r="56" fill="#ffffff" opacity="0.09" />
            <g transform="translate(260, 376) rotate(-90)">
              <text x="0" y="-8" textAnchor="middle" fill="#ffffff" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="30" letterSpacing="1.5">
                ZONA WAKTU
              </text>
              <rect x="-112" y="-2" width="212" height="4.5" rx="2" fill="#ffffff" />
              <path d="M96 -2 C104 8 118 8 124 -2 C118 2 104 2 96 -2 Z" fill="#e11d48" stroke="#e11d48" strokeWidth="2" />
              <text x="-4" y="16" textAnchor="middle" fill="#ffffff" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="11.5" letterSpacing="2.4" opacity="0.92">
                COFFEE DAN TEH BAKAR
              </text>
            </g>
          </g>

          {/* Frost texture on cold wall */}
          <rect x="120" y={SURFACE_Y + 10} width="280" height="360" fill={`url(#${uid}-frost)`} opacity="0.55" />

          {/* Cylindrical shading */}
          <rect x="120" y="100" width="280" height="470" fill={`url(#${uid}-cyl)`} />

          {/* Static specular streaks */}
          <path d="M162 176 L190 504 L204 506 L180 176 Z" fill="#ffffff" opacity="0.2" />
          <path d="M154 182 L182 500" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" opacity="0.5" />
          <path d="M360 182 L334 500" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" opacity="0.32" />

          {/* Moving light sheen sweep */}
          <rect x="60" y="100" width="64" height="480" fill={`url(#${uid}-sheen)`} transform="skewX(-12)">
            <animateTransform attributeName="transform" type="translate" additive="sum" values="-120 0; 420 0; 420 0" keyTimes="0;0.38;1" dur="6.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1;0 0 1 1" />
          </rect>

          {/* Condensation droplets */}
          {condensation.map((d, i) => (
            <g key={i}>
              <ellipse cx={d.x} cy={d.y} rx={d.rx} ry={d.ry} fill={`url(#${uid}-drop)`} />
              <circle cx={d.x - d.rx * 0.35} cy={d.y - d.ry * 0.4} r={d.rx * 0.32} fill="#ffffff" opacity="0.85" />
            </g>
          ))}

          {/* Trickling droplets with wet trails */}
          {TRICKLES.map((t, i) => (
            <g key={i}>
              <rect x={t.x - 1.1} y={t.y} width="2.2" height="0" rx="1.1" fill="#ffffff" opacity="0.2">
                <animate attributeName="height" values={`0;${t.len};${t.len}`} keyTimes="0;0.7;1" dur={`${t.dur}s`} begin={`-${t.begin}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.55 0 0.85 1;0 0 1 1" />
                <animate attributeName="opacity" values="0.24;0.16;0" keyTimes="0;0.7;1" dur={`${t.dur}s`} begin={`-${t.begin}s`} repeatCount="indefinite" />
              </rect>
              <g>
                <animateTransform attributeName="transform" type="translate" values={`0 0; 0 ${t.len}; 0 ${t.len}`} keyTimes="0;0.7;1" dur={`${t.dur}s`} begin={`-${t.begin}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.55 0 0.85 1;0 0 1 1" />
                <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.7;1" dur={`${t.dur}s`} begin={`-${t.begin}s`} repeatCount="indefinite" />
                <ellipse cx={t.x} cy={t.y} rx="2.8" ry="3.8" fill={`url(#${uid}-drop)`} />
                <circle cx={t.x - 0.9} cy={t.y - 1.3} r="1" fill="#ffffff" opacity="0.95" />
              </g>
            </g>
          ))}

          {/* Thick plastic base */}
          <ellipse cx="260" cy="545" rx="84" ry="12" fill={p.syrupBase} opacity="0.55" />
        </g>

        {/* ============ 5. CUP OUTLINE, BASE & RIM ============ */}
        <path d="M138 150 L174 532 Q178 556 210 558 L310 558 Q342 556 346 532 L382 150" stroke="#ffffff" strokeOpacity="0.36" strokeWidth="2" fill="none" />
        <path d="M176 530 Q180 550 204 552 L316 552 Q340 550 344 530" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="3.5" fill="none" />
        <ellipse cx="260" cy="540" rx="80" ry="10" fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.4" />

        {/* Rim ridges */}
        <path d="M141 170 A119 24 0 0 0 379 170" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1.2" fill="none" />
        <path d="M142 177 A118 24 0 0 0 378 177" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="1" fill="none" />

        {/* Front rim lip */}
        <path d="M138 150 A122 24 0 0 0 382 150" stroke={`url(#${uid}-rim)`} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M140 154 A120 24 0 0 0 380 154" stroke="#ffffff" strokeOpacity="0.32" strokeWidth="1.6" fill="none" />

        {/* ============ 6. FRONT SPLASH CROWN ============ */}
        <g className="zwc-burst" style={{ transformOrigin: "260px 556px" }}>
          <g className="zwc-sway" style={{ transformOrigin: "260px 556px", animationDuration: "3.6s" }}>
            <path
              d="M146 556 C160 530 172 548 184 534 C196 520 206 546 220 538 C236 530 246 552 260 546 C274 552 284 530 300 538 C314 546 324 520 336 534 C348 548 360 530 374 556 C340 582 180 582 146 556 Z"
              fill={`url(#${uid}-tendril)`}
              opacity="0.88"
            />
            <path
              d="M146 556 C160 530 172 548 184 534 C196 520 206 546 220 538 C236 530 246 552 260 546 C274 552 284 530 300 538 C314 546 324 520 336 534 C348 548 360 530 374 556"
              stroke="#ffffff"
              strokeOpacity="0.6"
              strokeWidth="1.6"
              fill="none"
            />
            <path d="M162 566 C200 578 320 578 358 566" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.2" fill="none" />
          </g>
        </g>

        {FRONT_TENDRILS.map((t, i) => (
          <Tendril key={`f${i}`} t={t} uid={uid} />
        ))}

        {/* Flying droplets on ballistic arcs */}
        {FLY_DROPS.map((d, i) => (
          <g key={i} transform={`translate(${d.x} ${d.y})`}>
            <g opacity="0">
              <animateMotion
                path={`M0 0 Q${d.dx / 2} ${-d.h} ${d.dx} ${d.dy}`}
                dur={`${d.dur}s`}
                begin={`-${d.begin}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keyPoints="0;1"
                keyTimes="0;1"
                keySplines="0.2 0.55 0.6 1"
              />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.78;1" dur={`${d.dur}s`} begin={`-${d.begin}s`} repeatCount="indefinite" />
              <circle cx="0" cy="0" r={d.r} fill={`url(#${uid}-sdrop)`} />
              <circle cx={-d.r * 0.35} cy={-d.r * 0.38} r={d.r * 0.3} fill="#ffffff" opacity="0.95" />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ====================================================================
   GEOMETRY & ANIMATION DATA (deterministic â†’ SSR-safe)
   ==================================================================== */

const SURFACE_Y = 198;
const SPLASH_BASE_Y = 552;

const CUP_CSS = `
  .zwc-burst { transform-box: view-box; animation: zwcBurst 0.95s cubic-bezier(0.18, 1.35, 0.4, 1) both; }
  .zwc-sway { transform-box: view-box; animation: zwcSway 3.2s ease-in-out infinite; }
  @keyframes zwcBurst {
    0% { transform: scale(0.25, 0); opacity: 0; }
    55% { opacity: 1; }
    100% { transform: scale(1, 1); opacity: 1; }
  }
  @keyframes zwcSway {
    0%, 100% { transform: scale(1, 1) rotate(0deg); }
    50% { transform: scale(1.03, 1.08) rotate(var(--zwc-rot, 0.8deg)); }
  }
  @media (prefers-reduced-motion: reduce) {
    .zwc-burst, .zwc-sway { animation: none !important; }
  }
`;

function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function cupHalfWidth(y: number) {
  return 118 - ((y - 152) * 34) / 388;
}

interface TendrilSpec {
  x: number;
  a: number;
  len: number;
  w: number;
  delay: number;
}

const BACK_TENDRILS: TendrilSpec[] = [
  { x: 205, a: -24, len: 96, w: 9, delay: 0.05 },
  { x: 232, a: -10, len: 118, w: 8, delay: 0.12 },
  { x: 290, a: 9, len: 112, w: 8, delay: 0.08 },
  { x: 316, a: 24, len: 100, w: 9, delay: 0.15 },
];

const FRONT_TENDRILS: TendrilSpec[] = [
  { x: 182, a: -58, len: 118, w: 11, delay: 0 },
  { x: 172, a: -76, len: 86, w: 8, delay: 0.1 },
  { x: 196, a: -40, len: 74, w: 8, delay: 0.18 },
  { x: 338, a: 58, len: 118, w: 11, delay: 0.04 },
  { x: 348, a: 76, len: 88, w: 8, delay: 0.14 },
  { x: 324, a: 40, len: 76, w: 8, delay: 0.2 },
];

const f = (n: number) => n.toFixed(2);

function tendrilGeometry(t: TendrilSpec) {
  const by = SPLASH_BASE_Y;
  const rad = (t.a * Math.PI) / 180;
  const half = rad * 0.45;
  const tx = t.x + Math.sin(rad) * t.len;
  const ty = by - Math.cos(rad) * t.len;
  const cx = t.x + Math.sin(half) * t.len * 0.62;
  const cy = by - Math.cos(half) * t.len * 0.62;
  const ux = Math.sin(rad);
  const uy = -Math.cos(rad);
  return {
    d: `M${f(t.x - t.w)} ${by} Q${f(cx - t.w * 0.55)} ${f(cy)} ${f(tx)} ${f(ty)} Q${f(cx + t.w * 0.55)} ${f(cy)} ${f(t.x + t.w)} ${by} Z`,
    spine: `M${f(t.x)} ${by} Q${f(cx)} ${f(cy)} ${f(tx)} ${f(ty)}`,
    tip: { x: tx + ux * t.w * 0.45, y: ty + uy * t.w * 0.45, r: t.w * 0.62 },
    drop: { x: tx + ux * t.w * 2.7, y: ty + uy * t.w * 2.7, r: t.w * 0.42 },
  };
}

function Tendril({ t, uid }: { t: TendrilSpec; uid: string }) {
  const g = tendrilGeometry(t);
  const origin = `${t.x}px ${SPLASH_BASE_Y}px`;
  return (
    <g className="zwc-burst" style={{ transformOrigin: origin, animationDelay: `${t.delay}s` }}>
      <g
        className="zwc-sway"
        style={
          {
            transformOrigin: origin,
            animationDelay: `${0.95 + t.delay * 4}s`,
            animationDuration: `${2.8 + t.delay * 6}s`,
            "--zwc-rot": `${t.a > 0 ? 1.6 : -1.6}deg`,
          } as React.CSSProperties
        }
      >
        <path d={g.d} fill={`url(#${uid}-tendril)`} />
        <path d={g.spine} stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        <circle cx={f(g.tip.x)} cy={f(g.tip.y)} r={f(g.tip.r)} fill={`url(#${uid}-sdrop)`} />
        <circle cx={f(g.tip.x - g.tip.r * 0.35)} cy={f(g.tip.y - g.tip.r * 0.35)} r={f(g.tip.r * 0.3)} fill="#ffffff" opacity="0.9" />
        <circle cx={f(g.drop.x)} cy={f(g.drop.y)} r={f(g.drop.r)} fill={`url(#${uid}-sdrop)`} />
      </g>
    </g>
  );
}

interface IceSpec {
  x: number;
  y: number;
  s: number;
  r: number;
  dur: number;
  bob: number;
  begin: number;
}

const ICE: IceSpec[] = [
  { x: 206, y: 180, s: 56, r: -16, dur: 5.2, bob: 3, begin: 0 },
  { x: 312, y: 186, s: 58, r: 14, dur: 6.1, bob: 3.5, begin: 0.8 },
  { x: 258, y: 164, s: 62, r: 5, dur: 5.6, bob: 2.5, begin: 0.4 },
  { x: 234, y: 240, s: 48, r: -28, dur: 7, bob: 4, begin: 1.2 },
  { x: 298, y: 256, s: 44, r: 32, dur: 6.6, bob: 4, begin: 0.2 },
];

function IceCube({ s, p, mode }: { s: number; p: VariantPalette; mode: "above" | "submerged" }) {
  const above = mode === "above";
  const v = (x: number, y: number) => `${f(x * s)} ${f(y * s)}`;
  const A = v(0, -0.55);
  const B = v(0.62, -0.22);
  const C = v(0, 0.1);
  const D = v(-0.62, -0.22);
  const Bp = v(0.62, 0.3);
  const Cp = v(0, 0.62);
  const Dp = v(-0.62, 0.3);
  const silhouette = `M${A} L${B} L${Bp} L${Cp} L${Dp} L${D} Z`;
  return (
    <g>
      <g opacity={above ? 0.5 : 0.3}>
        <path d={silhouette} fill={above ? "#ffffff" : p.iceTint} stroke={above ? "#ffffff" : p.iceTint} strokeWidth="9" strokeLinejoin="round" />
      </g>
      <path d={`M${A} L${B} L${C} L${D} Z`} fill="#ffffff" opacity={above ? 0.45 : 0.2} strokeLinejoin="round" />
      <path d={`M${D} L${C} L${Cp} L${Dp} Z`} fill={p.liquidMid} opacity={above ? 0.1 : 0.28} />
      <path d={`M${C} L${B} L${Bp} L${Cp} Z`} fill="#000000" opacity={above ? 0.07 : 0.18} />
      <path d={`M${D} L${C} L${B} M${C} L${Cp}`} stroke="#ffffff" strokeOpacity={above ? 0.85 : 0.4} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${v(-0.42, -0.2)} L${v(-0.08, -0.4)}`} stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" opacity={above ? 0.95 : 0.45} />
      <path d={`M${v(0.1, 0.22)} L${v(0.3, 0.06)} L${v(0.42, 0.18)}`} stroke="#ffffff" strokeOpacity="0.35" strokeWidth="0.9" fill="none" />
      <circle cx={f(-0.25 * s)} cy={f(0.25 * s)} r={f(0.05 * s)} fill="#ffffff" opacity="0.5" />
      <circle cx={f(-0.1 * s)} cy={f(0.38 * s)} r={f(0.03 * s)} fill="#ffffff" opacity="0.4" />
    </g>
  );
}

function AnimatedIce({ c, p, mode }: { c: IceSpec; p: VariantPalette; mode: "above" | "submerged" }) {
  const spline = "0.45 0 0.55 1;0.45 0 0.55 1";
  return (
    <g transform={`translate(${c.x} ${c.y}) rotate(${c.r})`}>
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values={`0 0; 0 ${-c.bob}; 0 0`}
          keyTimes="0;0.5;1"
          calcMode="spline"
          keySplines={spline}
          dur={`${c.dur}s`}
          begin={`-${c.begin}s`}
          repeatCount="indefinite"
        />
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-5;5;-5"
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines={spline}
            dur={`${f(c.dur * 1.35)}s`}
            begin={`-${c.begin}s`}
            repeatCount="indefinite"
          />
          <IceCube s={c.s} p={p} mode={mode} />
        </g>
      </g>
    </g>
  );
}

const BUBBLES = (() => {
  const rnd = makeRng(11);
  return Array.from({ length: 12 }, () => {
    const dur = 3.5 + rnd() * 3.5;
    return {
      x: Math.round(190 + rnd() * 140),
      r: Number((1.2 + rnd() * 2).toFixed(2)),
      dur: Number(dur.toFixed(2)),
      begin: Number((rnd() * dur).toFixed(2)),
    };
  });
})();

const CONDENSATION_DROPS = (() => {
  const rnd = makeRng(7);
  const drops: Array<{ x: number; y: number; rx: number; ry: number }> = [];
  for (let i = 0; i < 46; i++) {
    const y = 215 + rnd() * 300;
    const hw = cupHalfWidth(y) - 10;
    const x = 260 + (rnd() * 2 - 1) * hw;
    const rx = 1.2 + rnd() * 2.4;
    drops.push({
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      rx: Number(rx.toFixed(2)),
      ry: Number((rx * (1.15 + rnd() * 0.25)).toFixed(2)),
    });
  }
  return drops;
})();

const TRICKLES = [
  { x: 200, y: 232, len: 150, dur: 7.5, begin: 0 },
  { x: 322, y: 262, len: 130, dur: 9, begin: 2.5 },
  { x: 250, y: 300, len: 110, dur: 8, begin: 5 },
];

const FLY_DROPS = [
  { x: 178, y: 540, dx: -90, h: 120, dy: 30, r: 5, dur: 2.2, begin: 0 },
  { x: 190, y: 545, dx: -55, h: 150, dy: 10, r: 3.5, dur: 2.6, begin: 0.6 },
  { x: 205, y: 548, dx: -130, h: 90, dy: 40, r: 3, dur: 2.0, begin: 1.1 },
  { x: 342, y: 540, dx: 92, h: 125, dy: 28, r: 5, dur: 2.3, begin: 0.3 },
  { x: 330, y: 545, dx: 58, h: 155, dy: 12, r: 3.5, dur: 2.7, begin: 0.9 },
  { x: 318, y: 548, dx: 128, h: 95, dy: 38, r: 3, dur: 2.1, begin: 1.4 },
  { x: 240, y: 550, dx: -30, h: 170, dy: -10, r: 2.6, dur: 2.4, begin: 1.7 },
  { x: 282, y: 550, dx: 34, h: 165, dy: -6, r: 2.6, dur: 2.5, begin: 0.4 },
];
