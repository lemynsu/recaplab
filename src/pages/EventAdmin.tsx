import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Check, X, Copy, Link as LinkIcon, ToggleLeft, ToggleRight, Image } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface Photo {
  id: string;
  storage_url: string;
  status: string;
  uploaded_at: string;
}

interface EventData {
  id: string;
  title: string;
  slug: string;
  date: string | null;
  status: string;
  organizer_id: string;
}

const EventAdmin = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventData | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });

  const eventUrl = `${window.location.origin}/e/${slug}`;

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    const { data: eventData } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .single();

    if (eventData) {
      setEvent(eventData);
      const { data: photoData } = await supabase
        .from("photos")
        .select("*")
        .eq("event_id", eventData.id)
        .order("uploaded_at", { ascending: false });

      if (photoData) {
        setPhotos(photoData);
        setStats({
          total: photoData.length,
          approved: photoData.filter((p) => p.status === "approved").length,
          pending: photoData.filter((p) => p.status === "pending").length,
        });
      }
    }
    setLoading(false);
  };

  const updatePhotoStatus = async (photoId: string, status: string) => {
    await supabase.from("photos").update({ status }).eq("id", photoId);
    setPhotos((prev) => prev.map((p) => (p.id === photoId ? { ...p, status } : p)));
    setStats((prev) => ({
      ...prev,
      approved: status === "approved" ? prev.approved + 1 : prev.approved - (status === "rejected" ? 0 : 0),
      pending: prev.pending - 1,
    }));
    toast.success(`Photo ${status}`);
  };

  const bulkApprove = async () => {
    const pendingIds = photos.filter((p) => p.status === "pending").map((p) => p.id);
    if (pendingIds.length === 0) return;
    await supabase.from("photos").update({ status: "approved" }).in("id", pendingIds);
    setPhotos((prev) => prev.map((p) => (pendingIds.includes(p.id) ? { ...p, status: "approved" } : p)));
    setStats((prev) => ({ ...prev, approved: prev.approved + prev.pending, pending: 0 }));
    toast.success(`Approved ${pendingIds.length} photos`);
  };

  const toggleEventStatus = async () => {
    if (!event) return;
    const newStatus = event.status === "active" ? "closed" : "active";
    await supabase.from("events").update({ status: newStatus }).eq("id", event.id);
    setEvent((prev) => prev ? { ...prev, status: newStatus } : null);
    toast.success(`Event ${newStatus}`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    toast.success("Link copied!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-6 py-8 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-6 rounded-xl" />
        <Skeleton className="h-24 rounded-2xl mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!event) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Event not found</div>;

  const pendingPhotos = photos.filter((p) => p.status === "pending");
  const approvedPhotos = photos.filter((p) => p.status === "approved");

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center px-6 py-4 max-w-4xl mx-auto border-b border-border/50">
        <Link to="/dashboard" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
      </nav>

      <div className="px-6 py-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">{event.title}</h1>
            <p className="text-muted-foreground mt-1">
              {event.date ? new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "No date"}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={toggleEventStatus}>
            {event.status === "active" ? (
              <><ToggleRight className="h-4 w-4 mr-1" /> Close Event</>
            ) : (
              <><ToggleLeft className="h-4 w-4 mr-1" /> Reopen Event</>
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Total", value: stats.total },
            { label: "Approved", value: stats.approved },
            { label: "Pending", value: stats.pending },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-2xl border border-border/50 p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Share section */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
          <QRCodeSVG value={eventUrl} size={120} bgColor="transparent" fgColor="hsl(0 0% 10%)" />
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-semibold text-foreground mb-1">Share this event</h3>
            <p className="text-sm text-muted-foreground mb-3">{eventUrl}</p>
            <div className="flex gap-2 justify-center md:justify-start">
              <Button variant="outline" size="sm" onClick={copyLink}>
                <Copy className="h-4 w-4 mr-1" /> Copy link
              </Button>
              <Link to={`/e/${slug}`}>
                <Button variant="ghost" size="sm">
                  <LinkIcon className="h-4 w-4 mr-1" /> View gallery
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Pending photos */}
        {pendingPhotos.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold text-foreground">Pending Approval ({pendingPhotos.length})</h2>
              <Button variant="default" size="sm" onClick={bulkApprove}>
                <Check className="h-4 w-4 mr-1" /> Approve All
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {pendingPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group rounded-2xl overflow-hidden bg-muted aspect-square"
                >
                  <img src={photo.storage_url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="default" className="rounded-xl" onClick={() => updatePhotoStatus(photo.id, "approved")}>
                      <Check className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="destructive" className="rounded-xl" onClick={() => updatePhotoStatus(photo.id, "rejected")}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Approved photos */}
        <div>
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">Approved Photos ({approvedPhotos.length})</h2>
          {approvedPhotos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Image className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No approved photos yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {approvedPhotos.map((photo) => (
                <div key={photo.id} className="rounded-2xl overflow-hidden bg-muted aspect-square">
                  <img src={photo.storage_url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventAdmin;
