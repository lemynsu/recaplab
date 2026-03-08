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
    if (!user) {
      navigate("/auth");
      return;
    }
    setLoading(true);

    try {
      const slug = generateSlug(title);
      let cover_photo_url: string | null = null;

      if (coverFile) {
        const ext = coverFile.name.split(".").pop();
        const path = `covers/${slug}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("event-photos")
          .upload(path, coverFile);
        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("event-photos")
            .getPublicUrl(path);
          cover_photo_url = urlData.publicUrl;
        }
      }

      // Ensure organizer role
      await supabase.from("user_roles").upsert({
        user_id: user.id,
        role: "organizer",
      }, { onConflict: "user_id,role" });

      const { error } = await supabase.from("events").insert({
        title,
        slug,
        description: description || null,
        date: date || null,
        cover_photo_url,
        organizer_id: user.id,
        access_code: accessCode || null,
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
      <nav className="flex items-center px-6 py-4 max-w-2xl mx-auto">
        <Link to="/dashboard" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-8 max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">Create Event</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover photo */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Cover photo</label>
            <label className="block cursor-pointer">
              <div className={`w-full h-48 rounded-2xl border-2 border-dashed border-border/70 overflow-hidden flex items-center justify-center bg-muted/30 hover:border-primary/30 transition-colors ${coverPreview ? "" : ""}`}>
                {coverPreview ? (
                  <img src={coverPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Click to upload</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Event name *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sunset Wedding 2025"
              required
              className="rounded-xl h-12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl h-12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell guests what this event is about..."
              className="rounded-xl min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Access code (optional)</label>
            <Input
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Leave blank for open access"
              className="rounded-xl h-12"
            />
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading || !title}>
            {loading ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateEvent;
