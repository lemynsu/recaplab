import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Image as ImageIcon, Users, Upload, X, Share2, ChevronLeft, ChevronRight, RotateCcw, Plus, Minus, Check } from "lucide-react";

const EMOJIS = ["❤️", "🔥", "😂", "😭", "🙌"];

/* ─── Scatter positions (reusable pattern) ─── */
const SCATTER_POSITIONS = [
  { x: 8, y: 6, r: -4 }, { x: 28, y: 14, r: 3 }, { x: 52, y: 4, r: -2 },
  { x: 74, y: 18, r: 5 }, { x: 12, y: 38, r: -6 }, { x: 40, y: 32, r: 2 },
  { x: 64, y: 40, r: -3 }, { x: 86, y: 28, r: 4 }, { x: 6, y: 62, r: 3 },
  { x: 34, y: 58, r: -5 }, { x: 58, y: 66, r: 1 }, { x: 80, y: 56, r: -2 },
  { x: 18, y: 78, r: 4 }, { x: 46, y: 74, r: -3 }, { x: 70, y: 80, r: 2 },
  { x: 90, y: 70, r: -4 },
];

const clampZoom = (z: number) => Math.min(3, Math.max(0.3, z));

type ViewMode = "scatter" | "timeline";

interface Photo {
  id: string;
  storage_url: string;
  thumbnail_url: string | null;
  category: string | null;
  uploaded_at: string;
  uploader_id: string | null;
}

interface EventData {
  id: string;
  title: string;
  slug: string;
  date: string | null;
  status: string;
  access_code: string | null;
  description: string | null;
}

interface Reaction {
  id: string;
  photo_id: string;
  emoji: string;
  user_id: string | null;
}

/* ─── Avatar Stack ─── */
function AvatarStack({ ids, max = 3, size = 24 }: { ids: string[]; max?: number; size?: number }) {
  const shown = ids.slice(0, max);
  const extra = ids.length - max;
  return (
    <div className="flex items-center" style={{ marginLeft: size * 0.15 }}>
      {shown.map((id, i) => (
        <div
          key={id}
          className="rounded-full bg-muted border-2 border-background flex items-center justify-center text-muted-foreground"
          style={{
            width: size, height: size,
            marginLeft: i > 0 ? -(size * 0.3) : 0,
            zIndex: shown.length - i,
            fontSize: size * 0.4,
          }}
        >
          {id.charAt(0).toUpperCase()}
        </div>
      ))}
      {extra > 0 && (
        <div
          className="rounded-full bg-muted border-2 border-background flex items-center justify-center text-muted-foreground"
          style={{ width: size, height: size, marginLeft: -(size * 0.3), fontSize: size * 0.35 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─── */
const EventGallery = () => {
  const { slug } = useParams();
  const { user } = useAuth();

  const [event, setEvent] = useState<EventData | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  // View
  const [view, setView] = useState<ViewMode>("scatter");
  const [activeFilter, setActiveFilter] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);

  // Scatter
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragOffsets, setDragOffsets] = useState<Record<string, { x: number; y: number }>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });
  const dragging = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number } | null>(null);
  const didDrag = useRef(false);

  // Lightbox
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [comment, setComment] = useState("");

  // Modals
  const [shareOpen, setShareOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<{ file: File; url: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchEvent(); }, [slug]);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);

  const fetchEvent = async () => {
    const { data: eventData } = await supabase.from("events").select("*").eq("slug", slug).single();
    if (eventData) {
      setEvent(eventData);
      const { data: photoData } = await supabase
        .from("photos")
        .select("id, storage_url, thumbnail_url, category, uploaded_at, uploader_id")
        .eq("event_id", eventData.id)
        .eq("status", "approved")
        .order("uploaded_at", { ascending: false });
      if (photoData) {
        setPhotos(photoData);
        const cats = [...new Set(photoData.map((p) => p.category).filter(Boolean))] as string[];
        setCategories(cats);
      }
      const { data: reactionData } = await supabase
        .from("reactions")
        .select("id, photo_id, emoji, user_id");
      if (reactionData) setReactions(reactionData);
    }
    setLoading(false);
  };

  const filteredPhotos = activeFilter === "All" ? photos : photos.filter((p) => p.category === activeFilter);

  // ── Reactions ──
  const getPhotoReactions = (photoId: string) => reactions.filter((r) => r.photo_id === photoId);
  const getReactionCounts = (photoId: string) => {
    const pr = getPhotoReactions(photoId);
    const counts: Record<string, string[]> = {};
    pr.forEach((r) => {
      if (!counts[r.emoji]) counts[r.emoji] = [];
      if (r.user_id) counts[r.emoji].push(r.user_id);
    });
    return counts;
  };
  const totalReactionCount = (photoId: string) => getPhotoReactions(photoId).length;

  const toggleReaction = async (photoId: string, emoji: string) => {
    if (!user) { toast.info("Sign in to react"); return; }
    const existing = reactions.find((r) => r.photo_id === photoId && r.emoji === emoji && r.user_id === user.id);
    if (existing) {
      await supabase.from("reactions").delete().eq("id", existing.id);
      setReactions((prev) => prev.filter((r) => r.id !== existing.id));
    } else {
      const { data } = await supabase.from("reactions").insert({ photo_id: photoId, user_id: user.id, emoji }).select().single();
      if (data) setReactions((prev) => [...prev, data]);
    }
  };

  // ── Zoom / Pan ──
  const handleWheel = useCallback((e: WheelEvent) => {
    if (view !== "scatter") return;
    e.preventDefault();
    setZoom((z) => clampZoom(z - e.deltaY * 0.001));
  }, [view]);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const onCanvasDown = (e: React.MouseEvent) => {
    if (e.target !== canvasRef.current) return;
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY };
    panOrigin.current = { ...pan };
  };
  const onCanvasMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return;
    setPan({ x: panOrigin.current.x + e.clientX - panStart.current.x, y: panOrigin.current.y + e.clientY - panStart.current.y });
  };
  const onCanvasUp = () => { isPanning.current = false; };

  // ── Image drag ──
  const onImgDown = (e: React.MouseEvent, photo: Photo) => {
    e.stopPropagation(); didDrag.current = false;
    const cur = dragOffsets[photo.id] || { x: 0, y: 0 };
    dragging.current = { id: photo.id, sx: e.clientX, sy: e.clientY, ox: cur.x, oy: cur.y };
    const move = (me: MouseEvent) => {
      const dx = me.clientX - dragging.current!.sx, dy = me.clientY - dragging.current!.sy;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag.current = true;
      setDragOffsets((p) => ({ ...p, [photo.id]: { x: dragging.current!.ox + dx / zoom, y: dragging.current!.oy + dy / zoom } }));
    };
    const up = () => { dragging.current = null; window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const handleClick = (photo: Photo) => {
    if (didDrag.current) return;
    setSelectedPhoto(photo);
  };

  const resetCanvas = () => { setZoom(1); setPan({ x: 0, y: 0 }); setDragOffsets({}); };

  // ── Upload ──
  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const previews = files.map((f) => ({ file: f, url: URL.createObjectURL(f), name: f.name }));
    setUploadFiles((prev) => [...prev, ...previews]);
  };

  const handleDropZone = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith("image/"));
    const previews = files.map((f) => ({ file: f, url: URL.createObjectURL(f), name: f.name }));
    setUploadFiles((prev) => [...prev, ...previews]);
  };

  const removeUploadFile = (idx: number) => setUploadFiles((prev) => prev.filter((_, i) => i !== idx));

  const doUpload = async () => {
    if (!event || !uploadFiles.length) return;
    setUploading(true);
    for (const uf of uploadFiles) {
      try {
        const compressed = await imageCompression(uf.file, { maxWidthOrHeight: 1200, initialQuality: 0.8, useWebWorker: true });
        const ext = uf.name.split(".").pop() || "jpg";
        const path = `${event.id}/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("event-photos").upload(path, compressed);
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("event-photos").getPublicUrl(path);
          await supabase.from("photos").insert({ event_id: event.id, uploader_id: user?.id || null, storage_url: urlData.publicUrl, status: "pending" });
        }
      } catch { /* skip */ }
    }
    setUploading(false);
    setUploadDone(true);
    toast.success(`${uploadFiles.length} photo${uploadFiles.length > 1 ? "s" : ""} uploaded! Pending approval.`);
    setTimeout(() => { setUploadOpen(false); setUploadFiles([]); setUploadDone(false); fetchEvent(); }, 1800);
  };

  // ── Lightbox nav ──
  const lightboxNext = () => {
    if (!selectedPhoto) return;
    const idx = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    setSelectedPhoto(filteredPhotos[(idx + 1) % filteredPhotos.length]);
  };
  const lightboxPrev = () => {
    if (!selectedPhoto) return;
    const idx = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    setSelectedPhoto(filteredPhotos[(idx - 1 + filteredPhotos.length) % filteredPhotos.length]);
  };

  const downloadPhoto = (url: string) => {
    const a = document.createElement("a");
    a.href = url; a.download = "recap-photo.jpg"; a.target = "_blank"; a.click();
  };

  const albumUrl = typeof window !== "undefined" ? `${window.location.origin}/e/${slug}` : "";

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
    <div className="min-h-screen bg-background text-foreground overflow-hidden">

      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 md:px-10 h-14 bg-background/92 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-5">
          <Link to="/" className="text-[13px] font-sans font-black uppercase tracking-[0.26em] text-foreground select-none">
            RECAP
          </Link>
          <div className="w-px h-5 bg-border" />
          <span className="text-[12px] font-sans font-normal tracking-wide text-secondary-foreground">
            {event.title}
            {event.date && <> · {new Date(event.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</>}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-sans font-light text-muted-foreground mr-2">{photos.length} photos</span>
          <button
            onClick={() => setShareOpen(true)}
            className="px-3 py-1.5 text-[11px] font-sans font-normal uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-all"
          >
            Share ↗
          </button>
          <button
            onClick={() => { setUploadOpen(true); setUploadFiles([]); setUploadDone(false); }}
            className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-sans font-normal uppercase tracking-widest hover:opacity-90 transition-all"
          >
            + Upload
          </button>
        </div>
      </nav>

      {/* ═══ FILTER BAR ═══ */}
      <div className="fixed top-14 left-0 right-0 z-[99] bg-background/90 backdrop-blur-lg border-b border-border/60">
        <div className="flex items-center gap-1.5 px-5 md:px-10 py-2">
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest mr-1 flex-shrink-0">Filter</span>
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1 text-[11px] font-sans uppercase tracking-widest rounded-full border transition-all whitespace-nowrap ${
                activeFilter === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-transparent hover:border-border hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ MAIN ═══ */}
      <main className="pt-[104px] min-h-screen">
        {/* ── SCATTER VIEW ── */}
        {view === "scatter" && (
          <>
            {/* Zoom controls */}
            <div className="fixed right-5 bottom-[68px] z-[110] flex flex-col gap-1.5">
              <button onClick={() => setZoom((z) => clampZoom(z + 0.2))} className="w-8 h-8 rounded bg-card/90 border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Plus size={14} />
              </button>
              <button onClick={() => setZoom((z) => clampZoom(z - 0.2))} className="w-8 h-8 rounded bg-card/90 border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Minus size={14} />
              </button>
              <button onClick={resetCanvas} className="w-8 h-8 rounded bg-card/90 border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <RotateCcw size={12} />
              </button>
            </div>
            <div className="fixed right-14 bottom-20 z-[110] text-[10px] text-muted-foreground uppercase tracking-wider" style={{ writingMode: "vertical-rl" }}>
              {Math.round(zoom * 100)}%
            </div>

            <div
              ref={canvasRef}
              onMouseDown={onCanvasDown}
              onMouseMove={onCanvasMove}
              onMouseUp={onCanvasUp}
              onMouseLeave={onCanvasUp}
              className="relative cursor-grab active:cursor-grabbing"
              style={{ height: "calc(100vh - 104px)", overflow: "hidden" }}
            >
              <div
                className="absolute inset-0"
                style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px,${pan.y / zoom}px)`, transformOrigin: "center center" }}
              >
                {filteredPhotos.map((photo, i) => {
                  const pos = SCATTER_POSITIONS[i % SCATTER_POSITIONS.length];
                  const isActive = hoveredId === photo.id;
                  const offset = dragOffsets[photo.id] || { x: 0, y: 0 };
                  const rCount = totalReactionCount(photo.id);
                  const topEmoji = Object.entries(getReactionCounts(photo.id)).sort((a, b) => b[1].length - a[1].length)[0]?.[0];
                  return (
                    <div
                      key={photo.id}
                      className="absolute select-none"
                      style={{
                        left: `${pos.x}%`, top: `${pos.y}%`,
                        width: isActive && dragging.current?.id !== photo.id ? 210 : 100,
                        transform: `translate(${offset.x}px,${offset.y}px) rotate(${isActive && dragging.current?.id !== photo.id ? 0 : pos.r}deg)${isActive && dragging.current?.id !== photo.id ? " translateY(-10px)" : ""}`,
                        zIndex: isActive ? 50 : i + 1,
                        transition: dragging.current?.id === photo.id ? "none" : "width 0.45s cubic-bezier(0.16,1,0.3,1),transform 0.45s cubic-bezier(0.16,1,0.3,1)",
                        cursor: "grab",
                        animation: loaded ? `fadeIn 0.5s ease ${i * 60}ms both` : "none",
                      }}
                      onMouseDown={(e) => onImgDown(e, photo)}
                      onMouseEnter={() => setHoveredId(photo.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => handleClick(photo)}
                    >
                      <img
                        src={photo.storage_url}
                        alt=""
                        className="w-full block pointer-events-none"
                        style={{
                          aspectRatio: "1/1", objectFit: "cover",
                          boxShadow: isActive ? "0 20px 50px rgba(0,0,0,0.22)" : "0 2px 10px rgba(0,0,0,0.10)",
                        }}
                        draggable={false}
                      />
                      {/* Activity badge */}
                      {rCount > 0 && !isActive && topEmoji && (
                        <div className="absolute bottom-1 left-1">
                          <span className="text-[9px] bg-card/90 rounded-lg px-1 py-0.5">{topEmoji}{rCount}</span>
                        </div>
                      )}
                      {/* Hover caption */}
                      {isActive && (
                        <div className="mt-2">
                          <span className="text-[10px] text-secondary-foreground">
                            {photo.category || "Photo"}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="fixed bottom-14 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/50 uppercase tracking-widest pointer-events-none">
              scroll to zoom · drag · click to open
            </div>
          </>
        )}

        {/* ── TIMELINE VIEW ── */}
        {view === "timeline" && (
          <div className="py-10 pb-32">
            {filteredPhotos.length === 0 ? (
              <div className="text-center py-24">
                <ImageIcon className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No photos yet.</p>
              </div>
            ) : (
              <div className="px-3 md:px-10">
                <div className="columns-2 md:columns-3 lg:columns-4 gap-2 space-y-2">
                  {filteredPhotos.map((photo, i) => {
                    const rCount = totalReactionCount(photo.id);
                    const topEmoji = Object.entries(getReactionCounts(photo.id)).sort((a, b) => b[1].length - a[1].length)[0]?.[0];
                    return (
                      <motion.div
                        key={photo.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="break-inside-avoid cursor-pointer group relative"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <div className="overflow-hidden rounded">
                          <img
                            src={photo.storage_url}
                            alt=""
                            loading="lazy"
                            className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                            <span className="text-[11px] text-white/90 font-sans">{photo.category || "Photo"}</span>
                          </div>
                        </div>
                        {rCount > 0 && topEmoji && (
                          <div className="flex items-center gap-1 mt-1.5 pl-0.5">
                            <span className="text-[11px] bg-accent rounded-xl px-2 py-0.5 flex items-center gap-1">
                              <span>{topEmoji}</span>
                              <span className="text-[10px] text-secondary-foreground font-medium">{rCount}</span>
                            </span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ═══ BOTTOM BAR ═══ */}
      <div className="fixed bottom-0 left-0 right-0 z-[99] px-5 md:px-10 py-2.5 bg-background/92 backdrop-blur-lg border-t border-border flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground tracking-wide">
          {filteredPhotos.length} of {photos.length} photos
          {activeFilter !== "All" && ` · ${activeFilter}`}
        </span>
        <div className="flex items-center bg-accent rounded-full p-0.5">
          {(["scatter", "timeline"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1 rounded-full text-[11px] font-sans uppercase tracking-widest transition-all ${
                view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {v === "scatter" ? "Scatter" : "Grid"}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ LIGHTBOX ═══ */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: "rgba(10,10,8,0.96)", backdropFilter: "blur(12px)" }}
            onClick={(e) => e.target === e.currentTarget && setSelectedPhoto(null)}
          >
            <div className="w-[min(480px,92vw)] max-h-[94vh] flex flex-col">
              <img
                src={selectedPhoto.storage_url}
                alt=""
                className="w-full max-h-[54vh] object-cover block flex-shrink-0"
              />

              {/* Caption area */}
              <div className="flex justify-between items-center py-3 flex-shrink-0">
                <div>
                  <div className="text-[14px] font-sans text-white/95 tracking-wide">{selectedPhoto.category || "Photo"}</div>
                  <div className="text-[10px] font-sans text-white/30 mt-0.5">
                    {new Date(selectedPhoto.uploaded_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
                <button
                  onClick={() => downloadPhoto(selectedPhoto.storage_url)}
                  className="text-[10px] font-sans uppercase tracking-widest text-white/30 hover:text-white/75 transition-colors"
                >
                  ↓ Save
                </button>
              </div>

              {/* Reactions */}
              <div className="py-2.5 border-t border-white/[0.07] flex-shrink-0">
                {Object.entries(getReactionCounts(selectedPhoto.id)).filter(([, v]) => v.length > 0).length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mb-2">
                    {Object.entries(getReactionCounts(selectedPhoto.id)).filter(([, v]) => v.length > 0).map(([emoji, uids]) => (
                      <button
                        key={emoji}
                        onClick={() => toggleReaction(selectedPhoto.id, emoji)}
                        className={`text-[12px] rounded-full px-2.5 py-1 border transition-all flex items-center gap-1.5 ${
                          uids.includes(user?.id || "") ? "bg-white/15 border-white/40" : "bg-white/5 border-white/10"
                        }`}
                      >
                        <span>{emoji}</span>
                        <span className="text-[10px] text-white/60">{uids.length}</span>
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-1">
                  {EMOJIS.map((emoji) => {
                    const reacted = getPhotoReactions(selectedPhoto.id).some((r) => r.emoji === emoji && r.user_id === user?.id);
                    return (
                      <button
                        key={emoji}
                        onClick={() => toggleReaction(selectedPhoto.id, emoji)}
                        className={`text-[14px] rounded-full px-2.5 py-1 border transition-all hover:scale-110 ${
                          reacted ? "bg-white/15 border-white/40" : "border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {emoji}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prev / Next */}
              <div className="flex justify-between pt-3 flex-shrink-0">
                <button
                  onClick={lightboxPrev}
                  className="text-[11px] font-sans uppercase tracking-widest text-white/28 hover:text-white/85 transition-colors bg-transparent border-none cursor-pointer"
                >
                  ← Prev
                </button>
                <button
                  onClick={lightboxNext}
                  className="text-[11px] font-sans uppercase tracking-widest text-white/28 hover:text-white/85 transition-colors bg-transparent border-none cursor-pointer"
                >
                  Next →
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-5 right-6 text-[11px] uppercase tracking-widest text-white/40 hover:text-white/90 border border-white/12 hover:bg-white/[0.07] px-3 py-1.5 rounded transition-all"
            >
              Close ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ UPLOAD MODAL ═══ */}
      <AnimatePresence>
        {uploadOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center"
            onClick={(e) => e.target === e.currentTarget && setUploadOpen(false)}
          >
            <div className="absolute inset-0 bg-foreground/45 backdrop-blur-sm" onClick={() => setUploadOpen(false)} />
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFilePick} />

            <div className="relative w-[480px] max-w-[95vw] bg-background rounded border border-border shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="px-7 py-5 border-b border-border flex items-start justify-between">
                <div>
                  <div className="text-[18px] font-sans font-normal text-foreground tracking-wide">Upload photos</div>
                  <div className="text-[11px] font-sans text-muted-foreground mt-1">{event.title}</div>
                </div>
                <button onClick={() => setUploadOpen(false)} className="text-muted-foreground/60 hover:text-foreground transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="px-7 py-5">
                {uploadDone ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-3">
                      <Check size={20} className="text-primary-foreground" />
                    </div>
                    <div className="text-[15px] font-sans text-foreground">{uploadFiles.length} photo{uploadFiles.length !== 1 ? "s" : ""} shared</div>
                    <div className="text-[11px] font-sans text-muted-foreground mt-1">Pending approval</div>
                  </div>
                ) : (
                  <>
                    {/* Drop zone */}
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDropZone}
                      onClick={() => fileInputRef.current?.click()}
                      className="border border-dashed border-border rounded p-9 flex flex-col items-center gap-3 cursor-pointer hover:border-muted-foreground/50 transition-all mb-4 bg-card"
                    >
                      <Upload size={24} className="text-muted-foreground/50" />
                      <div className="text-center">
                        <div className="text-[13px] font-sans text-foreground">Tap to select photos</div>
                        <div className="text-[11px] font-sans text-muted-foreground mt-1">or drag here · JPG, PNG, HEIC</div>
                      </div>
                    </div>

                    {/* Preview grid */}
                    {uploadFiles.length > 0 && (
                      <div className="mb-4">
                        <div className="text-[10px] font-sans uppercase tracking-widest text-muted-foreground mb-2">{uploadFiles.length} selected</div>
                        <div className="grid grid-cols-5 gap-1 max-h-[150px] overflow-y-auto">
                          {uploadFiles.map((f, i) => (
                            <div key={i} className="relative aspect-square overflow-hidden rounded-sm">
                              <img src={f.url} alt="" className="w-full h-full object-cover block" />
                              <button
                                onClick={(e) => { e.stopPropagation(); removeUploadFile(i); }}
                                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-foreground/70 text-background flex items-center justify-center"
                              >
                                <X size={8} />
                              </button>
                            </div>
                          ))}
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square bg-muted rounded-sm flex items-center justify-center cursor-pointer hover:bg-accent transition-colors text-muted-foreground text-lg"
                          >
                            +
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action row */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] font-sans text-muted-foreground/60">
                        {uploadFiles.length === 0 ? "No photos selected" : `${uploadFiles.length} photo${uploadFiles.length !== 1 ? "s" : ""} ready`}
                      </span>
                      <button
                        onClick={doUpload}
                        disabled={!uploadFiles.length || uploading}
                        className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-[11px] font-sans uppercase tracking-widest disabled:opacity-40 hover:opacity-90 transition-all flex items-center gap-2"
                      >
                        {uploading ? (
                          <>
                            <span className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin inline-block" />
                            Uploading…
                          </>
                        ) : (
                          "Share to album"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ SHARE MODAL ═══ */}
      <AnimatePresence>
        {shareOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center"
            onClick={(e) => e.target === e.currentTarget && setShareOpen(false)}
          >
            <div className="absolute inset-0 bg-foreground/45 backdrop-blur-sm" onClick={() => setShareOpen(false)} />
            <div className="relative w-[440px] max-w-[94vw] bg-background rounded border border-border shadow-2xl overflow-hidden">
              <div className="px-8 py-6 border-b border-border flex items-start justify-between">
                <div>
                  <h2 className="text-[22px] font-display font-light text-foreground">Share album</h2>
                  <p className="text-[12px] font-sans text-muted-foreground mt-1">{event.title}</p>
                </div>
                <button onClick={() => setShareOpen(false)} className="text-muted-foreground/60 hover:text-foreground transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="px-8 py-6 space-y-6">
                {/* Access code */}
                {event.access_code && (
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Access code</div>
                    <p className="text-[12px] text-muted-foreground mb-3 leading-relaxed">
                      Share this code with anyone you want to join the album.
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded px-4 py-3 flex items-center justify-between">
                        <span className="text-[22px] font-sans font-medium tracking-[0.18em] text-foreground">{event.access_code}</span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(event.access_code || "");
                          setCodeCopied(true);
                          setTimeout(() => setCodeCopied(false), 2000);
                        }}
                        className={`px-4 py-3 text-[11px] font-sans uppercase tracking-widest border rounded transition-all ${
                          codeCopied
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-transparent text-foreground border-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
                        }`}
                      >
                        {codeCopied ? "Copied ✓" : "Copy code"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Copy link */}
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Share link</div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(albumUrl);
                      setLinkCopied(true);
                      setTimeout(() => setLinkCopied(false), 2000);
                    }}
                    className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                      linkCopied ? "bg-primary border-primary" : "bg-muted border-border hover:bg-accent"
                    }`}
                  >
                    {linkCopied ? (
                      <Check size={16} className="text-primary-foreground" />
                    ) : (
                      <Share2 size={16} className="text-secondary-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default EventGallery;
