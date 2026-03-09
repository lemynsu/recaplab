import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

import yosemiteCover from "@/assets/yosemite-cover.jpg";
import yosemiteThumb1 from "@/assets/yosemite-thumb1.jpg";
import yosemiteThumb2 from "@/assets/yosemite-thumb2.jpg";
import yosemiteThumb3 from "@/assets/yosemite-thumb3.jpg";
import hikeThumb3 from "@/assets/hike-thumb3.jpg";
import rtfCover from "@/assets/rtf-cover.jpg";
import rtfThumb1 from "@/assets/rtf-thumb1.jpg";
import rtfThumb2 from "@/assets/rtf-thumb2.jpg";
import nightThumb1 from "@/assets/night-thumb1.jpg";
import nightThumb2 from "@/assets/night-thumb2.jpg";
import nightThumb3 from "@/assets/night-thumb3.jpg";
import bdayThumb1 from "@/assets/bday-thumb1.jpg";

/* ─── types ─────────────────────────────────────────── */

type Phase = "spread" | "line" | "albums";

interface PhotoData {
  src: string;
  group: number;
  idx: number;
  // scatter position for spread phase
  scatter: { top: number; left: number; rot: number };
}

/* ─── data (12 photos → 3 albums × 4) ─────────────── */

const photos: PhotoData[] = [
  { src: yosemiteCover, group: 0, idx: 0, scatter: { top: 12, left: 8, rot: -5 } },
  { src: yosemiteThumb1, group: 0, idx: 1, scatter: { top: 18, left: 25, rot: 3 } },
  { src: yosemiteThumb2, group: 0, idx: 2, scatter: { top: 8, left: 55, rot: -2 } },
  { src: yosemiteThumb3, group: 0, idx: 3, scatter: { top: 22, left: 72, rot: 4 } },
  { src: hikeThumb3, group: 1, idx: 0, scatter: { top: 38, left: 5, rot: -3 } },
  { src: rtfCover, group: 1, idx: 1, scatter: { top: 42, left: 38, rot: 2 } },
  { src: rtfThumb1, group: 1, idx: 2, scatter: { top: 35, left: 62, rot: -4 } },
  { src: rtfThumb2, group: 1, idx: 3, scatter: { top: 45, left: 88, rot: 1.5 } },
  { src: nightThumb1, group: 2, idx: 0, scatter: { top: 62, left: 12, rot: 3.5 } },
  { src: nightThumb2, group: 2, idx: 1, scatter: { top: 58, left: 45, rot: -1.5 } },
  { src: nightThumb3, group: 2, idx: 2, scatter: { top: 68, left: 70, rot: 2.5 } },
  { src: bdayThumb1, group: 2, idx: 3, scatter: { top: 72, left: 90, rot: -3 } },
];

const groups = [
  { label: "YOSEMITE TRIP", meta: "4 photos · Jan 2025", creator: "Alex M." },
  { label: "WINTER HIKE", meta: "4 photos · Jan 2025", creator: "Jamie L." },
  { label: "NIGHT & NATURE", meta: "4 photos · Jan 2025", creator: "Sam K." },
];

/* ─── timing ───────────────────────────────────────── */

const PHASE_DURATIONS: Record<Phase, number> = {
  spread: 3000,
  line: 3200,
  albums: 4000,
};

const PHASE_ORDER: Phase[] = ["spread", "line", "albums"];

/* ─── layout math ──────────────────────────────────── */

function getLinePosition(index: number, total: number, isMobile: boolean) {
  const spread = isMobile ? 92 : 85;
  const offset = (100 - spread) / 2;
  const leftPct = offset + (index / (total - 1)) * spread;
  const centerDist = Math.abs(index - (total - 1) / 2) / ((total - 1) / 2);
  const direction = index < total / 2 ? -1 : 1;
  const rot = direction * centerDist * centerDist * 45;
  const scale = 1 - centerDist * 0.35;
  return { leftPct, rot, scale };
}

/* ─── albums: side-by-side large cards with slight fan ── */

function getAlbumPosition(photo: PhotoData, isMobile: boolean) {
  const groupCount = 3;
  const cardW = isMobile ? 65 : 160;
  const gap = isMobile ? 8 : 24;
  const totalW = groupCount * cardW + (groupCount - 1) * gap;

  // Center the group of cards
  const startX = -totalW / 2;
  const groupX = startX + photo.group * (cardW + gap) + cardW / 2;

  // Stack cards within album with slight rotation & offset
  const stackOffsets = [
    { rot: 0, dx: 0, dy: 0, z: 4, opacity: 1 },
    { rot: -3, dx: -6, dy: 4, z: 3, opacity: 0.92 },
    { rot: 3, dx: 6, dy: 6, z: 2, opacity: 0.8 },
    { rot: -5, dx: -10, dy: 10, z: 1, opacity: 0.65 },
  ];

  const s = stackOffsets[photo.idx];
  return {
    x: groupX + s.dx,
    y: s.dy,
    rot: s.rot,
    width: cardW,
    opacity: s.opacity,
    z: s.z,
  };
}

/* ─── sizes ────────────────────────────────────────── */

const PW_MOBILE = 48;
const PW_DESKTOP = 64;
const SPREAD_PW_MOBILE = 56;
const SPREAD_PW_DESKTOP = 72;

/* ─── style per phase ─────────────────────────────── */

function getPhotoStyle(photo: PhotoData, phase: Phase, isMobile: boolean, index: number, total: number) {
  const pw = isMobile ? PW_MOBILE : PW_DESKTOP;
  const spw = isMobile ? SPREAD_PW_MOBILE : SPREAD_PW_DESKTOP;

  switch (phase) {
    case "spread": {
      const s = photo.scatter;
      return {
        left: `${s.left}%`,
        top: `${s.top}%`,
        rotate: s.rot,
        width: spw,
        x: -spw / 2,
        y: -spw / 2,
        opacity: 1,
        paddingBottom: 3,
        z: total - index,
        borderRadius: 4,
      };
    }
    case "line": {
      const lp = getLinePosition(index, total, isMobile);
      const w = pw * lp.scale;
      return {
        left: `${lp.leftPct}%`,
        top: "38%",
        rotate: lp.rot,
        width: w,
        x: -w / 2,
        y: -w * 0.6,
        opacity: 1,
        paddingBottom: 3,
        z: total - index,
        borderRadius: 2,
      };
    }
    case "albums": {
      const ap = getAlbumPosition(photo, isMobile);
      return {
        left: "50%",
        top: "42%",
        rotate: ap.rot,
        width: ap.width,
        x: ap.x - ap.width / 2,
        y: ap.y,
        opacity: ap.opacity,
        paddingBottom: isMobile ? 14 : 22,
        z: ap.z,
        borderRadius: 6,
      };
    }
  }
}

/* ─── photo component ──────────────────────────────── */

function AnimatedPhoto({
  photo, index, total, phase, isMobile,
}: {
  photo: PhotoData; index: number; total: number; phase: Phase; isMobile: boolean;
}) {
  const style = getPhotoStyle(photo, phase, isMobile, index, total);
  const stagger = (index / total) * 0.15;

  return (
    <motion.div
      animate={{
        left: style.left,
        top: style.top,
        rotate: style.rotate,
        width: style.width,
        x: style.x,
        y: style.y,
        opacity: style.opacity,
      }}
      transition={{
        duration: 1.4,
        delay: stagger,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{
        position: "absolute",
        zIndex: style.z,
      }}
    >
      <motion.div
        animate={{ paddingBottom: style.paddingBottom, borderRadius: style.borderRadius }}
        transition={{ duration: 1.4, delay: stagger, ease: [0.25, 0.1, 0.25, 1] }}
        className="pt-[3px] px-[3px] bg-card"
        style={{ overflow: "hidden" }}
      >
        <div
          style={{
            border: "1px solid hsl(var(--border))",
            boxShadow: phase === "albums"
              ? "0 8px 30px rgba(0,0,0,0.12)"
              : "1px 2px 10px rgba(0,0,0,0.10)",
            borderRadius: style.borderRadius,
            overflow: "hidden",
          }}
        >
          <img
            src={photo.src}
            alt=""
            className="w-full block"
            style={{ aspectRatio: "3/4", objectFit: "cover" }}
            loading="eager"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── phase indicator ──────────────────────────────── */

function PhaseIndicator({ phase }: { phase: Phase }) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
      {PHASE_ORDER.map((p) => (
        <motion.div
          key={p}
          className="rounded-full"
          animate={{
            width: phase === p ? 20 : 6,
            height: 6,
            backgroundColor:
              phase === p
                ? "hsl(var(--foreground))"
                : "hsl(var(--muted-foreground) / 0.3)",
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}

/* ─── album labels ─────────────────────────────────── */

function AlbumLabels({ phase, isMobile }: { phase: Phase; isMobile: boolean }) {
  const cardW = isMobile ? 65 : 160;
  const gap = isMobile ? 8 : 24;
  const totalW = 3 * cardW + 2 * gap;
  const startX = -totalW / 2;

  return (
    <>
      {groups.map((g, gi) => {
        const groupX = startX + gi * (cardW + gap);
        return (
          <motion.div
            key={g.label}
            animate={{ opacity: phase === "albums" ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              left: "50%",
              top: "42%",
              transform: `translateX(${groupX}px)`,
              width: cardW,
            }}
            className="absolute z-10 pointer-events-none"
          >
            <div
              className="text-left"
              style={{
                marginTop: isMobile ? 130 : 230,
              }}
            >
              <p className="text-[11px] sm:text-[13px] font-sans font-semibold uppercase tracking-[0.14em] text-foreground">
                {g.label}
              </p>
              <p className="text-[9px] sm:text-[11px] font-sans font-light text-muted-foreground mt-0.5">
                {g.meta}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
                  <User size={10} className="text-muted-foreground" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-sans font-light text-muted-foreground">
                  {g.creator}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </>
  );
}

/* ─── main component ───────────────────────────────── */

export default function HeroAnimatedDemo() {
  const isMobile = useIsMobile();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const phase = PHASE_ORDER[phaseIndex];

  const advancePhase = useCallback(() => {
    setPhaseIndex((prev) => (prev + 1) % PHASE_ORDER.length);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(advancePhase, PHASE_DURATIONS[phase]);
    return () => clearTimeout(timeout);
  }, [phase, advancePhase]);

  const showHeroText = true;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      {/* ── hero text — visible during spread phase ── */}
      <motion.div
        animate={{ opacity: showHeroText ? 1 : 0.6 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="absolute top-[100px] sm:top-[130px] left-0 right-0 flex justify-center z-30 pointer-events-none"
      >
        <div
          className="text-center px-6 py-8 rounded-2xl"
          style={{
            background: "radial-gradient(ellipse at center, hsl(var(--background)) 0%, hsl(var(--background) / 0.92) 40%, hsl(var(--background) / 0.7) 70%, transparent 100%)",
          }}
        >
          <h1 className="font-display font-light text-[32px] sm:text-[48px] md:text-[64px] leading-[1.08] tracking-[-0.02em] text-foreground">
            Every event deserves
            <br />
            a better album.
          </h1>
          <Link
            to="/create"
            className="inline-block mt-5 text-[13px] font-sans font-normal text-muted-foreground hover:text-foreground transition-colors duration-200 pointer-events-auto"
          >
            Create your shared album →
          </Link>
        </div>
      </motion.div>

      {/* ── animation stage ── */}
      <div className="absolute inset-0 overflow-hidden">
        {photos.map((p, i) => (
          <AnimatedPhoto
            key={i}
            photo={p}
            index={i}
            total={photos.length}
            phase={phase}
            isMobile={isMobile}
          />
        ))}

        <AlbumLabels phase={phase} isMobile={isMobile} />

        {/* ── CTA (albums phase) ── */}
        <motion.div
          animate={{ opacity: phase === "albums" ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="absolute bottom-[28px] sm:bottom-[60px] left-1/2 -translate-x-1/2 z-20"
        >
          <Link
            to="/dashboard"
            className="text-[13px] font-sans font-normal text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Browse your albums →
          </Link>
        </motion.div>

        <PhaseIndicator phase={phase} />
      </div>
    </div>
  );
}
