import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

import album1 from "@/assets/album-1.jpg";
import album2 from "@/assets/album-2.jpg";
import album3 from "@/assets/album-3.jpg";
import album4 from "@/assets/album-4.jpg";
import album5 from "@/assets/album-5.jpg";
import album6 from "@/assets/album-6.jpg";

const albums = [
  { src: album1, label: "Rooftop Party", count: "247 photos" },
  { src: album2, label: "Sarah's Wedding", count: "412 photos" },
  { src: album3, label: "Neon Festival", count: "189 photos" },
  { src: album4, label: "Mia's Birthday", count: "94 photos" },
  { src: album5, label: "Graduation '25", count: "156 photos" },
  { src: album6, label: "Beach Bonfire", count: "73 photos" },
];

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Zoom-out: starts at scale 3 (zoomed into center album) → zooms out to scale 1 showing all
  const scale = useTransform(scrollYProgress, [0, 0.5], [3.5, 1]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.15], [0.6, 1]);
  // Center album starts full opacity, others fade in as we zoom out
  const surroundingOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  // Text fades out as user scrolls
  const textOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.25], [0, -40]);
  // CTA section fades in at end of zoom
  const ctaOpacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.45, 0.6], [30, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/10">
        <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <Link to="/" className="text-xl font-display text-metallic">
            Encore
          </Link>
          <div className="flex items-center gap-1">
            <Link to="/join">
              <Button variant="ghost" size="sm" className="text-xs h-8">
                Join
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="text-xs h-8 rounded-full px-4">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Scrollable zoom-out hero — tall container for scroll distance */}
      <div ref={containerRef} className="relative h-[250vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          {/* Overlay text — fades out on scroll */}
          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="absolute z-20 text-center px-6 pointer-events-none"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display leading-[1.05] tracking-tight mb-4"
            >
              Every event deserves
              <br />
              <span className="text-primary italic">a better album.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-sm text-muted-foreground"
            >
              Scroll to explore ↓
            </motion.p>
          </motion.div>

          {/* Album grid — zooms out from center */}
          <motion.div
            style={{ scale, opacity: gridOpacity }}
            className="grid grid-cols-3 gap-3 md:gap-4 w-[90vw] max-w-4xl"
          >
            {albums.map((album, i) => {
              const isCenter = i === 1; // top-center for visual focus
              return (
                <motion.div
                  key={album.label}
                  style={{ opacity: isCenter ? 1 : surroundingOpacity }}
                  className="relative aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden group"
                >
                  <img
                    src={album.src}
                    alt={album.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-xs font-medium text-foreground truncate">{album.label}</p>
                    <p className="text-[10px] text-muted-foreground">{album.count}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA — appears after zoom-out completes */}
          <motion.div
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="absolute bottom-12 md:bottom-16 z-20 flex flex-col items-center gap-4 px-6"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Collect every photo. Zero friction.
            </p>
            <div className="flex gap-3">
              <Link to="/create">
                <Button variant="hero" size="lg" className="rounded-full">
                  Create event <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/join">
                <Button variant="soft" size="lg" className="rounded-full">
                  Join event
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer — ultra-minimal */}
      <footer className="border-t border-border/10 py-6">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            <span className="font-display text-metallic text-sm">Encore</span>{" "}
            <span className="text-muted-foreground/40">·</span> Made for moments
          </span>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <Link to="/join" className="hover:text-foreground transition-colors">Join</Link>
            <Link to="/auth" className="hover:text-foreground transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
