import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import album1 from "@/assets/album-1.jpg";
import album2 from "@/assets/album-2.jpg";
import album3 from "@/assets/album-3.jpg";
import album4 from "@/assets/album-4.jpg";
import album5 from "@/assets/album-5.jpg";
import album6 from "@/assets/album-6.jpg";

const albums = [
  { src: album1, label: "Rooftop Party" },
  { src: album2, label: "Sarah's Wedding" },
  { src: album3, label: "Neon Festival" },
  { src: album4, label: "Mia's Birthday" },
  { src: album5, label: "Graduation '25" },
  { src: album6, label: "Beach Bonfire" },
];

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Zoom: starts at scale 4 (single center album fills view) → zooms out to full grid
  const scale = useTransform(scrollYProgress, [0, 0.55], [4, 1]);
  const surroundingOpacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 0.2], [0, -30]);
  const ctaOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.5, 0.65], [20, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 md:px-12 py-5 max-w-[1400px] mx-auto">
          <span className="text-[12px] font-sans font-normal uppercase tracking-[0.2em] text-foreground">
            ENCORE
          </span>
          <div className="flex items-center gap-0 text-[13px] font-sans font-normal text-foreground">
            <Link to="/auth" className="px-3 py-1 hover:opacity-60 transition-opacity duration-200">
              Sign in
            </Link>
            <span className="text-border">|</span>
            <Link to="/create" className="px-3 py-1 hover:opacity-60 transition-opacity duration-200">
              Create album
            </Link>
          </div>
        </div>
      </nav>

      {/* SECTION 1 — Scrollable zoom hero */}
      <div ref={containerRef} className="relative h-[280vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          {/* Headline — fades out on scroll */}
          <motion.div
            style={{ opacity: headlineOpacity, y: headlineY }}
            className="absolute z-20 text-center pointer-events-none px-6"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[11px] font-sans font-normal uppercase tracking-[0.15em] text-muted-foreground mb-6"
            >
              SHARED PHOTO ALBUMS
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="font-display font-light text-[48px] sm:text-[64px] md:text-[88px] leading-[1.05] tracking-[-0.02em] text-foreground"
            >
              Every event deserves
              <br />
              a better album.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 text-[13px] font-sans font-light text-muted-foreground"
            >
              Scroll to explore
            </motion.p>
          </motion.div>

          {/* Album grid — zooms out from center */}
          <motion.div
            style={{ scale }}
            className="grid grid-cols-3 gap-2 md:gap-3 w-[88vw] max-w-3xl"
          >
            {albums.map((album, i) => {
              const isCenter = i === 1;
              return (
                <motion.div
                  key={album.label}
                  style={{ opacity: isCenter ? 1 : surroundingOpacity }}
                  className="relative aspect-[3/4] overflow-hidden rounded-[2px]"
                >
                  <img
                    src={album.src}
                    alt={album.label}
                    className="w-full h-full object-cover"
                  />
                  <motion.div
                    style={{ opacity: surroundingOpacity }}
                    className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/40 to-transparent"
                  >
                    <p className="text-[11px] font-sans font-normal uppercase tracking-[0.1em] text-background">
                      {album.label}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA — appears after zoom completes */}
          <motion.div
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="absolute bottom-16 md:bottom-20 z-20 flex flex-col items-center gap-5"
          >
            <div className="flex items-center gap-6 text-[13px] font-sans font-normal">
              <Link
                to="/create"
                className="border border-foreground text-foreground uppercase tracking-[0.1em] px-8 py-3 rounded-[2px] hover:bg-foreground hover:text-background transition-all duration-200"
              >
                Create album
              </Link>
              <Link
                to="/join"
                className="text-foreground hover:underline underline-offset-4 transition-all duration-200"
              >
                Join event &rarr;
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* SECTION 2 — Footer */}
      <footer className="border-t border-border">
        <div className="flex items-center justify-between px-6 md:px-12 py-6 max-w-[1400px] mx-auto">
          <span className="text-[12px] font-sans font-normal text-muted-foreground">
            &copy; Encore 2025
          </span>
          <div className="flex items-center gap-4 text-[12px] font-sans font-normal text-muted-foreground">
            <span className="hover:text-foreground transition-colors duration-200 cursor-pointer">Privacy</span>
            <span>&middot;</span>
            <span className="hover:text-foreground transition-colors duration-200 cursor-pointer">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
