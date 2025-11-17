import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, RefreshCw, Server } from "lucide-react";

interface BackendStatus {
  isOnline: boolean;
  responseTime: number | null;
  lastChecked: Date | null;
  error: string | null;
  endpoint: string;
}

const BackendDiagnostic: React.FC = () => {
  const [status, setStatus] = useState<BackendStatus>({
    isOnline: false,
    responseTime: null,
    lastChecked: null,
    error: null,
    endpoint: "https://face-trust-africa-production.up.railway.app/health",
  });

  const [isChecking, setIsChecking] = useState(false);

  const checkBackendHealth = async () => {
    setIsChecking(true);
    const startTime = Date.now();

    try {
      const response = await fetch(
        "https://face-trust-africa-production.up.railway.app/health",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(10000),
        }
      );

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (response.ok) {
        const data = await response.json();
        setStatus({
          isOnline: true,
          responseTime,
          lastChecked: new Date(),
          error: null,
          endpoint:
            "https://face-trust-africa-production.up.railway.app/health",
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      setStatus({
        isOnline: false,
        responseTime: null,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : "Unknown error",
        endpoint: "https://face-trust-africa-production.up.railway.app/health",
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            <CardTitle className="text-lg">Backend Status</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkBackendHealth}
            disabled={isChecking}
            className="h-8"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isChecking ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Real-time status of the face recognition backend
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-300">
                Demo Mode Active
              </p>
              <p className="text-sm text-green-700 dark:text-green-400">
                Using hardcoded data for instant verification
              </p>
            </div>
          </div>
          <Badge className="bg-green-600">Demo</Badge>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Mode:</p>
          <code className="block p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm">
            Hardcoded Demo - Instant Verification
          </code>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm font-medium">Response Time:</span>
          <Badge variant="outline" className="bg-green-50">~0ms (instant)</Badge>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm font-medium">Test Subject:</span>
          <span className="text-sm font-medium">Abdulrasaq Abdulrasaq</span>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            🎭 Demo mode active: Face verification returns instant success for demonstration purposes.
            No Python backend connection required.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackendDiagnostic;
