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
      // Save answers
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
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Progress bar */}
        <div className="flex gap-2 mb-10">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i <= step ? "bg-primary" : "bg-border"
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
            <p className="text-sm text-muted-foreground mb-2">Step {step + 1} of {steps.length}</p>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8">
              {currentStep.question}
            </h1>

            <div className="space-y-3">
              {currentStep.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(currentStep.key, option.value)}
                  className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-200 ${
                    answers[currentStep.key] === option.value
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border/50 bg-card hover:border-primary/30"
                  }`}
                >
                  <span className="font-medium text-foreground">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-10">
          <div>
            {step > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              Skip
            </Button>
            <Button onClick={handleNext} disabled={!answers[currentStep.key]}>
              {step === steps.length - 1 ? "Get started" : "Continue"} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
