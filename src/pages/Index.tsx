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
