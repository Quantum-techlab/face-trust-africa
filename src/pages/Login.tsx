import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Shield, User, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Demo credentials for testing
  const demoCredentials = [
    { email: "officer@facetrust.ai", password: "demo123", role: "Field Officer" },
    { email: "admin@facetrust.ai", password: "admin123", role: "Administrator" },
    { email: "supervisor@facetrust.ai", password: "super123", role: "Supervisor" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simulate authentication delay
      await new Promise((r) => setTimeout(r, 800));
      
      // Check demo credentials
      const validCredential = demoCredentials.find(
        cred => cred.email === email && cred.password === password
      );
      
      if (validCredential) {
        // Store demo session
        localStorage.setItem('facetrust_session', JSON.stringify({
          email: validCredential.email,
          role: validCredential.role,
          loginTime: Date.now()
        }));
        
        toast.success("Login Successful!", {
          description: `Welcome back, ${validCredential.role}`
        });
        
        navigate("/verify");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (e) {
      setError("Invalid email or password. Please try the demo credentials below.");
      toast.error("Login Failed", {
        description: "Please check your credentials and try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const useDemoCredentials = (cred: typeof demoCredentials[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <SEO
        title="Officer Login – FaceTrust AI"
        description="Secure login portal for authorized FaceTrust AI personnel and field officers."
        canonical={window.location.origin + "/login"}
      />
      
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-[hsl(var(--brand))]" />
            <h1 className="text-2xl font-bold">
              FaceTrust <span className="text-[hsl(var(--brand))]">AI</span>
            </h1>
          </div>
          <h2 className="text-xl font-semibold">Officer Login</h2>
          <p className="text-sm text-muted-foreground">
            Secure access for authorized personnel
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Authentication
            </CardTitle>
            <CardDescription>
              Enter your credentials to access the verification system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="officer@facetrust.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-11"
                variant="hero"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Demo Credentials
            </CardTitle>
            <CardDescription>
              Use these credentials to test the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoCredentials.map((cred, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div>
                  <p className="text-sm font-medium">{cred.role}</p>
                  <p className="text-xs text-muted-foreground">{cred.email}</p>
                </div>
                <Button 
                  onClick={() => useDemoCredentials(cred)}
                  size="sm" 
                  variant="outline"
                >
                  Use
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">System Status:</span>
              <Badge variant="default" className="text-xs">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Online
              </Badge>
            </div>
            <Separator className="my-3" />
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>• Authentication system active</p>
              <p>• Face recognition AI ready</p>
              <p>• Database connections stable</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            FaceTrust AI v1.0.0 • Secure Identity Verification
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;