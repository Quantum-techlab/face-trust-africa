import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import CameraCapture from "@/components/CameraCapture";
import VerificationResultCard from "@/components/VerificationResultCard";
import BackendDiagnostic from "@/components/BackendDiagnostic";
import {
  verifyFace,
  logVerification,
  getVerificationLogs,
  type VerificationLog,
} from "@/services/verification";
import { searchOpenWeb, type OSINTResult } from "@/services/osint";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  History,
  MapPin,
  User,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import ModelInfo from "@/components/ModelInfo";
import { faceRecognitionService } from "@/services/faceRecognitionService";

const Verify: React.FC = () => {
  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<VerificationLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
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
            longitude: position.coords.longitude,
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
        const members = Array.isArray(data?.team_members)
          ? data.team_members.length
          : 0;
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
        description: "Please wait while we analyze the captured image",
      });

      const res = await verifyFace(dataUrl);
      setResult(res);

      // Run OSINT scan (mock) after face verification
      setOsint(null);
      setOsintLoading(true);
      toast.info("Scanning open web for public photos & profiles...", {
        description: "Reverse image search (mock) and signals collection",
      });
      try {
        const intel = await searchOpenWeb(
          dataUrl,
          res.identity?.full_name || undefined
        );
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
        location: location
          ? {
              latitude: location.latitude,
              longitude: location.longitude,
              address: "Demo Location", // In real app, reverse geocode this
            }
          : undefined,
      });

      // Show success/failure toast
      if (res.matched) {
        toast.success("Identity Verified Successfully!", {
          description: `Match confidence: ${Math.round(
            (res.confidence || 0) * 100
          )}%`,
        });
      } else {
        toast.error("Verification Failed", {
          description: res.reason || "No matching identity found",
        });
      }

      // Refresh logs
      setLogs(getVerificationLogs());
    } catch (e) {
      console.error("Verification error:", e);
      toast.error("Verification Error", {
        description: "Failed to process verification. Please try again.",
      });
      setResult({
        matched: false,
        reason: "System error occurred during verification",
        confidence: 0,
        liveness: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatLogDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient aesthetics */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--brand)/0.06)] via-transparent to-transparent" />
        <div
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(closest-side, hsl(var(--brand)/0.35), transparent)",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(closest-side, hsl(var(--brand-contrast)/0.35), transparent)",
          }}
        />
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
      <header className="border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hover:bg-[hsl(var(--brand)/0.1)]"
              >
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-contrast))] flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    Face Verification System
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Real-time AI-powered identity verification
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live System</span>
              </div>
              <Badge variant="secondary" className="text-xs font-mono">
                LBPH v2.0
              </Badge>
              <Badge variant="outline" className="text-xs">
                <User className="w-3 h-3 mr-1" />
                Demo Officer
              </Badge>
              <Button
                onClick={() => setShowLogs(!showLogs)}
                variant="outline"
                size="sm"
                className="shadow-sm"
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
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Camera Capture</h2>
                  <p className="text-muted-foreground">
                    Position your face clearly in the camera frame for accurate
                    verification
                  </p>
                </div>
                {location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground px-3 py-1.5 rounded-full bg-muted/50">
                    <MapPin className="w-4 h-4" />
                    <span>
                      Location: {location.latitude.toFixed(4)},{" "}
                      {location.longitude.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl border bg-gradient-to-br from-card to-card/50 shadow-sm">
                    <CameraCapture
                      onCapture={onCapture}
                      buttonLabel="Capture & Verify Identity"
                    />
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          Model Status
                        </span>
                      </div>
                      <p className="text-lg font-bold text-green-800 dark:text-green-200">
                        {modelTrained ? "Ready" : "Training"}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          Known Members
                        </span>
                      </div>
                      <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                        {teamCount}
                      </p>
                    </div>
                  </div>
                </div>

                {img && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-[hsl(var(--brand))]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Captured Image
                      </h3>
                      <figure className="relative group">
                        <img
                          src={img}
                          alt="Captured face for verification"
                          className="w-full rounded-xl border-2 border-[hsl(var(--brand)/0.2)] shadow-lg group-hover:shadow-xl transition-shadow"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <figcaption className="mt-3 text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Captured at {new Date().toLocaleTimeString()} •
                          Optimized for AI processing
                        </figcaption>
                      </figure>
                    </div>

                    {/* Processing Status */}
                    {loading && (
                      <div className="p-4 rounded-xl border bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                          <div>
                            <p className="font-medium text-amber-700 dark:text-amber-300">
                              Processing...
                            </p>
                            <p className="text-sm text-amber-600 dark:text-amber-400">
                              Analyzing facial features and matching against
                              database
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Results Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Verification Results</h2>
                  <p className="text-muted-foreground">
                    Detailed analysis and identity verification outcome
                  </p>
                </div>
                {result && (
                  <Badge
                    variant={result.matched ? "default" : "destructive"}
                    className="text-sm px-4 py-2"
                  >
                    {result.matched ? "✓ Verified" : "✗ Failed"}
                  </Badge>
                )}
              </div>
              <div className="rounded-2xl border bg-gradient-to-br from-card to-card/50 shadow-sm overflow-hidden">
                <VerificationResultCard result={result} loading={loading} />
              </div>

              {/* OSINT Results */}
              {(osint || osintLoading) && (
                <div className="rounded-2xl border bg-gradient-to-br from-card to-card/50 shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-[hsl(var(--brand-contrast))]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Open Source Intelligence (OSINT)
                  </h3>
                  {osintLoading ? (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                      <div className="w-5 h-5 border-2 border-[hsl(var(--brand-contrast))] border-t-transparent rounded-full animate-spin"></div>
                      <div>
                        <p className="font-medium">
                          Scanning public databases...
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Searching social media, public records, and web
                          presence
                        </p>
                      </div>
                    </div>
                  ) : (
                    osint && (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-muted/30">
                            <h4 className="font-medium mb-2">
                              Social Media Presence
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Found {Object.keys(osint.socialLinks || {}).length || 0}{" "}
                              social media profiles
                            </p>
                          </div>
                          <div className="p-4 rounded-xl bg-muted/30">
                            <h4 className="font-medium mb-2">Public Records</h4>
                            <p className="text-sm text-muted-foreground">
                              {osint.sources && osint.sources.length > 0
                                ? "Records found"
                                : "No public records found"}
                            </p>
                          </div>
                        </div>
                        {osint.summary && (
                          <div className="p-4 rounded-xl border bg-background">
                            <h4 className="font-medium mb-2">
                              Intelligence Summary
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {osint.summary}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
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
                      <div
                        key={log.id}
                        className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
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
                              {Math.round(log.result.confidence * 100)}%
                              confidence
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
                  <Badge variant="default" className="text-xs">
                    Online
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Database:</span>
                  <Badge variant="default" className="text-xs">
                    Connected
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Face Detection:</span>
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Liveness Check:</span>
                  <Badge variant="default" className="text-xs">
                    Enabled
                  </Badge>
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

            {/* Backend Diagnostic - Remove this after fixing the issue */}
            <BackendDiagnostic />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Verify;
