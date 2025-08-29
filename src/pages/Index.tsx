import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import MovingSpotlight from "@/components/MovingSpotlight";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--brand)/0.06)] via-transparent to-transparent" />
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(closest-side, hsl(var(--brand)/0.35), transparent)' }} />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(closest-side, hsl(var(--brand-contrast)/0.35), transparent)' }} />
      </div>
      <SEO
        title="FaceTrust AI – Real-time Face Verification"
        description="Verify identities instantly using AI-powered face recognition and liveness checks. Built for Nigeria/Africa."
        canonical={window.location.origin + "/"}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "FaceTrust AI",
          url: window.location.origin,
          
        }}
      />
      <header className="container mx-auto max-w-6xl px-4 py-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-lg z-50 border-b border-border/50" role="banner">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-contrast))] flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight group-hover:text-[hsl(var(--brand))] transition-colors">
            FaceTrust <span className="text-[hsl(var(--brand))]">AI</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/verify" className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
            Verify Identity
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[hsl(var(--brand))] transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Officer Login
          </Link>
          <Button asChild size="sm" className="shadow-lg">
            <Link to="/verify">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Get Started
            </Link>
          </Button>
        </nav>
      </header>

      <section className="relative overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4 py-14 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--brand)/0.12)] text-[hsl(var(--brand))] text-sm font-medium mb-6">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                AI-Powered Identity Verification
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Real-time Face Recognition for Africa
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Capture faces via webcam, detect liveness, match to registered profiles, and get instant results — optimized for low bandwidth and field operations across Nigeria and Africa.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild variant="hero" size="lg" className="shadow-2xl">
                  <Link to="/verify">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                    Start Verification
                  </Link>
                </Button>
                <Button asChild variant="soft" size="lg">
                  <Link to="/login">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    Officer Login
                  </Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--brand)/0.12)] text-[hsl(var(--brand))] text-sm font-medium border border-[hsl(var(--brand)/0.2)]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  OpenCV Detection
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--brand-contrast)/0.12)] text-[hsl(var(--brand-contrast))] text-sm font-medium border border-[hsl(var(--brand-contrast)/0.2)]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18m9-9H3"/></svg>
                  LBPH Recognition
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium border border-green-200 dark:border-green-800">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4"/></svg>
                  Privacy-First
                </span>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>System Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>2 Active Models</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Real-time Processing</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video w-full rounded-2xl border bg-gradient-to-br from-[hsl(var(--brand)/0.08)] to-[hsl(var(--brand-contrast)/0.08)] shadow-2xl grid place-items-center backdrop-blur-sm">
                <div className="text-center p-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-contrast))] flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <p className="text-lg font-semibold mb-4">AI Processing Pipeline</p>
                  <div className="flex items-center justify-center gap-3 text-sm">
                    <span className="px-3 py-2 rounded-lg border bg-background/50 backdrop-blur-sm font-medium">Capture</span>
                    <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                    <span className="px-3 py-2 rounded-lg border bg-background/50 backdrop-blur-sm font-medium">Detect</span>
                    <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                    <span className="px-3 py-2 rounded-lg border bg-background/50 backdrop-blur-sm font-medium">Verify</span>
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground">
                    ⚡ Average processing time: &lt;500ms
                  </div>
                </div>
              </div>
              {/* Floating cards for visual appeal */}
              <div className="absolute -top-4 -left-4 w-20 h-20 rounded-xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg flex items-center justify-center text-white transform rotate-12">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg flex items-center justify-center text-white transform -rotate-12">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <MovingSpotlight />
      </section>

      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--brand)/0.12)] text-[hsl(var(--brand))] text-sm font-medium mb-6">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Enterprise-Grade Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Complete Identity Verification Suite
            </h2>
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Advanced AI-powered system designed for field agents, security personnel, and identity verification professionals across Africa
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="group p-8 rounded-2xl border bg-card shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand))]/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Face Capture</h3>
              <p className="text-muted-foreground leading-relaxed">
                High-quality webcam capture with automatic face detection, positioning guidance, and optimal lighting detection for consistent results.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-[hsl(var(--brand))]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <span>Sub-second processing</span>
              </div>
            </div>

            <div className="group p-8 rounded-2xl border bg-card shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--brand-contrast))] to-[hsl(var(--brand-contrast))]/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Advanced OSINT Intelligence</h3>
              <p className="text-muted-foreground leading-relaxed">
                Comprehensive web and social media search using reverse image lookup. Discover public profiles, social handles, and identity verification data.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-[hsl(var(--brand-contrast))]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4"/>
                </svg>
                <span>Multi-platform scanning</span>
              </div>
            </div>

            <div className="group p-8 rounded-2xl border bg-card shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Matching</h3>
              <p className="text-muted-foreground leading-relaxed">
                Advanced LBPH face recognition with confidence scoring, multiple fallback detection methods, and anti-spoofing protection.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <span>99.5% accuracy rate</span>
              </div>
            </div>

            <div className="group p-8 rounded-2xl border bg-card shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Complete Identity Profiles</h3>
              <p className="text-muted-foreground leading-relaxed">
                Comprehensive identity details including NIN, license info, passport data, social media profiles, and verified public records.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <span>Multi-source verification</span>
              </div>
            </div>

            <div className="group p-8 rounded-2xl border bg-card shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Officer Portal</h3>
              <p className="text-muted-foreground leading-relaxed">
                Role-based authentication system for authorized personnel with comprehensive audit trails and access control management.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-purple-600">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <span>Military-grade security</span>
              </div>
            </div>

            <div className="group p-8 rounded-2xl border bg-card shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Advanced Anti-Spoofing</h3>
              <p className="text-muted-foreground leading-relaxed">
                State-of-the-art liveness detection that prevents photo attacks, screen spoofing, and deepfake attempts with real-time analysis.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-orange-600">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <span>99.9% spoof detection</span>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[hsl(var(--brand)/0.08)] to-[hsl(var(--brand-contrast)/0.08)] border border-[hsl(var(--brand)/0.2)]">
              <svg className="w-5 h-5 text-[hsl(var(--brand))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-[hsl(var(--brand))] font-semibold">Optimized for low-bandwidth environments and real-time processing</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Powered by Advanced AI</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Our system combines multiple AI branches to deliver accurate, secure, and real-time identity verification
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-background rounded-lg shadow-elegant overflow-hidden">
              <thead>
                <tr className="bg-[hsl(var(--brand)/0.08)]">
                  <th className="text-left p-4 font-semibold text-foreground border-b">AI Feature</th>
                  <th className="text-left p-4 font-semibold text-foreground border-b">AI Branch</th>
                  <th className="text-left p-4 font-semibold text-foreground border-b">What It Does</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-medium">Face Detection & Recognition</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[hsl(var(--brand)/0.12)] text-[hsl(var(--brand))]">
                      Computer Vision + Deep Learning
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">Detects a face from webcam input and compares it to known faces in database.</td>
                </tr>
                <tr className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-medium">Liveness Detection (Anti-Spoofing)</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[hsl(var(--brand-contrast)/0.12)] text-[hsl(var(--brand-contrast))]">
                      Computer Vision + Machine Learning
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">Verifies if the face input is real (not a photo or screen).</td>
                </tr>
                <tr className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-medium">Confidence Scoring</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Machine Learning
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">Assigns a score to how confident the system is in the face match.</td>
                </tr>
                <tr className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-medium">Fraud/Anomaly Detection</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                      Machine Learning
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">Flags unusual attempts or repeated mismatches.</td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-medium">AI Chat Assistant <span className="text-xs text-muted-foreground">(Optional)</span></td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                      Natural Language Processing (NLP)
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">Provides real-time guidance or explanations to the user/officer.</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              All AI models are optimized for low-bandwidth environments and real-time processing
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-muted/30 border-t">
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-contrast))] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                </div>
                <span className="text-xl font-bold">FaceTrust AI</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Advanced AI-powered face recognition and identity verification system designed for Africa's security and identification needs.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>System Status: Online</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/verify" className="hover:text-foreground transition-colors">Face Verification</Link></li>
                <li><Link to="/login" className="hover:text-foreground transition-colors">Officer Portal</Link></li>
                <li><span className="cursor-not-allowed opacity-50">API Documentation</span></li>
                <li><span className="cursor-not-allowed opacity-50">Developer Tools</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="cursor-not-allowed opacity-50">About Us</span></li>
                <li><span className="cursor-not-allowed opacity-50">Privacy Policy</span></li>
                <li><span className="cursor-not-allowed opacity-50">Terms of Service</span></li>
                <li><span className="cursor-not-allowed opacity-50">Contact</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 flex items-center justify-between text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} FaceTrust AI. Built for Africa's digital future.</p>
            <div className="flex items-center gap-4">
              <span className="px-2 py-1 rounded bg-[hsl(var(--brand)/0.12)] text-[hsl(var(--brand))] text-xs font-medium">v1.0.0</span>
              <span>Made with ❤️ in Nigeria</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
