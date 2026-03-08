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

  // Single center photo starts tiny → grid fans out as user scrolls
  const scale = useTransform(scrollYProgress, [0, 0.5], [5, 1]);
  const surroundingOpacity = useTransform(scrollYProgress, [0.05, 0.4], [0, 1]);
  const gridRotateX = useTransform(scrollYProgress, [0, 0.5], [8, 0]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 0.15], [0, -40]);
  const ctaBottomOpacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const ctaBottomY = useTransform(scrollYProgress, [0.45, 0.6], [16, 0]);

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

      {/* Scrollable zoom hero */}
      <div ref={containerRef} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          {/* Headline + CTA — fades out on scroll */}
          <motion.div
            style={{ opacity: headlineOpacity, y: headlineY }}
            className="absolute z-20 text-center pointer-events-auto px-6 flex flex-col items-center"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[11px] font-sans font-normal uppercase tracking-[0.15em] text-muted-foreground mb-5"
            >
              SHARED PHOTO ALBUMS
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="font-display font-light text-[44px] sm:text-[56px] md:text-[80px] leading-[1.05] tracking-[-0.02em] text-foreground"
            >
              Every event deserves
              <br />
              a better album.
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-8"
            >
              <Link
                to="/create"
                className="text-[13px] font-sans font-normal text-foreground hover:underline underline-offset-4 transition-all duration-200"
              >
                Create your album &rarr;
              </Link>
            </motion.div>
          </motion.div>

          {/* Tiny album grid — zooms out from center */}
          <motion.div
            style={{
              scale,
              rotateX: gridRotateX,
              transformPerspective: 1200,
            }}
            className="grid grid-cols-3 gap-1.5 md:gap-2 w-[70vw] max-w-md"
          >
            {albums.map((album, i) => {
              const isCenter = i === 1;
              return (
                <motion.div
                  key={album.label}
                  style={{ opacity: isCenter ? 1 : surroundingOpacity }}
                  className="relative aspect-[3/4] overflow-hidden rounded-[2px] grayscale"
                >
                  <img
                    src={album.src}
                    alt={album.label}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom CTA — appears after zoom completes */}
          <motion.div
            style={{ opacity: ctaBottomOpacity, y: ctaBottomY }}
            className="absolute bottom-14 md:bottom-20 z-20 flex flex-col items-center gap-5"
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

      {/* Footer */}
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
