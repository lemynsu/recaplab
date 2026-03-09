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

type Phase = "line" | "circle" | "gather" | "albums";

interface PhotoData {
  src: string;
  group: number;
  idx: number;
}

/* ─── data (12 photos → 3 albums × 4) ─────────────── */

const photos: PhotoData[] = [
  { src: yosemiteCover, group: 0, idx: 0 },
  { src: yosemiteThumb1, group: 0, idx: 1 },
  { src: yosemiteThumb2, group: 0, idx: 2 },
  { src: yosemiteThumb3, group: 0, idx: 3 },
  { src: hikeThumb3, group: 1, idx: 0 },
  { src: rtfCover, group: 1, idx: 1 },
  { src: rtfThumb1, group: 1, idx: 2 },
  { src: rtfThumb2, group: 1, idx: 3 },
  { src: nightThumb1, group: 2, idx: 0 },
  { src: nightThumb2, group: 2, idx: 1 },
  { src: nightThumb3, group: 2, idx: 2 },
  { src: bdayThumb1, group: 2, idx: 3 },
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
  line: 2800,
  circle: 3200,
  gather: 1400,
  albums: 3500,
};

const PHASE_ORDER: Phase[] = ["line", "circle", "gather", "albums"];

/* ─── layout math ──────────────────────────────────── */

function getLinePosition(index: number, total: number, isMobile: boolean) {
  // Spread photos evenly across a horizontal line
  // Edge photos tilt more, center photos are upright
  const spread = isMobile ? 90 : 85; // percentage width to span
  const offset = (100 - spread) / 2;
  const leftPct = offset + (index / (total - 1)) * spread;

  // Distance from center (0 = center, 1 = edge)
  const centerDist = Math.abs(index - (total - 1) / 2) / ((total - 1) / 2);

  // Edge photos tilt and scale down — like a conveyor belt
  const direction = index < total / 2 ? -1 : 1;
  const rot = direction * centerDist * centerDist * 35; // quadratic tilt
  const scale = 1 - centerDist * 0.3; // smaller at edges

  return { leftPct, rot, scale };
}

function getCirclePosition(index: number, total: number, radius: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  // Tangential rotation — photo faces outward
  const rot = (angle * 180) / Math.PI + 90;
  const clampedRot = ((rot % 360) + 360) % 360;
  const finalRot = clampedRot > 180 ? clampedRot - 360 : clampedRot;
  return { x, y, rot: finalRot * 0.2 };
}

/* ─── sizes ────────────────────────────────────────── */

const PW_MOBILE = 28;
const PW_DESKTOP = 52;
const AW_MOBILE = 90;
const AW_DESKTOP = 180;

/* ─── style per phase ─────────────────────────────── */

function getPhotoStyle(photo: PhotoData, phase: Phase, isMobile: boolean, index: number, total: number) {
  const g = groups[photo.group];
  const d = deck[photo.idx];
  const pw = isMobile ? PW_MOBILE : PW_DESKTOP;
  const aw = isMobile ? AW_MOBILE : AW_DESKTOP;
  const circleR = isMobile ? 140 : 300;
  const gatherR = isMobile ? 40 : 70;

  switch (phase) {
    case "line": {
      const lp = getLinePosition(index, total, isMobile);
      return {
        left: `${lp.leftPct}%`,
        top: "50%",
        rotate: lp.rot,
        width: pw * lp.scale,
        x: -(pw * lp.scale) / 2,
        y: -40,
        opacity: 1,
        paddingBottom: 3,
      };
    }
    case "circle": {
      const cp = getCirclePosition(index, total, circleR);
      return {
        left: "50%",
        top: "50%",
        rotate: cp.rot,
        width: pw,
        x: cp.x - pw / 2,
        y: cp.y - 40,
        opacity: 1,
        paddingBottom: 3,
      };
    }
    case "gather": {
      // Compress toward center with slight spread
      const cp = getCirclePosition(index, total, gatherR);
      return {
        left: "50%",
        top: "50%",
        rotate: cp.rot * 2,
        width: pw * 0.85,
        x: cp.x - (pw * 0.85) / 2,
        y: cp.y - 40,
        opacity: 0.9,
        paddingBottom: 3,
      };
    }
    case "albums":
      return {
        left: `${g.left}%`,
        top: "46%",
        rotate: d.rot,
        width: aw,
        x: d.x * (isMobile ? 0.5 : 1) - aw / 2,
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
  const stagger = (index / total) * 0.14;

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
        duration: 1.3,
        delay: stagger,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{
        position: "absolute",
        zIndex: phase === "albums" ? d.z : total - index,
      }}
    >
      <motion.div
        animate={{ paddingBottom: style.paddingBottom }}
        transition={{ duration: 1.3, delay: stagger, ease: [0.25, 0.1, 0.25, 1] }}
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

/* ─── phase indicator ──────────────────────────────── */

function PhaseIndicator({ phase }: { phase: Phase }) {
  const visible: Phase[] = ["line", "circle", "albums"];
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
      {visible.map((p) => (
        <motion.div
          key={p}
          className="rounded-full"
          animate={{
            width: phase === p || (phase === "gather" && p === "albums") ? 20 : 6,
            height: 6,
            backgroundColor:
              phase === p || (phase === "gather" && p === "albums")
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

  // Hero text visible during circle & gather (when photos form ring around it)
  const showHeroText = phase === "circle" || phase === "gather";

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      {/* ── hero text — visible during circle phase ── */}
      <motion.div
        animate={{ opacity: showHeroText ? 1 : 0, scale: showHeroText ? 1 : 0.95 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
        style={{ transform: "translateY(-40px)" }}
      >
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
      </motion.div>

      {/* ── animation stage ── */}
      <div className="absolute inset-0 overflow-hidden" style={{ transform: "translateY(-40px)" }}>
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

        {/* ── album labels (left-aligned below each stack) ── */}
        {groups.map((g) => (
          <motion.div
            key={g.label}
            animate={{ opacity: phase === "albums" ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ left: `${g.left}%` }}
            className="absolute top-[46%] z-10 pointer-events-none"
          >
            <div
              style={{
                transform: `translate(${-(isMobile ? AW_MOBILE : AW_DESKTOP) / 2}px, ${isMobile ? 55 : 105}px)`,
                width: isMobile ? AW_MOBILE : AW_DESKTOP,
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
