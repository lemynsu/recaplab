import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 50) + "-" + Math.random().toString(36).slice(2, 6);
}

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate("/auth"); return; }
    setLoading(true);

    try {
      const slug = generateSlug(title);
      let cover_photo_url: string | null = null;

      if (coverFile) {
        const ext = coverFile.name.split(".").pop();
        const path = `covers/${slug}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("event-photos").upload(path, coverFile);
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("event-photos").getPublicUrl(path);
          cover_photo_url = urlData.publicUrl;
        }
      }

      await supabase.from("user_roles").upsert({ user_id: user.id, role: "organizer" }, { onConflict: "user_id,role" });

      const { error } = await supabase.from("events").insert({
        title, slug, description: description || null, date: date || null,
        cover_photo_url, organizer_id: user.id, access_code: accessCode || null,
      });

      if (error) throw error;
      toast.success("Event created!");
      navigate(`/admin/${slug}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/30">
        <div className="flex items-center px-5 py-4 max-w-2xl mx-auto">
          <Link to="/dashboard" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
        </div>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 py-8 max-w-2xl mx-auto"
      >
        <h1 className="text-2xl font-display text-foreground mb-8">Create Event</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Cover photo</label>
            <label className="block cursor-pointer">
              <div className="w-full h-44 rounded-xl border border-dashed border-border/50 overflow-hidden flex items-center justify-center bg-card hover:border-border transition-colors">
                {coverPreview ? (
                  <img src={coverPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Click to upload</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Event name *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sunset Wedding 2025" required className="rounded-xl h-12 bg-card border-border/30" />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl h-12 bg-card border-border/30" />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell guests what this event is about..." className="rounded-xl min-h-[100px] bg-card border-border/30" />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Access code (optional)</label>
            <Input value={accessCode} onChange={(e) => setAccessCode(e.target.value)} placeholder="Leave blank for open access" className="rounded-xl h-12 bg-card border-border/30" />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading || !title}>
            {loading ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateEvent;
