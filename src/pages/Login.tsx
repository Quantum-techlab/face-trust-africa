import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Placeholder: real auth will be implemented with Supabase
      await new Promise((r) => setTimeout(r, 600));
      navigate("/verify");
    } catch (e) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto max-w-md py-10">
      <SEO
        title="Login – FaceTrust AI"
        description="Officer login portal for FaceTrust AI secure identity verification."
        canonical={window.location.origin + "/login"}
      />
      <h1 className="text-2xl font-semibold">Officer Login</h1>
      <p className="mt-1 text-sm text-muted-foreground">Secure access for authorized personnel.</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-md border bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Email"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-md border bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Password"
          />
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={loading} className="h-11">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-xs text-muted-foreground">
        Note: Real authentication will be enabled after Supabase is connected.
        <br />
        <Link to="/" className="underline">Back to home</Link>
      </p>
    </main>
  );
};

export default Login;
