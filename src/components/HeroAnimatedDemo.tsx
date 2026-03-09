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

type Phase = "scatter" | "spiral" | "gather" | "albums";

interface PhotoData {
  src: string;
  group: number;
  idx: number;
  scatter: { top: number; left: number; rot: number };
}

/* ─── data (3 albums × 4 photos = 12) ──────────────── */

const photos: PhotoData[] = [
  { src: yosemiteCover, group: 0, idx: 0, scatter: { top: 15, left: 10, rot: -3 } },
  { src: yosemiteThumb1, group: 0, idx: 1, scatter: { top: 60, left: 8, rot: 2 } },
  { src: yosemiteThumb2, group: 0, idx: 2, scatter: { top: 18, left: 25, rot: -1.5 } },
  { src: yosemiteThumb3, group: 0, idx: 3, scatter: { top: 64, left: 22, rot: 3.5 } },
  { src: hikeThumb3, group: 1, idx: 0, scatter: { top: 12, left: 42, rot: -2 } },
  { src: rtfCover, group: 1, idx: 1, scatter: { top: 62, left: 38, rot: 1 } },
  { src: rtfThumb1, group: 1, idx: 2, scatter: { top: 16, left: 58, rot: -4 } },
  { src: rtfThumb2, group: 1, idx: 3, scatter: { top: 65, left: 55, rot: 2.5 } },
  { src: nightThumb1, group: 2, idx: 0, scatter: { top: 14, left: 72, rot: -1 } },
  { src: nightThumb2, group: 2, idx: 1, scatter: { top: 60, left: 70, rot: 3 } },
  { src: nightThumb3, group: 2, idx: 2, scatter: { top: 35, left: 85, rot: -2.5 } },
  { src: bdayThumb1, group: 2, idx: 3, scatter: { top: 62, left: 88, rot: 1.5 } },
];

const groups = [
  { label: "YOSEMITE TRIP", meta: "4 photos · Jan 2025", creator: "Alex M.", left: 20 },
  { label: "WINTER HIKE", meta: "4 photos · Jan 2025", creator: "Jamie L.", left: 50 },
  { label: "NIGHT & NATURE", meta: "4 photos · Jan 2025", creator: "Sam K.", left: 80 },
];

const deck = [
  { rot: 0, x: 0, y: -127, opacity: 1, z: 4 },
  { rot: -6, x: -12, y: -117, opacity: 0.9, z: 3 },
  { rot: 6, x: 12, y: -112, opacity: 0.75, z: 2 },
  { rot: -10, x: -20, y: -107, opacity: 0.55, z: 1 },
];

/* ─── timing ───────────────────────────────────────── */

const PHASE_DURATIONS: Record<Phase, number> = {
  scatter: 2500,
  spiral: 3000,
  gather: 1200,
  albums: 3500,
};

const PHASE_ORDER: Phase[] = ["scatter", "spiral", "gather", "albums"];

/* ─── spiral math (counterclockwise, expanding) ────── */

function getSpiralPosition(index: number, total: number, maxRadius: number) {
  const progress = index / total;
  // counterclockwise: negative direction, 2 full rotations
  const angle = -progress * Math.PI * 4 - Math.PI / 2;
  const radius = 30 + progress * maxRadius;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const rot = ((angle * 180) / Math.PI) * 0.08;
  return { x, y, rot };
}

/* ─── responsive sizes ─────────────────────────────── */

const PHOTO_W_MOBILE = 32;
const PHOTO_W_DESKTOP = 56;
const ALBUM_W_MOBILE = 90;
const ALBUM_W_DESKTOP = 180;

/* ─── helpers to compute target styles per phase ──── */

function getPhotoStyle(photo: PhotoData, phase: Phase, isMobile: boolean, index: number, total: number) {
  const g = groups[photo.group];
  const d = deck[photo.idx];
  const pw = isMobile ? PHOTO_W_MOBILE : PHOTO_W_DESKTOP;
  const aw = isMobile ? ALBUM_W_MOBILE : ALBUM_W_DESKTOP;
  const spiralR = isMobile ? 120 : 280;
  const gatherR = isMobile ? 60 : 140;

  switch (phase) {
    case "scatter":
      return {
        left: `${photo.scatter.left}%`,
        top: `${photo.scatter.top}%`,
        rotate: photo.scatter.rot,
        width: pw,
        x: 0,
        y: 0,
        opacity: 1,
        paddingBottom: 3,
      };
    case "spiral": {
      const pos = getSpiralPosition(index, total, spiralR);
      return {
        left: "50%",
        top: "50%",
        rotate: pos.rot,
        width: pw,
        x: pos.x - pw / 2,
        y: pos.y - 55,
        opacity: 1,
        paddingBottom: 3,
      };
    }
    case "gather": {
      const pos = getSpiralPosition(index, total, gatherR);
      return {
        left: "50%",
        top: "50%",
        rotate: pos.rot * 0.5,
        width: pw,
        x: pos.x - pw / 2,
        y: pos.y - 55,
        opacity: 1,
        paddingBottom: 3,
      };
    }
    case "albums":
      return {
        left: `${g.left}%`,
        top: "50%",
        rotate: d.rot,
        width: aw,
        x: d.x * (isMobile ? 0.5 : 1),
        y: d.y * (isMobile ? 0.5 : 1),
        opacity: d.opacity,
        paddingBottom: isMobile ? 10 : 18,
      };
  }
}

/* ─── photo component ──────────────────────────────── */

function AnimatedPhoto({
  photo, index, total, phase, isMobile,
}: {
  photo: PhotoData; index: number; total: number; phase: Phase; isMobile: boolean;
}) {
  const style = getPhotoStyle(photo, phase, isMobile, index, total);
  const d = deck[photo.idx];
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
        duration: 1.2,
        delay: stagger,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{
        position: "absolute",
        zIndex: phase === "albums" ? d.z : 1,
      }}
    >
      <motion.div
        animate={{ paddingBottom: style.paddingBottom }}
        transition={{ duration: 1.2, delay: stagger, ease: [0.25, 0.1, 0.25, 1] }}
        className="pt-[3px] px-[3px] bg-card rounded-sm"
      >
        <div
          style={{
            border: "1px solid hsl(var(--border))",
            boxShadow: "1px 2px 10px rgba(0,0,0,0.10)",
            borderRadius: 2,
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

/* ─── phase indicator dots ─────────────────────────── */

function PhaseIndicator({ phase }: { phase: Phase }) {
  const visiblePhases: Phase[] = ["scatter", "spiral", "albums"];
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
      {visiblePhases.map((p) => (
        <motion.div
          key={p}
          className="rounded-full"
          animate={{
            width: phase === p || (phase === "gather" && p === "albums") ? 20 : 6,
            height: 6,
            backgroundColor: phase === p || (phase === "gather" && p === "albums")
              ? "hsl(var(--foreground))"
              : "hsl(var(--muted-foreground) / 0.3)",
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
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

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      {/* ── hero text ── */}
      <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none" style={{ transform: 'translateY(-80px)' }}>
        <div className="text-center">
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
      </div>

      {/* ── animation stage ── */}
      <div className="absolute inset-0 overflow-hidden" style={{ transform: 'translateY(-80px)' }}>
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

        {/* ── album labels (left-aligned below each album) ── */}
        {groups.map((g) => (
          <motion.div
            key={g.label}
            animate={{ opacity: phase === "albums" ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ left: `${g.left}%` }}
            className="absolute top-1/2 z-10 pointer-events-none"
          >
            <div
              style={{
                transform: `translate(${isMobile ? -ALBUM_W_MOBILE / 2 : -ALBUM_W_DESKTOP / 2}px, ${isMobile ? 50 : 100}px)`,
                width: isMobile ? ALBUM_W_MOBILE : ALBUM_W_DESKTOP,
              }}
              className="text-left"
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
        ))}

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
