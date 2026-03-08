import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import yosemiteCover from "@/assets/yosemite-cover.jpg";
import yosemiteThumb1 from "@/assets/yosemite-thumb1.jpg";
import yosemiteThumb2 from "@/assets/yosemite-thumb2.jpg";
import yosemiteThumb3 from "@/assets/yosemite-thumb3.jpg";

import hikeThumb3 from "@/assets/hike-thumb3.jpg";

import nightThumb1 from "@/assets/night-thumb1.jpg";
import nightThumb2 from "@/assets/night-thumb2.jpg";
import nightThumb3 from "@/assets/night-thumb3.jpg";

import startupCover from "@/assets/startup-cover.jpg";
import startupThumb1 from "@/assets/startup-thumb1.jpg";

const albums = [
  {
    title: "Yosemite Trip",
    meta: "Jan 2025  ·  4 photos",
    cover: yosemiteCover,
    thumbs: [yosemiteThumb1, yosemiteThumb2, yosemiteThumb3],
  },
  {
    title: "Night & Nature",
    meta: "Jan 2025  ·  4 photos",
    cover: nightThumb2,
    thumbs: [nightThumb1, nightThumb2, nightThumb3],
  },
  {
    title: "Winter Trails",
    meta: "Jan 2025  ·  6 photos",
    cover: hikeThumb3,
    thumbs: [yosemiteThumb3, nightThumb1, yosemiteThumb1],
  },
  {
    title: "Golden Hour",
    meta: "Dec 2024  ·  8 photos",
    cover: yosemiteThumb2,
    thumbs: [nightThumb3, hikeThumb3, yosemiteThumb3],
  },
  {
    title: "Startup Design Team",
    meta: "Feb 2025  ·  5 photos",
    cover: startupCover,
    thumbs: [startupThumb1, nightThumb2, yosemiteThumb1],
  },
];

const suggestions = [
  { emoji: "🎂", label: "Birthday Party" },
  { emoji: "🏃", label: "Run Club" },
  { emoji: "✈️", label: "Trip with Friends" },
  { emoji: "💼", label: "Team Offsite" },
  { emoji: "🎓", label: "Graduation" },
  { emoji: "🏕️", label: "Weekend Camping" },
];

const ease = [0.16, 1, 0.3, 1] as const;

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 md:px-12 py-5 max-w-[1400px] mx-auto">
          <span
            className="text-[14px] font-sans font-bold uppercase tracking-[0.2em]"
            style={{
              background: "linear-gradient(180deg, hsl(var(--foreground)) 0%, hsl(var(--muted-foreground)) 50%, hsl(var(--foreground)) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "contrast(1.2)",
            }}
          >
            ENCORE
          </span>
          <div className="flex items-center gap-0 text-[13px] font-sans font-normal text-foreground">
            <Link to="/join" className="px-3 py-1 hover:opacity-60 transition-opacity duration-200">
              Join
            </Link>
            <span className="text-border">|</span>
            <Link to="/auth" className="px-3 py-1 hover:opacity-60 transition-opacity duration-200">
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Top area — text */}
        <div className="h-[50vh] flex items-center px-6 md:px-[8vw] pt-16">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="font-display font-light text-[42px] sm:text-[54px] md:text-[76px] leading-[1.05] tracking-[-0.02em] text-foreground"
            >
              Every event deserves
              <br />
              a better album.
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.12 }}
              className="mt-7"
            >
              <Link
                to="/create"
                className="text-[13px] font-sans font-normal text-foreground hover:underline underline-offset-4 transition-all duration-200"
              >
                Create your album &rarr;
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom area — film strip */}
        <div className="relative">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.4 }}
            className="flex items-center justify-between px-6 md:px-[8vw] mb-4"
          >
            <span className="text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Recent Albums
            </span>
            <span className="text-[11px] font-sans font-light text-muted-foreground hidden sm:block pr-0 md:pr-[8vw]">
              scroll to explore →
            </span>
          </motion.div>

          {/* Strip container */}
          <div
            className="flex flex-row gap-4 pl-6 md:pl-[8vw] pr-6 items-start overflow-x-auto scrollbar-hide pb-6"
            style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
          >
            {albums.map((album, i) => (
              <motion.div
                key={album.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.7,
                  ease,
                  delay: 0.5 + i * 0.1,
                }}
                className="flex-shrink-0 w-[220px] sm:w-[240px] md:w-[260px] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{
                  height: "320px",
                  background: "hsl(40 10% 98%)",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "2px 6px 24px rgba(0,0,0,0.09)",
                }}
              >
                {/* Cover photo — 65% */}
                <div className="w-full" style={{ height: "65%" }}>
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="w-full h-full object-cover brightness-[0.75] contrast-[1.05]"
                  />
                </div>

                {/* Photo strip — 15% */}
                <div className="w-full flex" style={{ height: "15%", gap: "2px" }}>
                  {album.thumbs.map((thumb, j) => (
                    <img
                      key={j}
                      src={thumb}
                      alt=""
                      className="h-full object-cover brightness-[0.7] contrast-[1.05]"
                      style={{ width: "calc(33.333% - 1.33px)" }}
                    />
                  ))}
                </div>

                {/* Album info — 20% */}
                <div
                  className="flex flex-col justify-center"
                  style={{ height: "20%", padding: "10px 12px" }}
                >
                  <span className="text-[12px] font-sans font-medium text-foreground leading-tight">
                    {album.title}
                  </span>
                  <span className="text-[11px] font-sans font-light text-muted-foreground mt-1">
                    {album.meta}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right edge fade */}
          <div
            className="absolute right-0 top-0 bottom-0 w-[120px] pointer-events-none"
            style={{
              background: "linear-gradient(to right, transparent, hsl(var(--background)) 85%)",
            }}
          />
        </div>

        {/* Suggestions section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 1.1 }}
          className="px-6 md:px-[8vw] pt-10 pb-16"
        >
          <p className="text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-muted-foreground mb-4">
            Create an album for
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {suggestions.map((s) => (
              <Link
                key={s.label}
                to="/create"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border/60 bg-card text-[12px] font-sans font-normal text-foreground hover:bg-accent hover:border-border transition-all duration-200"
              >
                <span>{s.emoji}</span>
                <span>{s.label}</span>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4 text-[13px] font-sans">
            <Link
              to="/create"
              className="text-foreground font-medium hover:underline underline-offset-4 transition-all duration-200"
            >
              Create album &rarr;
            </Link>
            <span className="text-border">|</span>
            <Link
              to="/join"
              className="text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-all duration-200"
            >
              Join an album
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
