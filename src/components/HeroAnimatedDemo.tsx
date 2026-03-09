import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

type Phase = "scatter" | "line" | "albums";

interface PhotoData {
  src: string;
  group: number;
  idx: number;
  scatter: { top: number; left: number; rot: number };
  mobileScatter: { top: number; left: number; rot: number };
  lineLeft: number;
}

/* ─── data ─────────────────────────────────────────── */

const photos: PhotoData[] = [
  { src: yosemiteCover, group: 0, idx: 0, scatter: { top: 20, left: 50, rot: -3 }, mobileScatter: { top: 8, left: 5, rot: -3 }, lineLeft: 2 },
  { src: yosemiteThumb1, group: 0, idx: 1, scatter: { top: 10, left: 65, rot: 2 }, mobileScatter: { top: 4, left: 30, rot: 2 }, lineLeft: 10 },
  { src: yosemiteThumb2, group: 0, idx: 2, scatter: { top: 55, left: 58, rot: -1.5 }, mobileScatter: { top: 12, left: 55, rot: -1.5 }, lineLeft: 18 },
  { src: yosemiteThumb3, group: 0, idx: 3, scatter: { top: 65, left: 48, rot: 3.5 }, mobileScatter: { top: 16, left: 78, rot: 3.5 }, lineLeft: 26 },
  { src: hikeThumb3, group: 1, idx: 0, scatter: { top: 15, left: 82, rot: -2 }, mobileScatter: { top: 30, left: 10, rot: -2 }, lineLeft: 34 },
  { src: rtfCover, group: 1, idx: 1, scatter: { top: 60, left: 78, rot: 1 }, mobileScatter: { top: 34, left: 40, rot: 1 }, lineLeft: 42 },
  { src: rtfThumb1, group: 1, idx: 2, scatter: { top: 35, left: 70, rot: -4 }, mobileScatter: { top: 28, left: 65, rot: -4 }, lineLeft: 50 },
  { src: rtfThumb2, group: 1, idx: 3, scatter: { top: 45, left: 90, rot: 2.5 }, mobileScatter: { top: 38, left: 82, rot: 2.5 }, lineLeft: 58 },
  { src: nightThumb1, group: 2, idx: 0, scatter: { top: 30, left: 55, rot: -1 }, mobileScatter: { top: 50, left: 15, rot: -1 }, lineLeft: 66 },
  { src: nightThumb2, group: 2, idx: 1, scatter: { top: 70, left: 65, rot: 3 }, mobileScatter: { top: 48, left: 45, rot: 3 }, lineLeft: 74 },
  { src: nightThumb3, group: 2, idx: 2, scatter: { top: 75, left: 85, rot: -2.5 }, mobileScatter: { top: 54, left: 70, rot: -2.5 }, lineLeft: 82 },
  { src: bdayThumb1, group: 2, idx: 3, scatter: { top: 48, left: 75, rot: 1.5 }, mobileScatter: { top: 44, left: 88, rot: 1.5 }, lineLeft: 90 },
];

const groups = [
  { label: "YOSEMITE TRIP", meta: "4 photos · Jan 2025", creator: "Alex M.", left: 30 },
  { label: "WINTER HIKE", meta: "4 photos · Jan 2025", creator: "Jamie L.", left: 58 },
  { label: "NIGHT & NATURE", meta: "4 photos · Jan 2025", creator: "Sam K.", left: 85 },
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
  line: 2000,
  albums: 3500,
};

const PHASE_ORDER: Phase[] = ["scatter", "line", "albums"];

/* ─── helpers to compute target styles per phase ──── */

const MOBILE_ANIMATION_TOP = "0%";
const MOBILE_ALBUM_WIDTH = 82;
const MOBILE_PHOTO_WIDTH = 46;


function getPhotoStyle(photo: PhotoData, phase: Phase, isMobile: boolean) {
  const g = groups[photo.group];
  const d = deck[photo.idx];
  const albumW = isMobile ? MOBILE_ALBUM_WIDTH : 180;
  const scatter = isMobile ? photo.mobileScatter : photo.scatter;

  switch (phase) {
    case "scatter":
      return {
        left: `${scatter.left}%`,
        top: `${scatter.top}%`,
        rotate: scatter.rot,
        width: isMobile ? MOBILE_PHOTO_WIDTH : 88,
        x: 0,
        y: 0,
        opacity: 1,
        paddingBottom: 3,
      };
    case "line":
      return {
        left: `${photo.lineLeft}%`,
        top: isMobile ? "50%" : "50%",
        rotate: 0,
        width: isMobile ? MOBILE_PHOTO_WIDTH : 86,
        x: 0,
        y: isMobile ? -28 : -55,
        opacity: 1,
        paddingBottom: 3,
      };
    case "albums":
      return {
        left: `${g.left}%`,
        top: isMobile ? "50%" : "50%",
        rotate: d.rot,
        width: albumW,
        x: d.x * (isMobile ? 0.45 : 1),
        y: d.y * (isMobile ? 0.45 : 1),
        opacity: d.opacity,
        paddingBottom: isMobile ? 10 : 18,
      };
  }
}

/* ─── photo component ──────────────────────────────── */

function AnimatedPhoto({
  photo,
  index,
  phase,
  isMobile,
}: {
  photo: PhotoData;
  index: number;
  phase: Phase;
  isMobile: boolean;
}) {
  if (isMobile && photo.group === 2) return null;

  const style = getPhotoStyle(photo, phase, isMobile);
  const d = deck[photo.idx];

  // Stagger: center photos move first
  const stagger = (Math.abs(index - 5.5) / 5.5) * 0.08;

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
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
      {PHASE_ORDER.map((p) => (
        <motion.div
          key={p}
          className="rounded-full"
          animate={{
            width: phase === p ? 20 : 6,
            height: 6,
            backgroundColor: phase === p
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

  const displayedGroups = isMobile ? groups.slice(0, 2) : groups;
  const animationStageStyle = isMobile ? { top: MOBILE_ANIMATION_TOP } : { top: "0%" };

  const advancePhase = useCallback(() => {
    setPhaseIndex((prev) => (prev + 1) % PHASE_ORDER.length);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(advancePhase, PHASE_DURATIONS[phase]);
    return () => clearTimeout(timeout);
  }, [phase, advancePhase]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      {/* ── hero text — left aligned, vertically centered ── */}
      <div className="absolute top-1/2 -translate-y-1/2 left-[8vw] z-30 pointer-events-none">
        <h1 className="font-display font-light text-[38px] sm:text-[54px] md:text-[72px] leading-[1.08] tracking-[-0.02em] text-foreground">
          Every event deserves
          <br />
          a better album.
        </h1>
        <Link
          to="/create"
          className="inline-block mt-6 text-[13px] font-sans font-normal text-muted-foreground hover:text-foreground transition-colors duration-200 pointer-events-auto"
        >
          Create your shared album →
        </Link>
      </div>

      <div className="absolute left-0 right-0 bottom-0 overflow-hidden" style={animationStageStyle}>
        {/* ── photos ── */}
        {photos.map((p, i) => (
          <AnimatedPhoto
            key={i}
            photo={p}
            index={i}
            phase={phase}
            isMobile={isMobile}
          />
        ))}

        {/* ── horizontal rule (line phase) ── */}
        <motion.div
          animate={{ opacity: phase === "line" ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-1/2 left-0 right-0 h-px bg-border pointer-events-none"
        />

        {/* ── album labels (albums phase) ── */}
        {displayedGroups.map((g) => (
          <motion.div
            key={g.label}
            animate={{ opacity: phase === "albums" ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ left: `${g.left}%` }}
            className="absolute top-1/2 -translate-x-1/2 z-10 pointer-events-none"
          >
            <div
              style={{ transform: `translateY(${isMobile ? 16 : 24}px)` }}
              className="text-center"
            >
              <p className="text-[12px] sm:text-[13px] font-sans font-semibold uppercase tracking-[0.14em] text-foreground">
                {g.label}
              </p>
              <p className="text-[10px] sm:text-[11px] font-sans font-light text-muted-foreground mt-1">
                {g.meta}
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
                  <User size={10} className="text-muted-foreground" />
                </div>
                <span className="text-[10px] font-sans font-light text-muted-foreground">
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
          className="absolute bottom-[28px] sm:bottom-[60px] left-[8vw] z-20"
        >
          <Link
            to="/dashboard"
            className="text-[13px] font-sans font-normal text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Browse your albums →
          </Link>
        </motion.div>

        {/* ── phase indicator ── */}
        <PhaseIndicator phase={phase} />
      </div>
    </div>
  );
}
