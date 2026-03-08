import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import imageCompression from "browser-image-compression";
import { Upload, X, Download, Image as ImageIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";

const EMOJIS = ["❤️", "🔥", "😂", "😭", "🙌"];

interface Photo {
  id: string;
  storage_url: string;
  category: string | null;
}

interface EventData {
  id: string;
  title: string;
  slug: string;
  date: string | null;
  status: string;
}

const EventGallery = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventData | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [uploadSheetOpen, setUploadSheetOpen] = useState(false);

  useEffect(() => { fetchEvent(); }, [slug]);

  const fetchEvent = async () => {
    const { data: eventData } = await supabase.from("events").select("*").eq("slug", slug).single();
    if (eventData) {
      setEvent(eventData);
      const { data: photoData } = await supabase.from("photos").select("id, storage_url, category").eq("event_id", eventData.id).eq("status", "approved").order("uploaded_at", { ascending: false });
      if (photoData) {
        setPhotos(photoData);
        const cats = [...new Set(photoData.map((p) => p.category).filter(Boolean))] as string[];
        setCategories(cats);
      }
    }
    setLoading(false);
  };

  const handleUpload = async (files: FileList) => {
    if (!event) return;
    setUploading(true);
    setUploadProgress(0);
    const total = files.length;
    let completed = 0;

    for (const file of Array.from(files)) {
      try {
        const compressed = await imageCompression(file, { maxWidthOrHeight: 1200, initialQuality: 0.8, useWebWorker: true });
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${event.id}/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("event-photos").upload(path, compressed);
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("event-photos").getPublicUrl(path);
          await supabase.from("photos").insert({ event_id: event.id, uploader_id: user?.id || null, storage_url: urlData.publicUrl, status: "pending" });
        }
      } catch { /* skip */ }
      completed++;
      setUploadProgress((completed / total) * 100);
    }

    setUploading(false);
    setUploadSheetOpen(false);
    toast.success(`${total} photo${total > 1 ? "s" : ""} uploaded! Pending approval.`);
    if (!user) setShowAuthPrompt(true);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) handleUpload(e.dataTransfer.files);
  }, [event, user]);

  const addReaction = async (photoId: string, emoji: string) => {
    if (!user) { toast.info("Sign in to react"); return; }
    await supabase.from("reactions").upsert({ photo_id: photoId, user_id: user.id, emoji }, { onConflict: "photo_id,user_id,emoji" });
    toast.success("Reaction added!");
  };

  const downloadPhoto = (url: string) => {
    const a = document.createElement("a");
    a.href = url; a.download = "encore-photo.jpg"; a.target = "_blank"; a.click();
  };

  const filteredPhotos = activeFilter === "All" ? photos : photos.filter((p) => p.category === activeFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-4 py-6 max-w-5xl mx-auto">
        <Skeleton className="h-6 w-40 mb-6 rounded-lg bg-card" />
        <div className="columns-2 md:columns-3 gap-2 space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="rounded-lg bg-card" style={{ height: `${140 + (i % 3) * 50}px` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display text-foreground mb-2">Event not found</h1>
          <p className="text-sm text-muted-foreground">This event doesn't exist or the link is invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-background/60 backdrop-blur-2xl border-b border-border/30 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-display text-foreground">{event.title}</h1>
            <p className="text-[11px] text-muted-foreground">
              {event.date ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""} · {photos.length} photos
            </p>
          </div>
          <Sheet open={uploadSheetOpen} onOpenChange={setUploadSheetOpen}>
            <SheetTrigger asChild>
              <Button size="sm" disabled={event.status === "closed"} className="h-8 text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" /> Upload
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl bg-card border-border/30">
              <SheetHeader>
                <SheetTitle className="font-display text-foreground">Upload Photos</SheetTitle>
              </SheetHeader>
              <div
                className="mt-4 border border-dashed border-border/50 rounded-xl p-10 text-center hover:border-primary/30 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {uploading ? (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">Uploading...</p>
                    <Progress value={uploadProgress} className="h-1 rounded-full" />
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-xs text-muted-foreground mb-3">Drag photos here or tap to select</p>
                    <label className="cursor-pointer">
                      <Button variant="default" size="sm" asChild><span>Choose Photos</span></Button>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleUpload(e.target.files)} />
                    </label>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Filter pills */}
      {categories.length > 0 && (
        <div className="px-4 py-3 max-w-5xl mx-auto overflow-x-auto">
          <div className="flex gap-1.5">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                  activeFilter === cat
                    ? "bg-foreground text-background"
                    : "bg-card text-muted-foreground border border-border/30 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Masonry grid */}
      <div className="px-3 py-3 max-w-5xl mx-auto">
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-24">
            <ImageIcon className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No photos yet. Be the first to upload!</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-2 space-y-2">
            {filteredPhotos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="break-inside-avoid cursor-pointer group"
                onClick={() => setLightboxIndex(i)}
              >
                <div className="rounded-lg overflow-hidden bg-card">
                  <img
                    src={photo.storage_url}
                    alt=""
                    loading="lazy"
                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxIndex !== null} onOpenChange={() => setLightboxIndex(null)}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-background border-border/20 rounded-xl overflow-hidden flex flex-col">
          {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
            <>
              <div className="flex-1 flex items-center justify-center relative bg-background">
                <img src={filteredPhotos[lightboxIndex].storage_url} alt="" className="max-w-full max-h-full object-contain" />
                {lightboxIndex > 0 && (
                  <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 flex items-center justify-center text-foreground hover:bg-card transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                )}
                {lightboxIndex < filteredPhotos.length - 1 && (
                  <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 flex items-center justify-center text-foreground hover:bg-card transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="p-3 flex items-center justify-between border-t border-border/20">
                <div className="flex gap-1.5">
                  {EMOJIS.map((emoji) => (
                    <button key={emoji} onClick={() => addReaction(filteredPhotos[lightboxIndex].id, emoji)} className="text-lg hover:scale-110 transition-transform p-1">
                      {emoji}
                    </button>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground text-xs" onClick={() => downloadPhoto(filteredPhotos[lightboxIndex].storage_url)}>
                  <Download className="h-3.5 w-3.5 mr-1" /> Download
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Auth prompt */}
      <Dialog open={showAuthPrompt} onOpenChange={setShowAuthPrompt}>
        <DialogContent className="rounded-xl max-w-sm bg-card border-border/30">
          <div className="text-center py-4">
            <h2 className="text-lg font-display text-foreground mb-2">Save your photos</h2>
            <p className="text-xs text-muted-foreground mb-6">
              Create a free account to track your uploads and get notified when photos are approved.
            </p>
            <div className="space-y-2">
              <Button className="w-full" onClick={() => window.location.href = "/auth"}>Create free account</Button>
              <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => setShowAuthPrompt(false)}>Maybe later</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventGallery;
