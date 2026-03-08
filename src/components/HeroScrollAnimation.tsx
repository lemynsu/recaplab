import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  MotionValue,
} from "framer-motion";
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

/* ─── data ─────────────────────────────────────────── */

const photos = [
  // Group A — Yosemite Trip
  { src: yosemiteCover, group: 0, idx: 0, scatter: { top: 8, left: 7, rot: -3 }, lineLeft: 2 },
  { src: yosemiteThumb1, group: 0, idx: 1, scatter: { top: 12, left: 22, rot: 2 }, lineLeft: 10 },
  { src: yosemiteThumb2, group: 0, idx: 2, scatter: { top: 6, left: 52, rot: -1.5 }, lineLeft: 18 },
  { src: yosemiteThumb3, group: 0, idx: 3, scatter: { top: 10, left: 72, rot: 3.5 }, lineLeft: 26 },
  // Group B — Winter Hike
  { src: hikeThumb3, group: 1, idx: 0, scatter: { top: 10, left: 88, rot: -2 }, lineLeft: 34 },
  { src: rtfCover, group: 1, idx: 1, scatter: { top: 38, left: 4, rot: 1 }, lineLeft: 42 },
  { src: rtfThumb1, group: 1, idx: 2, scatter: { top: 42, left: 32, rot: -4 }, lineLeft: 50 },
  { src: rtfThumb2, group: 1, idx: 3, scatter: { top: 35, left: 60, rot: 2.5 }, lineLeft: 58 },
  // Group C — Night & Nature
  { src: nightThumb1, group: 2, idx: 0, scatter: { top: 40, left: 80, rot: -1 }, lineLeft: 66 },
  { src: nightThumb2, group: 2, idx: 1, scatter: { top: 68, left: 12, rot: 3 }, lineLeft: 74 },
  { src: nightThumb3, group: 2, idx: 2, scatter: { top: 72, left: 42, rot: -2.5 }, lineLeft: 82 },
  { src: bdayThumb1, group: 2, idx: 3, scatter: { top: 66, left: 75, rot: 1.5 }, lineLeft: 90 },
];

const groups = [
  { label: "YOSEMITE TRIP", meta: "4 photos · Jan 2025", left: 22 },
  { label: "WINTER HIKE", meta: "4 photos · Jan 2025", left: 50 },
  { label: "NIGHT & NATURE", meta: "4 photos · Jan 2025", left: 78 },
];

const deck = [
  { rot: 0, x: 0, y: -127, opacity: 1, z: 4 },
  { rot: -6, x: -12, y: -117, opacity: 0.9, z: 3 },
  { rot: 6, x: 12, y: -112, opacity: 0.75, z: 2 },
  { rot: -10, x: -20, y: -107, opacity: 0.55, z: 1 },
];

/* ─── individual photo ─────────────────────────────── */

interface ScrollPhotoProps {
  photo: (typeof photos)[0];
  index: number;
  scrollYProgress: MotionValue<number>;
  isMobile: boolean;
}

function ScrollPhoto({ photo, index, scrollYProgress, isMobile }: ScrollPhotoProps) {
  const g = groups[photo.group];
  const d = deck[photo.idx];

  // stagger: center photos arrive at line first
  const stagger = (Math.abs(index - 5.5) / 5.5) * 0.05;
  const lineIn = 0.25 + stagger;
  const lineSettled = Math.min(lineIn + 0.15, 0.54);

  const k = [0, lineIn, lineSettled, 0.55, 1.0];

  const albumW = isMobile ? 140 : 180;

  const left = useTransform(scrollYProgress, k, [
    photo.scatter.left, photo.scatter.left, photo.lineLeft, photo.lineLeft, g.left,
  ]);
  const top = useTransform(scrollYProgress, k, [
    photo.scatter.top, photo.scatter.top, 50, 50, 50,
  ]);
  const rotate = useTransform(scrollYProgress, k, [
    photo.scatter.rot, photo.scatter.rot, 0, 0, d.rot,
  ]);
  const width = useTransform(scrollYProgress, k, [
    isMobile ? 64 : 88, isMobile ? 64 : 88, isMobile ? 64 : 86, isMobile ? 64 : 86, albumW,
  ]);
  const x = useTransform(scrollYProgress, k, [0, 0, 0, 0, d.x]);
  const y = useTransform(scrollYProgress, k, [0, 0, -55, -55, d.y]);
  const opacity = useTransform(scrollYProgress, k, [1, 1, 1, 1, d.opacity]);
  const padBottom = useTransform(scrollYProgress, k, [3, 3, 3, 3, 18]);

  const leftPct = useMotionTemplate`${left}%`;
  const topPct = useMotionTemplate`${top}%`;

  // hide group C on mobile
  if (isMobile && photo.group === 2) return null;

  return (
    <motion.div
      style={{
        position: "absolute",
        left: leftPct,
        top: topPct,
        width,
        rotate,
        x,
        y,
        opacity,
        zIndex: d.z,
      }}
    >
      <motion.div
        style={{ paddingBottom: padBottom }}
        className="pt-[3px] px-[3px] bg-card rounded-sm"
        // static border + shadow
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

/* ─── main component ───────────────────────────────── */

export default function HeroScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const isMobile = useIsMobile();

  // global opacity transforms
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const lineRuleOpacity = useTransform(scrollYProgress, [0.32, 0.42, 0.55, 0.62], [0, 1, 1, 0]);
  const albumLabelOpacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);

  const displayedGroups = isMobile ? groups.slice(0, 2) : groups;

  return (
    <div
      ref={containerRef}
      style={{ height: isMobile ? "300vh" : "400vh" }}
      className="relative"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        {/* ── hero text ── */}
        <motion.div
          style={{ opacity: heroTextOpacity }}
          className="absolute top-[80px] sm:top-[72px] left-[8vw] z-20 pointer-events-none"
        >
          <h1 className="font-display font-light text-[38px] sm:text-[54px] md:text-[72px] leading-[1.08] tracking-[-0.02em] text-foreground">
            Every event deserves
            <br />
            a better album.
          </h1>
        </motion.div>

        {/* ── photos ── */}
        {photos.map((p, i) => (
          <ScrollPhoto
            key={i}
            photo={p}
            index={i}
            scrollYProgress={scrollYProgress}
            isMobile={isMobile}
          />
        ))}

        {/* ── horizontal rule (state 2) ── */}
        <motion.div
          style={{ opacity: lineRuleOpacity }}
          className="absolute top-1/2 left-0 right-0 h-px bg-border pointer-events-none"
        />

        {/* ── album labels (state 3) ── */}
        {displayedGroups.map((g) => (
          <motion.div
            key={g.label}
            style={{ opacity: albumLabelOpacity, left: `${g.left}%` }}
            className="absolute top-1/2 -translate-x-1/2 z-10 pointer-events-none"
          >
            <div style={{ transform: "translateY(110px)" }} className="text-center">
              <p className="text-[11px] font-sans font-medium uppercase tracking-[0.12em] text-foreground">
                {g.label}
              </p>
              <p className="text-[11px] font-sans font-light text-muted-foreground mt-0.5">
                {g.meta}
              </p>
            </div>
          </motion.div>
        ))}

        {/* ── CTA (state 3) ── */}
        <motion.div
          style={{ opacity: ctaOpacity }}
          className="absolute bottom-[60px] left-[8vw] z-20"
        >
          <Link
            to="/dashboard"
            className="text-[13px] font-sans font-normal text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Browse your albums →
          </Link>
        </motion.div>

        {/* ── scroll indicator ── */}
        <motion.div
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-[10px] font-sans font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Scroll
          </span>
          <div className="w-px h-10 bg-muted-foreground/40" />
        </motion.div>
      </div>
    </div>
  );
}