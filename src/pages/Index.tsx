import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, Share2, Users, ArrowRight, Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-image.jpg";
import galleryPreview from "@/assets/gallery-preview.jpg";

const steps = [
  {
    icon: Camera,
    number: "01",
    title: "Create an event",
    description: "Set up your album in seconds with a title, date, and cover photo.",
  },
  {
    icon: Share2,
    number: "02",
    title: "Share the link",
    description: "Send a link or QR code — no app downloads needed for anyone.",
  },
  {
    icon: Users,
    number: "03",
    title: "Everyone uploads",
    description: "Guests contribute photos in real-time. You approve and curate.",
  },
];

const useCases = [
  { emoji: "💒", label: "Weddings" },
  { emoji: "🎪", label: "Festivals" },
  { emoji: "🏃", label: "Run Clubs" },
  { emoji: "🎓", label: "Graduations" },
  { emoji: "🎉", label: "Parties" },
  { emoji: "📸", label: "Conferences" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <Link to="/" className="text-2xl font-display font-bold text-foreground tracking-tight">
            Encore
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/join">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Join Event
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-20 pb-12 md:pt-32 md:pb-16 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left — Copy */}
          <div className="space-y-8">
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
            >
              <Sparkles className="h-4 w-4" />
              Shared photo albums, reimagined
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-[1.1] tracking-tight"
            >
              Relive every moment{" "}
              <span className="text-primary italic">together</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeUp}
              className="text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              The beautifully simple shared photo album for weddings, festivals, run clubs, and every event worth remembering.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link to="/create">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Create your event <ArrowRight className="ml-1 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/join">
                <Button variant="soft" size="xl" className="w-full sm:w-auto">
                  Join an event
                </Button>
              </Link>
            </motion.div>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={4}
              variants={fadeUp}
              className="text-sm text-muted-foreground flex items-center gap-1.5"
            >
              <Heart className="h-3.5 w-3.5 text-primary" />
              Free to start · No app download required
            </motion.p>
          </div>

          {/* Right — Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src={heroImage}
                alt="Friends celebrating at a golden hour event"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent" />
            </div>
            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -bottom-6 -left-4 md:-left-8 bg-card border border-border/60 rounded-2xl p-4 shadow-xl backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Camera className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">247 photos</p>
                  <p className="text-xs text-muted-foreground">uploaded today</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Use cases strip */}
      <section className="px-6 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-center text-sm text-muted-foreground mb-8 font-medium tracking-wide uppercase">
            Perfect for
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center gap-2 bg-card border border-border/50 rounded-full px-5 py-2.5 text-sm text-foreground hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-default"
              >
                <span className="text-lg">{uc.emoji}</span>
                {uc.label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 md:py-28 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm text-primary font-medium tracking-wide uppercase mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Three steps. Zero friction.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group relative bg-background rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <span className="text-5xl font-display font-bold text-primary/10 absolute top-6 right-6">
                  {step.number}
                </span>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual showcase */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img
                  src={galleryPreview}
                  alt="Collection of polaroid photos from events"
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground leading-tight">
                Every photo,{" "}
                <span className="text-primary italic">one place</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                No more hunting through group chats and cloud folders. Encore collects every guest's photos into a single, beautiful gallery — organized, approved, and ready to relive.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time uploads from any device",
                  "Photo moderation & approval flow",
                  "Beautiful gallery with reactions",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/create">
                <Button variant="hero" size="lg" className="mt-4">
                  Get started free <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center bg-card border border-border/50 rounded-3xl p-12 md:p-16 shadow-sm"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Ready to capture your next event?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Create your shared album in under a minute. Free to start, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/create">
              <Button variant="hero" size="xl">
                Create your event <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-display font-bold text-foreground">Encore</span>
            <span className="text-sm text-muted-foreground">· Made for moments that matter</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/join" className="hover:text-foreground transition-colors">Join Event</Link>
            <Link to="/auth" className="hover:text-foreground transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
