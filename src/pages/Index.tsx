import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import MovingSpotlight from "@/components/MovingSpotlight";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="FaceTrust AI – Real-time Face Verification"
        description="Verify identities instantly using AI-powered face recognition and liveness checks. Built for Nigeria/Africa."
        canonical={window.location.origin + "/"}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "FaceTrust AI",
          url: window.location.origin,
          sameAs: ["https://lovable.dev"],
        }}
      />
      <header className="container mx-auto max-w-6xl px-4 py-8 flex items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight">
          FaceTrust <span className="text-[hsl(var(--brand))]">AI</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link to="/verify" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">Verify</Link>
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">Login</Link>
        </nav>
      </header>

      <section className="relative overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4 py-14 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Real-time Identity Verification for the Field
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Capture a face via webcam, detect liveness, match to registered profiles, and get results instantly — optimized for low bandwidth.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="hero" size="pill">
                  <Link to="/verify">Start Verification</Link>
                </Button>
                <Button asChild variant="soft" size="pill">
                  <Link to="/login">Officer Login</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Secure by design with Supabase Auth & RLS (connect your Supabase to enable backend).
              </p>
            </div>
            <div className="relative">
              <div className="aspect-video w-full rounded-xl border bg-gradient-to-br from-[hsl(var(--brand)/0.08)] to-[hsl(var(--brand-contrast)/0.08)] shadow-elegant grid place-items-center">
                <span className="text-sm text-muted-foreground">Webcam preview appears on Verify page</span>
              </div>
            </div>
          </div>
        </div>
        <MovingSpotlight />
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">MVP Features</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive identity verification system designed for field agents and security personnel
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-[hsl(var(--brand)/0.12)] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[hsl(var(--brand))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Webcam Face Capture</h3>
              <p className="text-sm text-muted-foreground">
                Captures the user's face using the browser camera and uses AI to identify the person with high accuracy.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-[hsl(var(--brand-contrast)/0.12)] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[hsl(var(--brand-contrast))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-Time Image Search & Identity Expansion</h3>
              <p className="text-sm text-muted-foreground">
                Advanced web and social media search using reverse image lookup. Returns public photos, gender, social media links, and comprehensive online public data.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Face Matching</h3>
              <p className="text-sm text-muted-foreground">
                Compares captured face to database entries and returns match results with detailed confidence scores and accuracy metrics.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Identity Retrieval</h3>
              <p className="text-sm text-muted-foreground">
                Displays comprehensive identity details including name, NIN, license info, gender, social handles, and verified public information.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Officer Login Panel</h3>
              <p className="text-sm text-muted-foreground">
                Secure authentication system for authorized agents using Supabase Auth with role-based access control.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Anti-Spoofing Check</h3>
              <p className="text-sm text-muted-foreground">
                Advanced liveness detection that verifies if the face input is genuine and not from a photo, screen, or deepfake.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Error/Success Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Real-time feedback system with intelligent chatbot assistance and clear notification UI for seamless user experience.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Verification Logs</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive audit trail storing each verification activity: who was scanned, by whom, when, and detailed results.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Responsive Design</h3>
              <p className="text-sm text-muted-foreground">
                Fully optimized for both mobile and desktop use, specifically designed for field agents working in various environments.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--brand)/0.08)] text-[hsl(var(--brand))] text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Optimized for low-bandwidth environments and real-time processing
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

      <footer className="container mx-auto max-w-6xl px-4 py-10 text-xs text-muted-foreground">
        © {new Date().getFullYear()} FaceTrust AI. Built for Africa.
      </footer>
    </main>
  );
};

export default Index;
