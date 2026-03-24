import React from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Camera, Cpu, Shield, FileCheck, CheckCircle2, Zap } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Camera,
    title: "Face Capture",
    description: "The officer or user positions their face in the camera frame. Our AI automatically detects the face, checks lighting conditions, and captures a high-quality image optimized for recognition.",
    detail: "Supports webcam, mobile camera, and field devices. Auto-adjusts for low-light conditions.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Cpu,
    title: "AI Processing",
    description: "The captured image is processed through our LBPH face recognition pipeline with anti-spoofing liveness detection. The system analyzes 128+ facial landmarks in under 500ms.",
    detail: "Liveness check prevents photo attacks, screen spoofing, and deepfake attempts.",
    color: "from-[hsl(var(--brand))] to-[hsl(var(--brand-contrast))]",
  },
  {
    icon: Shield,
    title: "Identity Matching",
    description: "The face encoding is compared against the registered identity database. A confidence score is generated, and if above threshold, the identity is confirmed with full document retrieval.",
    detail: "Cross-references NIN, Driver's License, Passport, Voter's Card, and public records.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: FileCheck,
    title: "Results & Report",
    description: "A comprehensive verification report is generated showing match confidence, liveness score, all linked identity documents, risk assessment, and verification history.",
    detail: "Results include fraud indicators, image quality analysis, and processing metrics.",
    color: "from-purple-500 to-purple-600",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="How It Works – FaceTrust AI"
        description="Learn how FaceTrust AI verifies identities in real-time using face recognition, liveness detection, and multi-document validation."
        canonical={window.location.origin + "/how-it-works"}
      />

      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" />Home</Link>
            </Button>
            <h1 className="text-xl font-bold">How It Works</h1>
          </div>
          <Button asChild size="sm">
            <Link to="/verify">
              <Zap className="w-4 h-4 mr-2" />
              Try It Now
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 text-center">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--brand)/0.12)] text-[hsl(var(--brand))] text-sm font-medium mb-6">
            <CheckCircle2 className="w-4 h-4" />
            4-Step Verification Pipeline
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            From Face Capture to Full Identity Report
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered pipeline processes face verification in under 500ms, cross-referencing multiple identity databases for comprehensive results.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-12">
        <div className="container mx-auto max-w-5xl px-4 space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col md:flex-row items-start gap-6 p-8 rounded-2xl border bg-card shadow-sm"
            >
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-3xl font-black text-muted-foreground/30">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">{step.description}</p>
                <p className="text-sm text-muted-foreground/80 italic border-l-2 border-[hsl(var(--brand)/0.3)] pl-3">
                  {step.detail}
                </p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block w-6 h-6 text-muted-foreground/40 self-center flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="container mx-auto max-w-4xl px-4">
          <h3 className="text-2xl font-bold mb-4">Ready to See It in Action?</h3>
          <p className="text-muted-foreground mb-8">Experience the full verification pipeline with our live demo.</p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="hero" size="lg">
              <Link to="/verify">
                <Camera className="w-5 h-5 mr-2" />
                Start Verification
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/dashboard">
                View Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} FaceTrust AI. Built for Africa's digital future.</p>
      </footer>
    </main>
  );
};

export default HowItWorks;
