import React, { useState, useEffect } from "react";
import { faceRecognitionService } from "@/services/faceRecognitionService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Server,
  Users,
} from "lucide-react";

const BackendDiagnostic: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [teamData, setTeamData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    setIsChecking(true);
    setError(null);

    try {
      console.log("=== Backend Diagnostic Started ===");

      // Check API availability
      const apiUrl = faceRecognitionService.getApiUrl();
      console.log("API URL:", apiUrl);

      // Force health check
      const isAvailable = await faceRecognitionService.forceHealthCheck();
      console.log("API Available:", isAvailable);

      // Get health status directly
      const healthResponse = await fetch(`${apiUrl}/health`);
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        setStatus(healthData);
        console.log("Health Data:", healthData);
      } else {
        throw new Error(`Health check failed: ${healthResponse.status}`);
      }

      // Get team data
      const team = await faceRecognitionService.getTeamMembers();
      setTeamData(team);
      console.log("Team Data:", team);
    } catch (err: any) {
      console.error("Diagnostic error:", err);
      setError(err.message);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="w-5 h-5" />
          Backend Connection Diagnostic
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>API URL:</span>
          <code className="text-sm bg-muted px-2 py-1 rounded">
            {faceRecognitionService.getApiUrl()}
          </code>
        </div>

        <div className="flex items-center justify-between">
          <span>Connection Status:</span>
          <Badge
            variant={status?.status === "healthy" ? "default" : "destructive"}
          >
            {status?.status === "healthy" ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1" /> Connected
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-1" /> Disconnected
              </>
            )}
          </Badge>
        </div>

        {status && (
          <>
            <div className="flex items-center justify-between">
              <span>Model Trained:</span>
              <Badge variant={status.model_trained ? "default" : "secondary"}>
                {status.model_trained ? "Yes" : "No"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span>Known Faces:</span>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <Badge variant="outline">{status.known_faces || 0}</Badge>
              </div>
            </div>

            {status.team_members && status.team_members.length > 0 && (
              <div>
                <span className="font-medium">Team Members:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {status.team_members.map((member: string) => (
                    <Badge key={member} variant="outline" className="text-xs">
                      {member}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Connection Error</span>
            </div>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            <p className="text-xs text-red-500 mt-2">
              Make sure the backend is running:{" "}
              <code>python simple_backend.py</code>
            </p>
          </div>
        )}

        <Button
          onClick={checkConnection}
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Checking...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" /> Recheck Connection
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground">
          <p>
            <strong>If you see "0 known faces":</strong>
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>The Python backend is not running</li>
            <li>
              Start it with: <code>python simple_backend.py</code>
            </li>
            <li>Check that it shows "✓ Model ready with 2 members"</li>
            <li>
              Verify browser can reach:{" "}
              <code>http://localhost:5000/health</code>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackendDiagnostic;
