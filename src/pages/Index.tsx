import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

import yosemiteCover from "@/assets/yosemite-cover.jpg";
import yosemiteThumb1 from "@/assets/yosemite-thumb1.jpg";
import yosemiteThumb2 from "@/assets/yosemite-thumb2.jpg";
import yosemiteThumb3 from "@/assets/yosemite-thumb3.jpg";

import startupCover from "@/assets/startup-cover.jpg";
import startupThumb1 from "@/assets/startup-thumb1.jpg";
import startupThumb2 from "@/assets/startup-thumb2.png";
import startupThumb3 from "@/assets/startup-thumb3.jpg";

import bdayCover from "@/assets/bday-cover.jpg";
import bdayThumb1 from "@/assets/bday-thumb1.jpg";

import rtfCover from "@/assets/rtf-cover.jpg";
import rtfThumb1 from "@/assets/rtf-thumb1.jpg";
import rtfThumb2 from "@/assets/rtf-thumb2.jpg";
import rtfThumb3 from "@/assets/rtf-thumb3.jpg";

const albums = [
  {
    title: "Yosemite Trip",
    meta: "Jan 2025  ·  4 photos",
    cover: yosemiteCover,
    thumbs: [yosemiteThumb1, yosemiteThumb2, yosemiteThumb3],
  },
  {
    title: "23rd Birthday Party",
    meta: "Mar 2025  ·  4 photos",
    cover: bdayCover,
    thumbs: [bdayThumb1, yosemiteThumb1, yosemiteThumb3],
  },
  {
    title: "Startup Design Team",
    meta: "Feb 2025  ·  5 photos",
    cover: startupCover,
    thumbs: [startupThumb1, startupThumb2, startupThumb3],
  },
  {
    title: "RTF Club",
    meta: "Mar 2025  ·  4 photos",
    cover: rtfCover,
    thumbs: [rtfThumb1, rtfThumb2, rtfThumb3],
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
  const [accessCode, setAccessCode] = useState("");
  const [joining, setJoining] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = accessCode.trim();
    if (!code) return;

    // If not signed in, redirect to auth with return URL
    if (!user) {
      navigate(`/auth?redirect=/join&code=${encodeURIComponent(code)}`);
      return;
    }

    setJoining(true);

    // Try access code
    const { data: byCode } = await supabase
      .from("events")
      .select("slug")
      .eq("access_code", code)
      .single();

    if (byCode) {
      navigate(`/e/${byCode.slug}`);
      return;
    }

    // Try slug
    let slug = code;
    const urlMatch = slug.match(/\/e\/([^/?#]+)/);
    if (urlMatch) slug = urlMatch[1];

    const { data: bySlug } = await supabase
      .from("events")
      .select("slug")
      .eq("slug", slug)
      .single();

    if (bySlug) {
      navigate(`/e/${bySlug.slug}`);
      return;
    }

    toast.error("Album not found. Check the code and try again.");
    setJoining(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center justify-between px-6 md:px-12 py-5 max-w-[1400px] mx-auto">
          <span
            className="text-[15px] font-sans font-black uppercase tracking-[0.3em] relative select-none"
            style={{
              background: "linear-gradient(180deg, hsl(0 0% 10%) 0%, hsl(0 0% 55%) 50%, hsl(0 0% 15%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "contrast(1.4)",
            }}
          >
            RECAP
          </span>
          <div className="flex items-center gap-0 text-[13px] font-sans font-light text-muted-foreground">
            <Link to="/join" className="px-3 py-1 hover:text-foreground transition-colors duration-200">
              Join
            </Link>
            <span className="text-border">|</span>
            <Link to="/auth" className="px-3 py-1 hover:text-foreground transition-colors duration-200">
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
                className="text-[13px] font-sans font-normal text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Create your shared album &rarr;
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
            <span className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Recent Albums
            </span>
            <span className="text-[10px] font-sans font-light text-muted-foreground/60 hidden sm:block pr-0 md:pr-[8vw]">
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
                className="flex-shrink-0 w-[220px] sm:w-[240px] md:w-[260px] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  height: "320px",
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "2px 6px 24px rgba(0,0,0,0.08)",
                }}
              >
                {/* Cover photo — 65% */}
                <div className="w-full" style={{ height: "65%" }}>
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="w-full h-full object-cover brightness-[0.85] contrast-[1.05]"
                  />
                </div>

                {/* Photo strip — 15% */}
                <div className="w-full flex" style={{ height: "15%", gap: "1px" }}>
                  {album.thumbs.map((thumb, j) => (
                    <img
                      key={j}
                      src={thumb}
                      alt=""
                      className="h-full object-cover brightness-[0.75] contrast-[1.05]"
                      style={{ width: "calc(33.333% - 0.67px)" }}
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

        {/* Suggestions + Join section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 1.1 }}
          className="px-6 md:px-[8vw] pt-10 pb-16"
        >
          {/* Create suggestions */}
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Create an album for
          </p>
          <div className="flex flex-wrap gap-2 mb-10">
            {suggestions.map((s) => (
              <Link
                key={s.label}
                to="/create"
                className="inline-flex items-center px-4 py-2 rounded-full border border-border bg-card text-[12px] font-sans font-normal text-foreground hover:bg-accent hover:border-muted-foreground/30 transition-all duration-200"
              >
                {s.label}
              </Link>
            ))}
          </div>

          {/* Join an album */}
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Join an album
          </p>
          <form onSubmit={handleJoin} className="flex items-center gap-2 max-w-sm">
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Enter access code"
              className="flex-1 h-10 px-4 rounded-full border border-border bg-card text-[13px] font-sans text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring/30 transition-all duration-200"
            />
            <button
              type="submit"
              disabled={joining || !accessCode.trim()}
              className="h-10 px-5 rounded-full bg-primary text-primary-foreground text-[12px] font-sans font-medium tracking-wide uppercase hover:opacity-90 disabled:opacity-40 transition-all duration-200"
            >
              {joining ? "..." : "Join →"}
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;