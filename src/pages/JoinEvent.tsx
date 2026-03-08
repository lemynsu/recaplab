import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const JoinEvent = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let slug = query.trim();
    const urlMatch = slug.match(/\/e\/([^/?#]+)/);
    if (urlMatch) slug = urlMatch[1];

    const { data: bySlug } = await supabase.from("events").select("slug").eq("slug", slug).single();
    if (bySlug) { navigate(`/e/${bySlug.slug}`); return; }

    const { data: byCode } = await supabase.from("events").select("slug").eq("access_code", query.trim()).single();
    if (byCode) { navigate(`/e/${byCode.slug}`); return; }

    toast.error("Event not found. Check the link or code and try again.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-10 transition-colors uppercase tracking-widest">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>

        <h1 className="text-3xl font-display text-foreground mb-2">Join an Event</h1>
        <p className="text-sm text-muted-foreground mb-8">Paste an event link or enter an access code.</p>

        <form onSubmit={handleJoin} className="space-y-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Event link or access code"
            required
            className="rounded-xl h-12 bg-card border-border/30"
          />
          <Button type="submit" size="lg" className="w-full" disabled={loading || !query.trim()}>
            <Search className="h-4 w-4 mr-1" /> {loading ? "Searching..." : "Find Event"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default JoinEvent;
