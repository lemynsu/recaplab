import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import HeroAnimatedDemo from "@/components/HeroAnimatedDemo";


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
          <div className="flex items-center gap-4">
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
            <span className="text-border">·</span>
            <Link
              to="/about"
              className="text-[13px] font-sans font-light text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              About
            </Link>
          </div>
          <Link
            to={user ? "/dashboard" : "/auth?redirect=/dashboard"}
            className="text-[13px] font-sans font-light text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            My albums
          </Link>
        </div>
      </nav>

      {/* Hero scroll animation */}
      <HeroAnimatedDemo />

      {/* Join an album — single clean input */}
      <div className="px-6 md:px-[8vw] pt-10 pb-16">
        <form onSubmit={handleJoin} className="max-w-md">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Have a code?
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Paste an access code or link"
              className="flex-1 h-10 px-4 rounded-full border border-border bg-card text-[13px] font-sans text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring/30 transition-all duration-200"
            />
            <button
              type="submit"
              disabled={joining || !accessCode.trim()}
              className="h-10 px-5 rounded-full bg-primary text-primary-foreground text-[12px] font-sans font-medium tracking-wide uppercase hover:opacity-90 disabled:opacity-40 transition-all duration-200"
            >
              {joining ? "..." : "Go"}
            </button>
          </div>
        </form>
      </div>

      {/* About section */}
      <section
        id="about"
        className="px-6 md:px-[8vw] py-20 border-t border-border/40"
      >
        <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-muted-foreground mb-10">
          Why Recap
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-4xl">
          {/* Why */}
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Camera size={14} className="text-muted-foreground" />
            </div>
            <h3 className="text-[14px] font-sans font-medium text-foreground tracking-tight">
              Photos scatter after every event
            </h3>
            <p className="text-[13px] font-sans font-light leading-relaxed text-muted-foreground">
              Everyone takes photos, nobody shares them. Recap gives every event a single, shared album that lives in one place.
            </p>
          </div>

          {/* What */}
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Users size={14} className="text-muted-foreground" />
            </div>
            <h3 className="text-[14px] font-sans font-medium text-foreground tracking-tight">
              One link, everyone contributes
            </h3>
            <p className="text-[13px] font-sans font-light leading-relaxed text-muted-foreground">
              Create an album, share a code. Guests join instantly — no app downloads, no sign-up friction. Just drop your photos in.
            </p>
          </div>

          {/* How */}
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Download size={14} className="text-muted-foreground" />
            </div>
            <h3 className="text-[14px] font-sans font-medium text-foreground tracking-tight">
              Collect, curate, keep
            </h3>
            <p className="text-[13px] font-sans font-light leading-relaxed text-muted-foreground">
              Photos arrive in real time. Organizers can curate. Everyone downloads the full album — the complete story, not just their angle.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
