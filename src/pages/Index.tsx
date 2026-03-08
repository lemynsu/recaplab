import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, Share2, Users, ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: imageScroll } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);
  const heroY = useTransform(heroScroll, [0, 0.7], [0, -60]);
  const imageScale = useTransform(imageScroll, [0, 0.5], [0.92, 1]);
  const imageOpacity = useTransform(imageScroll, [0, 0.3], [0, 1]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/40 backdrop-blur-2xl">
        <div className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
          <Link to="/" className="text-lg font-display text-foreground">
            Encore
          </Link>
          <div className="flex items-center gap-1">
            <Link to="/join">
              <Button variant="ghost" size="sm" className="text-muted-foreground text-xs h-8">
                Join
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="text-xs h-8 rounded-full px-4">
                Get Encore
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — full viewport, centered */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8"
          >
            Shared photo albums
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-display text-foreground leading-[1] tracking-tight mb-8"
          >
            Every event deserves
            <br />
            <span className="text-primary italic">a better album.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed mb-10"
          >
            Collect every guest's photos into one beautiful, curated gallery.
            No app downloads required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/create">
              <Button variant="hero" size="xl" className="w-full sm:w-auto rounded-full">
                Create your event <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/join">
              <Button variant="soft" size="xl" className="w-full sm:w-auto rounded-full">
                Join an event
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5 text-muted-foreground/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* Hero image — cinematic reveal on scroll */}
      <section ref={imageRef} className="px-4 md:px-6 pb-24 md:pb-32 max-w-6xl mx-auto">
        <motion.div
          style={{ scale: imageScale, opacity: imageOpacity }}
          className="relative rounded-2xl md:rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[2.4/1]"
        >
          <img
            src={heroImage}
            alt="Friends celebrating at a golden hour event"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/20" />
          <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-card border-2 border-background" />
              ))}
            </div>
            <p className="text-xs text-foreground/60 uppercase tracking-widest">247 photos · 12 contributors</p>
          </div>
        </motion.div>
      </section>

      {/* How it works — staggered scroll reveal */}
      <section className="px-6 py-24 md:py-32 border-t border-border/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4"
            >
              How it works
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-5xl font-display text-foreground"
            >
              Three steps. Zero friction.
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="group relative bg-card/50 rounded-2xl p-8 border border-border/20 hover:border-primary/20 hover:bg-card transition-all duration-500"
              >
                <span className="text-7xl font-display text-border/30 absolute top-4 right-6 group-hover:text-primary/10 transition-colors duration-700">
                  {step.number}
                </span>
                <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center mb-6 group-hover:bg-primary/12 transition-colors duration-500">
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

      {/* Feature showcase — parallax-style */}
      <section className="px-6 py-24 md:py-32 border-t border-border/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9 }}
            >
              <div className="rounded-2xl overflow-hidden border border-border/10 shadow-2xl shadow-primary/5">
                <img
                  src={galleryPreview}
                  alt="Collection of photos from events"
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-display text-foreground leading-tight">
                Every photo,{" "}
                <span className="text-primary italic">one place</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                No more hunting through group chats and cloud folders. Encore collects every guest's photos into a single, beautiful gallery.
              </p>
              <ul className="space-y-4 pt-2">
                {[
                  "Real-time uploads from any device",
                  "Photo moderation & approval flow",
                  "Beautiful gallery with reactions",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3 text-sm text-secondary-foreground"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <Link to="/create">
                  <Button variant="ghost" className="mt-2 text-primary hover:text-primary p-0 h-auto font-medium group">
                    Get started <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA — dramatic */}
      <section className="px-6 py-28 md:py-40 border-t border-border/20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display text-foreground mb-6 leading-[1.05]">
            Ready to capture
            <br />
            <span className="text-primary italic">your next event?</span>
          </h2>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto">
            Free to start. No credit card. No app download.
          </p>
          <Link to="/create">
            <Button variant="hero" size="xl" className="rounded-full">
              Create your event <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer — minimal */}
      <footer className="border-t border-border/20 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">
            <span className="font-display text-foreground text-sm">Encore</span>{" "}
            <span className="text-muted-foreground/50">·</span> Made for moments that matter
          </span>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link to="/join" className="hover:text-foreground transition-colors duration-300">Join Event</Link>
            <Link to="/auth" className="hover:text-foreground transition-colors duration-300">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
