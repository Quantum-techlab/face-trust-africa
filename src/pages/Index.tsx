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

      <footer className="container mx-auto max-w-6xl px-4 py-10 text-xs text-muted-foreground">
        © {new Date().getFullYear()} FaceTrust AI. Built for Africa.
      </footer>
    </main>
  );
};

export default Index;
