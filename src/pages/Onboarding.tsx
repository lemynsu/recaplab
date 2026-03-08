import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

const steps = [
  {
    question: "How will you use Encore?",
    key: "use_case",
    options: [
      { label: "Photographer / Organizer", value: "organizer" },
      { label: "One-time event", value: "one_time" },
      { label: "Recurring community", value: "recurring" },
      { label: "Guest exploring", value: "guest" },
    ],
  },
  {
    question: "How often do you host events?",
    key: "event_frequency",
    options: [
      { label: "Once in a while", value: "rarely" },
      { label: "Monthly", value: "monthly" },
      { label: "Weekly or more", value: "weekly" },
      { label: "Just exploring", value: "exploring" },
    ],
  },
  {
    question: "What do you want to do first?",
    key: "referral_source",
    options: [
      { label: "Create an event album", value: "create" },
      { label: "Upload to an event", value: "upload" },
      { label: "Browse an album", value: "browse" },
    ],
  },
];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      if (user) {
        await supabase
          .from("profiles")
          .update({
            use_case: answers.use_case || null,
            event_frequency: answers.event_frequency || null,
            referral_source: answers.referral_source || null,
            onboarding_completed: true,
          })
          .eq("user_id", user.id);
      }
      navigate("/dashboard");
    }
  };

  const handleSkip = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex gap-2 mb-12">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 rounded-full transition-colors duration-500 ${
                i <= step ? "bg-primary" : "bg-border/50"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
              {step + 1} of {steps.length}
            </p>
            <h1 className="text-2xl md:text-3xl font-display text-foreground mb-8">
              {currentStep.question}
            </h1>

            <div className="space-y-2.5">
              {currentStep.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(currentStep.key, option.value)}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                    answers[currentStep.key] === option.value
                      ? "border-primary/50 bg-primary/5"
                      : "border-border/30 bg-card hover:border-border/60"
                  }`}
                >
                  <span className="text-sm text-foreground">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-10">
          <div>
            {step > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)} className="text-muted-foreground">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground text-xs">
              Skip
            </Button>
            <Button onClick={handleNext} disabled={!answers[currentStep.key]} size="sm">
              {step === steps.length - 1 ? "Get started" : "Continue"} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
