import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Plus, Calendar, Image, LogOut, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface Event {
  id: string;
  title: string;
  slug: string;
  date: string | null;
  cover_photo_url: string | null;
  status: string;
  photo_count?: number;
}

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user) fetchEvents();
  }, [user, authLoading]);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("organizer_id", user!.id)
      .order("created_at", { ascending: false });

    if (data) {
      const eventsWithCounts = await Promise.all(
        data.map(async (event) => {
          const { count } = await supabase
            .from("photos")
            .select("*", { count: "exact", head: true })
            .eq("event_id", event.id);
          return { ...event, photo_count: count || 0 };
        })
      );
      setEvents(eventsWithCounts);
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background px-5 py-8 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-8 rounded-lg bg-card" />
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-xl bg-card" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/30">
        <div className="flex items-center justify-between px-5 py-4 max-w-4xl mx-auto">
          <Link to="/" className="text-xl font-display text-foreground">Encore</Link>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }} className="text-muted-foreground text-xs">
            <LogOut className="h-3.5 w-3.5 mr-1" /> Sign out
          </Button>
        </div>
      </nav>

      <div className="px-5 py-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Dashboard</p>
            <h1 className="text-2xl font-display text-foreground">Your Events</h1>
          </div>
          <Link to="/create">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> New Event
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-3">
            {[1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-xl bg-card" />)}
          </div>
        ) : events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-14 h-14 rounded-xl bg-card border border-border/30 flex items-center justify-center mx-auto mb-5">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-display text-foreground mb-2">No events yet</h2>
            <p className="text-sm text-muted-foreground mb-6">Create your first event to start collecting photos.</p>
            <Link to="/create">
              <Button>Create your first event</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-3">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/admin/${event.slug}`}
                  className="flex items-center gap-4 bg-card rounded-xl border border-border/30 p-4 hover:border-border/60 transition-all group"
                >
                  <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                    {event.cover_photo_url ? (
                      <img src={event.cover_photo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="h-5 w-5 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {event.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {event.date ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No date set"}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-muted-foreground">{event.photo_count} photos</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${event.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
