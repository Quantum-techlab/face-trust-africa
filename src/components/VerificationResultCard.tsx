import React from "react";
import { CheckCircle2, ShieldAlert, AlertCircle } from "lucide-react";

interface VerificationResult {
  matched: boolean;
  confidence?: number;
  liveness?: number;
  identity?: {
    full_name: string;
    nin?: string;
    license_number?: string;
  } | null;
  reason?: string;
}

const pct = (v?: number) => (typeof v === "number" ? `${Math.round(v * 100)}%` : "-");

const VerificationResultCard: React.FC<{ result: VerificationResult | null; loading?: boolean }>
  = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="rounded-lg border p-4 shadow-sm animate-pulse bg-card">
        <div className="h-6 w-40 bg-muted rounded" />
        <div className="mt-3 h-4 w-64 bg-muted rounded" />
        <div className="mt-2 h-4 w-52 bg-muted rounded" />
      </div>
    );
  }

  if (!result) return null;

  return (
    <article className="rounded-lg border p-4 shadow-sm bg-card">
      <header className="flex items-center gap-2">
        {result.matched ? (
          <CheckCircle2 className="text-green-600" />
        ) : result.reason ? (
          <ShieldAlert className="text-destructive" />
        ) : (
          <AlertCircle className="text-amber-500" />
        )}
        <h3 className="text-lg font-semibold">
          {result.matched ? "Identity Verified" : result.reason ? "Verification Rejected" : "No Match Found"}
        </h3>
      </header>
      <section className="mt-3 grid gap-2 text-sm text-muted-foreground">
        <p>Match confidence: <span className="font-medium text-foreground">{pct(result.confidence)}</span></p>
        <p>Liveness score: <span className="font-medium text-foreground">{pct(result.liveness)}</span></p>
        {result.identity && (
          <div className="mt-2 rounded-md border bg-muted/30 p-3 text-foreground">
            <p className="font-medium">{result.identity.full_name}</p>
            {result.identity.nin && <p className="text-sm text-muted-foreground">NIN: {result.identity.nin}</p>}
            {result.identity.license_number && <p className="text-sm text-muted-foreground">License: {result.identity.license_number}</p>}
          </div>
        )}
        {result.reason && (
          <p className="text-destructive mt-2">Reason: {result.reason}</p>
        )}
      </section>
    </article>
  );
};

export default VerificationResultCard;
