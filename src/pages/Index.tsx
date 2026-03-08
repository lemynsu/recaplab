import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, Share2, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-image.jpg";

const steps = [
  { icon: Camera, title: "Create an event", description: "Set up your album in seconds with a title, date, and cover photo." },
  { icon: Share2, title: "Share the link", description: "Send a link or QR code — no app downloads needed." },
  { icon: Users, title: "Everyone uploads", description: "Guests contribute photos in real-time. You approve and curate." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link to="/" className="text-2xl font-display font-bold text-foreground">
          Encore
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/join">
            <Button variant="ghost" size="sm">Join Event</Button>
          </Link>
          <Link to="/auth">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-16 pb-24 md:pt-28 md:pb-32 max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight mb-6"
        >
          Relive every moment{" "}
          <span className="text-primary">together</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          The shared photo album for weddings, festivals, run clubs, and every event worth remembering.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/create">
            <Button variant="hero" size="xl">
              Create your event <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/join">
            <Button variant="soft" size="xl">
              Join an event
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Hero image */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45 }}
        className="px-6 pb-20 max-w-5xl mx-auto"
      >
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img src={heroImage} alt="Friends celebrating at a golden hour event" className="w-full h-64 md:h-96 object-cover" />
        </div>
      </motion.section>

      {/* Steps */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
              className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Encore. Made for moments that matter.</p>
      </footer>
    </div>
  );
};

export default Index;
