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
        <div className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center gap-3">
            {status.isOnline ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <div>
              <p className="font-medium">
                {status.isOnline ? "Connected" : "Disconnected"}
              </p>
              <p className="text-sm text-muted-foreground">
                Backend API Status
              </p>
            </div>
          </div>
          <Badge variant={status.isOnline ? "default" : "destructive"}>
            {status.isOnline ? "Online" : "Offline"}
          </Badge>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Endpoint:</p>
          <code className="block p-2 bg-muted rounded text-sm break-all">
            https://face-trust-africa-production.up.railway.app/health
          </code>
        </div>

        {status.responseTime && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <span className="text-sm font-medium">Response Time:</span>
            <Badge variant="outline">{status.responseTime}ms</Badge>
          </div>
        )}

        {status.lastChecked && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <span className="text-sm font-medium">Last Checked:</span>
            <span className="text-sm text-muted-foreground">
              {status.lastChecked.toLocaleTimeString()}
            </span>
          </div>
        )}

        {status.error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  Connection Error
                </p>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  {status.error}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Troubleshooting: If the backend is offline, check Railway deployment
            status or try refreshing in a few moments.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackendDiagnostic;
