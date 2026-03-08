import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const ScrollReveal = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const steps = [
  { num: "01", title: "CREATE", desc: "Set up your event album in under a minute." },
  { num: "02", title: "SHARE", desc: "Send one link or QR code. No app needed." },
  { num: "03", title: "RELIVE", desc: "Everyone uploads. You browse, react, and keep it forever." },
];

const useCases = [
  { title: "Weddings & Celebrations", desc: "Collect every guest's perspective into one beautiful, shared album." },
  { title: "Friend Trips & Hangouts", desc: "One link, everyone's photos. No more asking people to send theirs." },
  { title: "Run Clubs & Weekly Events", desc: "Recurring moments deserve a place to live beyond the group chat." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 md:px-12 py-5 max-w-[1400px] mx-auto">
          <span className="text-[12px] font-sans font-normal uppercase tracking-[0.2em] text-foreground">
            ENCORE
          </span>
          <div className="flex items-center gap-0 text-[13px] font-sans font-normal text-foreground">
            <Link to="/auth" className="px-3 py-1 hover:opacity-60 transition-opacity duration-200">
              Sign in
            </Link>
            <span className="text-border">|</span>
            <Link to="/create" className="px-3 py-1 hover:opacity-60 transition-opacity duration-200">
              Create album
            </Link>
          </div>
        </div>
      </nav>

      {/* SECTION 1 — HERO */}
      <section className="h-screen flex flex-col justify-center px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-[11px] font-sans font-normal uppercase tracking-[0.15em] text-muted-foreground mb-8"
          >
            SHARED PHOTO ALBUMS
          </motion.p>
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-display font-light text-[52px] md:text-[88px] leading-[1.05] tracking-[-0.02em] text-foreground"
          >
            Every moment,
            <br />
            deserves an encore.
          </motion.h1>
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-12"
          >
            <Link
              to="/create"
              className="text-[14px] font-sans font-normal text-foreground hover:underline underline-offset-4 transition-all duration-200"
            >
              Create your album &rarr;
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="mx-6 md:mx-12 max-w-[1400px] lg:mx-auto border-t border-border" />

      {/* SECTION 2 — HOW IT WORKS */}
      <section className="py-[80px] md:py-[120px] px-6 md:px-12 max-w-[1400px] mx-auto">
        <ScrollReveal>
          <p className="text-[11px] font-sans font-normal uppercase tracking-[0.15em] text-muted-foreground mb-16">
            HOW IT WORKS
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-border">
          {steps.map((step, i) => (
            <ScrollReveal key={step.num} className={`${i > 0 ? "mt-12 md:mt-0" : ""} md:px-8 first:md:pl-0 last:md:pr-0`}>
              <span className="font-display font-light text-[48px] leading-none text-foreground">
                {step.num}
              </span>
              <div className="border-t border-border mt-6 pt-6">
                <p className="text-[14px] font-sans font-normal uppercase tracking-[0.1em] text-foreground mb-3">
                  {step.title}
                </p>
                <p className="text-[14px] font-sans font-light leading-[1.7] text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <div className="mx-6 md:mx-12 max-w-[1400px] lg:mx-auto border-t border-border" />

      {/* SECTION 3 — FOR EVERY MOMENT */}
      <section className="py-[80px] md:py-[120px] px-6 md:px-12 max-w-[1400px] mx-auto">
        <ScrollReveal>
          <p className="text-[11px] font-sans font-normal uppercase tracking-[0.15em] text-muted-foreground mb-16">
            MADE FOR
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {useCases.map((uc) => (
            <ScrollReveal key={uc.title}>
              <h3 className="font-display font-normal text-[28px] leading-[1.2] text-foreground mb-4">
                {uc.title}
              </h3>
              <p className="text-[14px] font-sans font-light leading-[1.7] text-muted-foreground">
                {uc.desc}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* SECTION 4 — CLOSING CTA */}
      <section className="py-[120px] md:py-[160px] px-6 md:px-12 text-center">
        <ScrollReveal className="flex flex-col items-center">
          <h2 className="font-display font-light text-[48px] md:text-[64px] leading-[1.1] tracking-[-0.02em] text-foreground">
            Your next event
            <br />
            starts here.
          </h2>
          <Link
            to="/create"
            className="mt-10 inline-block border border-foreground text-[13px] font-sans font-normal uppercase tracking-[0.1em] px-10 py-3.5 rounded-[2px] text-foreground hover:bg-foreground hover:text-background transition-all duration-200"
          >
            CREATE FREE ALBUM
          </Link>
          <p className="mt-5 text-[13px] font-sans font-normal text-muted-foreground">
            No account required to join an event.
          </p>
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="flex items-center justify-between px-6 md:px-12 py-6 max-w-[1400px] mx-auto">
          <span className="text-[12px] font-sans font-normal text-muted-foreground">
            &copy; Encore 2025
          </span>
          <div className="flex items-center gap-4 text-[12px] font-sans font-normal text-muted-foreground">
            <span className="hover:text-foreground transition-colors duration-200 cursor-pointer">Privacy</span>
            <span>&middot;</span>
            <span className="hover:text-foreground transition-colors duration-200 cursor-pointer">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
