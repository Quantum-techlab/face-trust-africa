import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, Camera, CheckCircle2, XCircle, Users, Shield, Activity,
  Clock, TrendingUp, BarChart3, Zap
} from "lucide-react";
import { getVerificationLogs, type VerificationLog } from "@/services/verification";

const Dashboard: React.FC = () => {
  const [logs, setLogs] = useState<VerificationLog[]>([]);

  useEffect(() => {
    setLogs(getVerificationLogs());
  }, []);

  const totalVerifications = logs.length;
  const successfulVerifications = logs.filter(l => l.result.matched).length;
  const failedVerifications = totalVerifications - successfulVerifications;
  const successRate = totalVerifications > 0 ? Math.round((successfulVerifications / totalVerifications) * 100) : 0;
  const avgConfidence = logs.length > 0
    ? Math.round(logs.reduce((acc, l) => acc + (l.result.confidence || 0) * 100, 0) / logs.length)
    : 0;

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Dashboard – FaceTrust AI"
        description="Monitor verification activity, success rates, and system performance on the FaceTrust AI dashboard."
        canonical={window.location.origin + "/dashboard"}
      />

      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" />Home</Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">System overview & analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              All Systems Operational
            </div>
            <Button asChild size="sm">
              <Link to="/verify"><Camera className="w-4 h-4 mr-2" />New Verification</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Total Verifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalVerifications}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" /> Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{successRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">{successfulVerifications} successful</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Avg Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgConfidence}%</div>
              <p className="text-xs text-muted-foreground mt-1">Across all matches</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4" /> Avg Speed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">&lt;500ms</div>
              <p className="text-xs text-muted-foreground mt-1">Processing time</p>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No verification activity yet</p>
                  <p className="text-sm mt-1">Go to the verification page to start scanning.</p>
                  <Button asChild className="mt-4" size="sm">
                    <Link to="/verify">Start First Verification</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.slice(0, 8).map((log, i) => (
                    <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-3">
                        {log.result.matched ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-destructive" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {log.result.identity?.full_name || "Unknown Subject"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString("en-US", {
                              month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {log.result.confidence && (
                          <Badge variant="outline" className="text-xs">
                            {Math.round(log.result.confidence * 100)}%
                          </Badge>
                        )}
                        <Badge variant={log.result.matched ? "default" : "destructive"} className="text-xs">
                          {log.result.matched ? "Verified" : "Failed"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4" /> System Modules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Face Detection", status: "Active" },
                  { name: "Liveness Check", status: "Active" },
                  { name: "LBPH Recognition", status: "Active" },
                  { name: "Document Validation", status: "Active" },
                  { name: "OSINT Scanner", status: "Active" },
                  { name: "Fraud Detection", status: "Active" },
                ].map((module) => (
                  <div key={module.name} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{module.name}</span>
                    <Badge variant="default" className="text-xs">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5" />
                      {module.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4" /> Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start" size="sm">
                  <Link to="/verify"><Camera className="w-4 h-4 mr-2" />New Verification</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start" size="sm">
                  <Link to="/how-it-works"><Activity className="w-4 h-4 mr-2" />System Flow</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start" size="sm">
                  <Link to="/login"><Shield className="w-4 h-4 mr-2" />Officer Login</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        <div className="text-center text-sm text-muted-foreground py-4">
          <p>FaceTrust AI v1.0.0 • Dashboard • Demo Mode Active</p>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
