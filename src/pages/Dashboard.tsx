import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Plus, Calendar, Image, LogOut } from "lucide-react";
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
      // Get photo counts
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
      <div className="min-h-screen bg-background px-6 py-8 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-48 mb-8 rounded-xl" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto border-b border-border/50">
        <Link to="/" className="text-2xl font-display font-bold text-foreground">Encore</Link>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
            <LogOut className="h-4 w-4 mr-1" /> Sign out
          </Button>
        </div>
      </nav>

      <div className="px-6 py-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Your Events</h1>
          <Link to="/create">
            <Button variant="hero" size="default">
              <Plus className="h-4 w-4 mr-1" /> New Event
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[1, 2].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
        ) : events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-display font-semibold text-foreground mb-2">No events yet</h2>
            <p className="text-muted-foreground mb-6">Create your first event to start collecting photos.</p>
            <Link to="/create">
              <Button variant="hero">Create your first event</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/admin/${event.slug}`}
                  className="flex items-center gap-5 bg-card rounded-2xl border border-border/50 p-5 hover:shadow-md transition-shadow group"
                >
                  <div className="w-20 h-20 rounded-xl bg-muted flex-shrink-0 overflow-hidden">
                    {event.cover_photo_url ? (
                      <img src={event.cover_photo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.date ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No date set"}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground">{event.photo_count} photos</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${event.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
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
