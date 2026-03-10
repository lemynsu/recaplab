import { Link } from "react-router-dom";
import { Camera, Users, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const About = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center justify-between px-6 md:px-12 py-5 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4">
            <Link
              to="/"
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
            </Link>
            <span className="text-border">·</span>
            <span className="text-[13px] font-sans font-medium text-foreground">
              About
            </span>
          </div>
          <Link
            to={user ? "/dashboard" : "/auth?redirect=/dashboard"}
            className="text-[13px] font-sans font-light text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            My albums
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-[120px] px-6 md:px-[8vw] pb-24 max-w-3xl">
        <h1 className="font-display font-light text-[32px] sm:text-[44px] leading-[1.12] tracking-[-0.02em] text-foreground mb-4">
          Why Recap
        </h1>
        <p className="text-[14px] font-sans font-light leading-relaxed text-muted-foreground mb-16 max-w-lg">
          Every event generates hundreds of photos across dozens of phones. Recap brings them all into one place.
        </p>

        <div className="space-y-16">
          {/* Why */}
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Camera size={14} className="text-muted-foreground" />
            </div>
            <h3 className="text-[15px] font-sans font-medium text-foreground tracking-tight">
              Photos scatter after every event
            </h3>
            <p className="text-[13px] font-sans font-light leading-relaxed text-muted-foreground max-w-md">
              Everyone takes photos, nobody shares them. Recap gives every event a single, shared album that lives in one place.
            </p>
          </div>

          {/* What */}
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Users size={14} className="text-muted-foreground" />
            </div>
            <h3 className="text-[15px] font-sans font-medium text-foreground tracking-tight">
              One link, everyone contributes
            </h3>
            <p className="text-[13px] font-sans font-light leading-relaxed text-muted-foreground max-w-md">
              Create an album, share a code. Guests join instantly — no app downloads, no sign-up friction. Just drop your photos in.
            </p>
          </div>

          {/* How */}
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Download size={14} className="text-muted-foreground" />
            </div>
            <h3 className="text-[15px] font-sans font-medium text-foreground tracking-tight">
              Collect, curate, keep
            </h3>
            <p className="text-[13px] font-sans font-light leading-relaxed text-muted-foreground max-w-md">
              Photos arrive in real time. Organizers can curate. Everyone downloads the full album — the complete story, not just their angle.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <Link
            to="/create"
            className="inline-flex items-center h-10 px-6 rounded-full bg-primary text-primary-foreground text-[12px] font-sans font-medium tracking-wide uppercase hover:opacity-90 transition-all duration-200"
          >
            Create your first album →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
