import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import CameraCapture from "@/components/CameraCapture";
import VerificationResultCard from "@/components/VerificationResultCard";
import { verifyFace, logVerification, getVerificationLogs, type VerificationLog } from "@/services/verification";
import { searchOpenWeb, type OSINTResult } from "@/services/osint";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, History, MapPin, User, Clock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import ModelInfo from "@/components/ModelInfo";
import { faceRecognitionService } from "@/services/faceRecognitionService";

const Verify: React.FC = () => {
  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<VerificationLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [osint, setOsint] = useState<OSINTResult | null>(null);
  const [osintLoading, setOsintLoading] = useState(false);
  const [teamCount, setTeamCount] = useState<number>(0);
  const [modelTrained, setModelTrained] = useState<boolean>(false);

  // Get user location for logging
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log("Location access denied:", error);
        }
      );
    }
  }, []);

  // Load verification logs
  useEffect(() => {
    setLogs(getVerificationLogs());
  }, [result]);

  // Fetch team/model status
  useEffect(() => {
    (async () => {
      try {
        const data = await faceRecognitionService.getTeamMembers();
        const members = Array.isArray(data?.team_members) ? data.team_members.length : 0;
        setTeamCount(members);
        setModelTrained(members > 0);
      } catch (e) {
        setTeamCount(0);
        setModelTrained(false);
      }
    })();
  }, []);

  const onCapture = async (dataUrl: string, blob: Blob) => {
    setImg(dataUrl);
    setLoading(true);
    setResult(null);
    
    try {
      toast.info("Processing face verification...", {
        description: "Please wait while we analyze the captured image"
      });

      const res = await verifyFace(dataUrl);
      setResult(res);

      // Run OSINT scan (mock) after face verification
      setOsint(null);
      setOsintLoading(true);
      toast.info("Scanning open web for public photos & profiles...", {
        description: "Reverse image search (mock) and signals collection"
      });
      try {
        const intel = await searchOpenWeb(dataUrl, res.identity?.full_name || undefined);
        setOsint(intel);
      } catch (err) {
        console.error("OSINT error:", err);
      } finally {
        setOsintLoading(false);
      }

      // Log the verification
      await logVerification({ 
        ts: Date.now(), 
        res,
        officerId: "demo_officer_001",
        location: location ? {
          latitude: location.latitude,
          longitude: location.longitude,
          address: "Demo Location" // In real app, reverse geocode this
        } : undefined
      });

      // Show success/failure toast
      if (res.matched) {
        toast.success("Identity Verified Successfully!", {
          description: `Match confidence: ${Math.round((res.confidence || 0) * 100)}%`
        });
      } else {
        toast.error("Verification Failed", {
          description: res.reason || "No matching identity found"
        });
      }

      // Refresh logs
      setLogs(getVerificationLogs());
      
    } catch (e) {
      console.error("Verification error:", e);
      toast.error("Verification Error", {
        description: "Failed to process verification. Please try again."
      });
      setResult({
        matched: false,
        reason: "System error occurred during verification",
        confidence: 0,
        liveness: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const formatLogDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient aesthetics */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--brand)/0.06)] via-transparent to-transparent" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl opacity-30"
             style={{ background: 'radial-gradient(closest-side, hsl(var(--brand)/0.35), transparent)' }} />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full blur-3xl opacity-30"
             style={{ background: 'radial-gradient(closest-side, hsl(var(--brand-contrast)/0.35), transparent)' }} />
      </div>
      <SEO
        title="Verify Identity – FaceTrust AI"
        description="Capture a face via webcam and verify identity in real-time with FaceTrust AI."
        canonical={window.location.origin + "/verify"}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "FaceTrust AI",
          applicationCategory: "SecurityApplication",
          operatingSystem: "Web",
        }}
      />
      
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Face Verification System</h1>
                <p className="text-sm text-muted-foreground">Real-time identity verification with AI</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">Model: LBPH</Badge>
              <Badge variant="outline" className="text-xs">
                <User className="w-3 h-3 mr-1" />
                Officer: Demo User
              </Badge>
              <Button 
                onClick={() => setShowLogs(!showLogs)} 
                variant="outline" 
                size="sm"
              >
                <History className="w-4 h-4 mr-2" />
                Logs ({logs.length})
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Verification Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Camera Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Camera Capture</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {location && (
                    <>
                      <MapPin className="w-4 h-4" />
                      <span>Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <CameraCapture onCapture={onCapture} buttonLabel="Capture & Verify Identity" />
                </div>
                
                {img && (
                  <div className="space-y-3">
                    <h3 className="font-medium">Captured Image</h3>
                    <figure className="relative">
                      <img 
                        src={img} 
                        alt="Captured face for verification" 
                        className="w-full rounded-lg border shadow-elegant" 
                        loading="lazy" 
                      />
                      <figcaption className="mt-2 text-xs text-muted-foreground">
                        Image optimized for AI processing • {new Date().toLocaleTimeString()}
                      </figcaption>
                    </figure>
                  </div>
                )}
              </div>
            </section>

            {/* Results Section */}
            <section>
              <h2 className="text-lg font-medium mb-4">Verification Results</h2>
              <VerificationResultCard result={result} loading={loading} />
            </section>
          </div>

          {/* Sidebar - Logs */}
          <div className="space-y-6">
            <section className="rounded-lg border bg-card/80 backdrop-blur p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Recent Verifications</h3>
                <Badge variant="secondary">{logs.length}</Badge>
              </div>
              
              {logs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No verifications yet</p>
                  <p className="text-xs">Capture a face to start</p>
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {logs.slice(0, 10).map((log, index) => (
                      <div key={log.id} className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {log.result.matched ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-destructive" />
                            )}
                            <span className="text-sm font-medium">
                              {log.result.matched ? "Verified" : "Failed"}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            #{logs.length - index}
                          </Badge>
                        </div>
                        
                        {log.result.identity && (
                          <p className="text-sm font-medium text-foreground mb-1">
                            {log.result.identity.full_name}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatLogDate(log.timestamp)}
                          </div>
                          {log.result.confidence && (
                            <span>
                              {Math.round(log.result.confidence * 100)}% confidence
                            </span>
                          )}
                        </div>
                        
                        {log.result.reason && (
                          <p className="text-xs text-destructive mt-1">
                            {log.result.reason}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </section>

            {/* System Status */}
            <section className="rounded-lg border bg-card/80 backdrop-blur p-4">
              <h3 className="font-medium mb-3">System Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AI Engine:</span>
                  <Badge variant="default" className="text-xs">Online</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Database:</span>
                  <Badge variant="default" className="text-xs">Connected</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Face Detection:</span>
                  <Badge variant="default" className="text-xs">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Liveness Check:</span>
                  <Badge variant="default" className="text-xs">Enabled</Badge>
                </div>
              </div>
              
              <Separator className="my-3" />
              
              <div className="text-xs text-muted-foreground">
                <p>Last system check: {new Date().toLocaleTimeString()}</p>
                <p>Version: 1.0.0-MVP</p>
              </div>
            </section>

            {/* Model Info */}
            <ModelInfo trained={modelTrained} members={teamCount} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Verify;