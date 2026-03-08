import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, Share2, Users, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-image.jpg";
import galleryPreview from "@/assets/gallery-preview.jpg";

const steps = [
  {
    icon: Camera,
    number: "01",
    title: "Create an event",
    description: "Set up your album in seconds — title, date, cover photo. Done.",
  },
  {
    icon: Share2,
    number: "02",
    title: "Share the link",
    description: "Send a link or QR code. No app downloads. No friction.",
  },
  {
    icon: Users,
    number: "03",
    title: "Everyone uploads",
    description: "Guests contribute photos in real-time. You approve and curate.",
  },
];

const useCases = [
  "Weddings", "Festivals", "Run Clubs", "Graduations", "Conferences", "Parties",
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/30">
        <div className="flex items-center justify-between px-5 py-4 max-w-6xl mx-auto">
          <Link to="/" className="text-xl font-display text-foreground tracking-tight">
            Encore
          </Link>
          <div className="flex items-center gap-1">
            <Link to="/join">
              <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">
                Join
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-muted-foreground text-xs border border-border/50">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-5 pt-28 pb-16 md:pt-40 md:pb-24 max-w-5xl mx-auto">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6"
          >
            Shared photo albums
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[2.5rem] sm:text-6xl md:text-7xl lg:text-8xl font-display text-foreground leading-[0.95] tracking-tight mb-8"
          >
            Every event deserves
            <br />
            <span className="text-primary italic">a better album.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed mb-10"
          >
            Collect every guest's photos into one beautiful, curated gallery. No app downloads required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link to="/create">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                Create your event <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/join">
              <Button variant="soft" size="xl" className="w-full sm:w-auto">
                Join an event
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Hero image — full bleed */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="px-5 pb-20 md:pb-32 max-w-6xl mx-auto"
      >
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[2.2/1]">
          <img
            src={heroImage}
            alt="Friends celebrating at a golden hour event"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
          <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8">
            <p className="text-xs text-foreground/60 uppercase tracking-widest">247 photos · 12 contributors</p>
          </div>
        </div>
      </motion.section>

      {/* Use cases */}
      <section className="px-5 pb-20 md:pb-28 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 md:gap-3"
        >
          <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground self-center mr-4">
            Made for
          </span>
          {useCases.map((uc, i) => (
            <motion.span
              key={uc}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="px-4 py-2 rounded-full border border-border/50 text-sm text-secondary-foreground hover:border-primary/40 hover:text-foreground transition-colors cursor-default"
            >
              {uc}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section className="px-5 py-20 md:py-28 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-display text-foreground">
              Three steps. Zero friction.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="group relative bg-card rounded-2xl p-7 border border-border/30 hover:border-primary/20 transition-all duration-500"
              >
                <span className="text-6xl font-display text-border/60 absolute top-5 right-6 group-hover:text-primary/15 transition-colors duration-500">
                  {step.number}
                </span>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-display text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual showcase */}
      <section className="px-5 py-20 md:py-28 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl overflow-hidden border border-border/20">
                <img
                  src={galleryPreview}
                  alt="Collection of photos from events"
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-display text-foreground leading-tight">
                Every photo,{" "}
                <span className="text-primary italic">one place</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                No more hunting through group chats and cloud folders. Encore collects every guest's photos into a single, beautiful gallery.
              </p>
              <ul className="space-y-3">
                {[
                  "Real-time uploads from any device",
                  "Photo moderation & approval flow",
                  "Beautiful gallery with reactions",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-secondary-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/create">
                <Button variant="ghost" className="mt-2 text-primary hover:text-primary p-0 h-auto font-medium">
                  Get started <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20 md:py-28 border-t border-border/30">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-display text-foreground mb-5 leading-tight">
            Ready to capture
            <br />
            <span className="text-primary italic">your next event?</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Free to start. No credit card. No app download.
          </p>
          <Link to="/create">
            <Button variant="hero" size="xl">
              Create your event <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8">
        <div className="max-w-5xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            <span className="font-display text-foreground">Encore</span> · Made for moments that matter
          </span>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link to="/join" className="hover:text-foreground transition-colors">Join Event</Link>
            <Link to="/auth" className="hover:text-foreground transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
