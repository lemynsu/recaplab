import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import HeroAnimatedDemo from "@/components/HeroAnimatedDemo";

const suggestions = [
  { label: "Birthday Party" },
  { label: "Run Club" },
  { label: "Trip with Friends" },
  { label: "Team Offsite" },
  { label: "Graduation" },
  { label: "Weekend Camping" },
];

const Index = () => {
  const [accessCode, setAccessCode] = useState("");
  const [joining, setJoining] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = accessCode.trim();
    if (!code) return;

    if (!user) {
      navigate(`/auth?redirect=/join&code=${encodeURIComponent(code)}`);
      return;
    }

    setJoining(true);

    const { data: byCode } = await supabase
      .from("events")
      .select("slug")
      .eq("access_code", code)
      .single();

    if (byCode) {
      navigate(`/e/${byCode.slug}`);
      return;
    }

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
              background:
                "linear-gradient(180deg, hsl(0 0% 10%) 0%, hsl(0 0% 55%) 50%, hsl(0 0% 15%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "contrast(1.4)",
            }}
          >
            RECAP
          </span>
          <div className="flex items-center gap-0 text-[13px] font-sans font-light text-muted-foreground">
            <Link
              to="/join"
              className="px-3 py-1 hover:text-foreground transition-colors duration-200"
            >
              Join
            </Link>
            <span className="text-border">|</span>
            <Link
              to={user ? "/dashboard" : "/auth?redirect=/dashboard"}
              className="px-3 py-1 hover:text-foreground transition-colors duration-200"
            >
              My albums
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero scroll animation */}
      <HeroAnimatedDemo />

      {/* Suggestions + Join */}
      <div className="px-6 md:px-[8vw] pt-10 pb-16">
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
      </div>
    </div>
  );
};

export default Index;