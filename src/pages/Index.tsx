import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import album1 from "@/assets/album-1.jpg";
import album2 from "@/assets/album-2.jpg";
import album3 from "@/assets/album-3.jpg";
import album4 from "@/assets/album-4.jpg";
import album5 from "@/assets/album-5.jpg";
import album6 from "@/assets/album-6.jpg";

const albums = [album1, album2, album3, album4, album5, album6];

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.55], [6, 1]);
  const surroundingOpacity = useTransform(scrollYProgress, [0.05, 0.35], [0, 1]);
  const gridRotateX = useTransform(scrollYProgress, [0, 0.55], [6, 0]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 0.12], [0, -30]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 md:px-12 py-5 max-w-[1400px] mx-auto">
          <span className="text-[12px] font-sans font-normal uppercase tracking-[0.2em] text-foreground">
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

      {/* Single section — full scroll experience */}
      <div ref={containerRef} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          {/* Headline + CTA */}
          <motion.div
            style={{ opacity: headlineOpacity, y: headlineY }}
            className="absolute z-20 text-center pointer-events-auto px-6 flex flex-col items-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display font-light text-[42px] sm:text-[54px] md:text-[76px] leading-[1.05] tracking-[-0.02em] text-foreground"
            >
              Every event deserves
              <br />
              a better album.
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-7"
            >
              <Link
                to="/create"
                className="text-[13px] font-sans font-normal text-foreground hover:underline underline-offset-4 transition-all duration-200"
              >
                Create your album &rarr;
              </Link>
            </motion.div>
          </motion.div>

          {/* Tiny photo grid */}
          <motion.div
            style={{
              scale,
              rotateX: gridRotateX,
              transformPerspective: 1200,
            }}
            className="grid grid-cols-3 gap-1 w-[56vw] max-w-xs"
          >
            {albums.map((src, i) => (
              <motion.div
                key={i}
                style={{ opacity: i === 1 ? 1 : surroundingOpacity }}
                className="aspect-[3/4] overflow-hidden rounded-[1px] grayscale"
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
