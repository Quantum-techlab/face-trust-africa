export interface VerificationResponse {
  matched: boolean;
  confidence?: number; // 0..1
  liveness?: number;   // 0..1
  identity?: {
    full_name: string;
    nin?: string;
    license_number?: string;
  } | null;
  reason?: string;
}

// TEMP STUB: Replace with calls to Supabase Edge Functions once Supabase is connected
export async function verifyFace(_imageDataUrl: string): Promise<VerificationResponse> {
  // Simulate latency for poor networks
  await new Promise((r) => setTimeout(r, 900));

  // Randomized demo outcome
  const matched = Math.random() > 0.5;
  const confidence = Math.random() * (matched ? 0.4 : 0.3) + (matched ? 0.6 : 0.2);
  const liveness = Math.random() * 0.3 + 0.6;

  if (!matched) {
    return { matched, confidence, liveness, identity: null, reason: Math.random() > 0.5 ? "Potential spoof detected" : undefined };
  }

  return {
    matched,
    confidence,
    liveness,
    identity: {
      full_name: "Sample User",
      nin: "1234-5678-9012",
      license_number: "ABJ-123456",
    },
  };
}

export async function logVerification(_payload: any) {
  // TODO: Send to Supabase table once connected
  console.log("[logVerification]", _payload);
}
