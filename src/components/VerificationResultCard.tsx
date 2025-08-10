import React from "react";
import { CheckCircle2, ShieldAlert, AlertCircle, User, Phone, Mail, MapPin, Calendar, Shield, Clock, Camera, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VerificationResult {
  matched: boolean;
  confidence?: number;
  liveness?: number;
  identity?: {
    full_name: string;
    nin?: string;
    license_number?: string;
    gender?: string;
    age_estimate?: number;
    phone?: string;
    email?: string;
    address?: string;
    social_media?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
    public_records?: {
      voter_registration?: boolean;
      business_registration?: string;
      education?: string[];
      employment?: string;
    };
    verification_history?: {
      last_verified?: string;
      verification_count?: number;
      risk_score?: number;
    };
  } | null;
  reason?: string;
  fraud_indicators?: {
    multiple_attempts?: boolean;
    suspicious_timing?: boolean;
    device_fingerprint_mismatch?: boolean;
    location_anomaly?: boolean;
  };
  processing_time?: number;
  image_quality?: {
    brightness?: number;
    sharpness?: number;
    face_size?: number;
    angle_quality?: number;
  };
}

const pct = (v?: number) => (typeof v === "number" ? `${Math.round(v * 100)}%` : "-");
const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getRiskLevel = (score?: number) => {
  if (!score) return { level: "Unknown", color: "bg-gray-100 text-gray-700" };
  if (score <= 20) return { level: "Low Risk", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
  if (score <= 50) return { level: "Medium Risk", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" };
  return { level: "High Risk", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
};

const getQualityLevel = (score?: number) => {
  if (!score) return { level: "Unknown", color: "bg-gray-100 text-gray-700" };
  if (score >= 0.8) return { level: "Excellent", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
  if (score >= 0.6) return { level: "Good", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
  if (score >= 0.4) return { level: "Fair", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" };
  return { level: "Poor", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
};

const VerificationResultCard: React.FC<{ result: VerificationResult | null; loading?: boolean }>
  = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="rounded-lg border p-6 shadow-sm animate-pulse bg-card">
        <div className="h-6 w-40 bg-muted rounded mb-4" />
        <div className="space-y-3">
          <div className="h-4 w-64 bg-muted rounded" />
          <div className="h-4 w-52 bg-muted rounded" />
          <div className="h-4 w-48 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-lg border p-6 shadow-sm bg-card text-center">
        <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Capture a face to start verification</p>
      </div>
    );
  }

  const riskInfo = getRiskLevel(result.identity?.verification_history?.risk_score);
  const avgQuality = result.image_quality ? 
    (result.image_quality.brightness + result.image_quality.sharpness + 
     result.image_quality.face_size + result.image_quality.angle_quality) / 4 : undefined;
  const qualityInfo = getQualityLevel(avgQuality);

  return (
    <article className="rounded-lg border shadow-sm bg-card">
      {/* Header */}
      <div className="p-6 pb-4">
        <header className="flex items-center gap-3 mb-4">
          {result.matched ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : result.reason ? (
            <ShieldAlert className="w-6 h-6 text-destructive" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-500" />
          )}
          <div>
            <h3 className="text-xl font-semibold">
              {result.matched ? "Identity Verified" : result.reason ? "Verification Failed" : "No Match Found"}
            </h3>
            {result.processing_time && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Processed in {result.processing_time}ms
              </p>
            )}
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-2xl font-bold text-foreground">{pct(result.confidence)}</div>
            <div className="text-xs text-muted-foreground">Match Confidence</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-2xl font-bold text-foreground">{pct(result.liveness)}</div>
            <div className="text-xs text-muted-foreground">Liveness Score</div>
          </div>
        </div>

        {/* Reason for failure */}
        {result.reason && (
          <div className="p-3 rounded-md border bg-destructive/5 border-destructive/20 mb-4">
            <p className="text-sm text-destructive font-medium">{result.reason}</p>
          </div>
        )}
      </div>

      {/* Detailed Information Tabs */}
      {result.matched && result.identity && (
        <Tabs defaultValue="identity" className="px-6 pb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="identity">Identity</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
          </TabsList>

          <TabsContent value="identity" className="mt-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{result.identity.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {result.identity.gender && `${result.identity.gender}, `}
                    {result.identity.age_estimate && `Age: ${result.identity.age_estimate}`}
                  </p>
                </div>
              </div>

              {result.identity.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{result.identity.phone}</span>
                </div>
              )}

              {result.identity.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{result.identity.email}</span>
                </div>
              )}

              {result.identity.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{result.identity.address}</span>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Official Documents</h4>
              <div className="space-y-2">
                {result.identity.nin && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">NIN:</span>
                    <span className="text-sm font-mono">{result.identity.nin}</span>
                  </div>
                )}
                {result.identity.license_number && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">License:</span>
                    <span className="text-sm font-mono">{result.identity.license_number}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media */}
            {result.identity.social_media && Object.keys(result.identity.social_media).length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Social Media Presence</h4>
                  <div className="space-y-1">
                    {Object.entries(result.identity.social_media).map(([platform, url]) => (
                      <div key={platform} className="flex justify-between">
                        <span className="text-sm text-muted-foreground capitalize">{platform}:</span>
                        <a href={`https://${url}`} target="_blank" rel="noopener noreferrer" 
                           className="text-sm text-blue-600 hover:underline truncate max-w-48">
                          {url}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="records" className="mt-4 space-y-4">
            {result.identity.public_records && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Civic Records</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={result.identity.public_records.voter_registration ? "default" : "secondary"}>
                      {result.identity.public_records.voter_registration ? "Registered Voter" : "Not Registered"}
                    </Badge>
                  </div>
                </div>

                {result.identity.public_records.business_registration && (
                  <div>
                    <h4 className="font-medium mb-2">Business Registration</h4>
                    <p className="text-sm text-muted-foreground">{result.identity.public_records.business_registration}</p>
                  </div>
                )}

                {result.identity.public_records.employment && (
                  <div>
                    <h4 className="font-medium mb-2">Employment</h4>
                    <p className="text-sm text-muted-foreground">{result.identity.public_records.employment}</p>
                  </div>
                )}

                {result.identity.public_records.education && result.identity.public_records.education.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Education</h4>
                    <ul className="space-y-1">
                      {result.identity.public_records.education.map((edu, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">• {edu}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="security" className="mt-4 space-y-4">
            {result.identity.verification_history && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-lg font-bold text-foreground">
                      {result.identity.verification_history.verification_count || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Verifications</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <Badge className={riskInfo.color}>
                      {riskInfo.level}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">Risk Assessment</div>
                  </div>
                </div>

                {result.identity.verification_history.last_verified && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Last Verified</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(result.identity.verification_history.last_verified)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Fraud Indicators */}
            {result.fraud_indicators && Object.values(result.fraud_indicators).some(Boolean) && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-500" />
                    Security Alerts
                  </h4>
                  <div className="space-y-2">
                    {result.fraud_indicators.multiple_attempts && (
                      <Badge variant="destructive">Multiple Attempts Detected</Badge>
                    )}
                    {result.fraud_indicators.suspicious_timing && (
                      <Badge variant="destructive">Suspicious Timing Pattern</Badge>
                    )}
                    {result.fraud_indicators.device_fingerprint_mismatch && (
                      <Badge variant="destructive">Device Mismatch</Badge>
                    )}
                    {result.fraud_indicators.location_anomaly && (
                      <Badge variant="destructive">Location Anomaly</Badge>
                    )}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="technical" className="mt-4 space-y-4">
            {/* Image Quality Analysis */}
            {result.image_quality && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Image Quality Analysis
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Overall Quality:</span>
                    <Badge className={qualityInfo.color}>{qualityInfo.level}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 rounded bg-muted/30">
                      <div className="text-sm font-medium">{pct(result.image_quality.brightness)}</div>
                      <div className="text-xs text-muted-foreground">Brightness</div>
                    </div>
                    <div className="text-center p-2 rounded bg-muted/30">
                      <div className="text-sm font-medium">{pct(result.image_quality.sharpness)}</div>
                      <div className="text-xs text-muted-foreground">Sharpness</div>
                    </div>
                    <div className="text-center p-2 rounded bg-muted/30">
                      <div className="text-sm font-medium">{pct(result.image_quality.face_size)}</div>
                      <div className="text-xs text-muted-foreground">Face Size</div>
                    </div>
                    <div className="text-center p-2 rounded bg-muted/30">
                      <div className="text-sm font-medium">{pct(result.image_quality.angle_quality)}</div>
                      <div className="text-xs text-muted-foreground">Angle</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Performance Metrics */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Performance Metrics
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Processing Time:</span>
                  <span className="text-sm font-mono">{result.processing_time}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Match Confidence:</span>
                  <span className="text-sm font-mono">{pct(result.confidence)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Liveness Score:</span>
                  <span className="text-sm font-mono">{pct(result.liveness)}</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Non-matched results - show technical info */}
      {!result.matched && (
        <div className="px-6 pb-6">
          <Tabs defaultValue="technical">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="technical">Technical Details</TabsTrigger>
              <TabsTrigger value="security">Security Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="technical" className="mt-4 space-y-4">
              {result.image_quality && (
                <div>
                  <h4 className="font-medium mb-3">Image Quality Analysis</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 rounded bg-muted/30">
                      <div className="text-sm font-medium">{pct(result.image_quality.brightness)}</div>
                      <div className="text-xs text-muted-foreground">Brightness</div>
                    </div>
                    <div className="text-center p-2 rounded bg-muted/30">
                      <div className="text-sm font-medium">{pct(result.image_quality.sharpness)}</div>
                      <div className="text-xs text-muted-foreground">Sharpness</div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="security" className="mt-4">
              {result.fraud_indicators && Object.values(result.fraud_indicators).some(Boolean) && (
                <div>
                  <h4 className="font-medium mb-2">Security Alerts</h4>
                  <div className="space-y-2">
                    {Object.entries(result.fraud_indicators).map(([key, value]) => 
                      value && (
                        <Badge key={key} variant="destructive">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </article>
  );
};

export default VerificationResultCard;