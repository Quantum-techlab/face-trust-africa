// Service to integrate with Python face recognition API
export interface FaceRecognitionResponse {
  matched: boolean;
  confidence?: number;
  liveness?: number;
  identity?: any;
  reason?: string;
  processing_time?: number;
  image_quality?: {
    brightness?: number;
    sharpness?: number;
    face_size?: number;
    angle_quality?: number;
  };
}

const host =
  typeof window !== "undefined" && window.location && window.location.hostname
    ? window.location.hostname
    : "localhost";
const DEFAULT_BASE_URL = `http://${host}:5000`;
const CANDIDATE_BASE_URLS = Array.from(
  new Set([DEFAULT_BASE_URL, "http://localhost:5000", "http://127.0.0.1:5000"])
);

export class FaceRecognitionService {
  private static instance: FaceRecognitionService;
  private isApiAvailable = false;
  private lastGoodBaseUrl: string | null = null;

  private constructor() {
    this.checkApiHealth();
  }

  public static getInstance(): FaceRecognitionService {
    if (!FaceRecognitionService.instance) {
      FaceRecognitionService.instance = new FaceRecognitionService();
    }
    return FaceRecognitionService.instance;
  }

  private async fetchWithFallback(
    path: string,
    init?: RequestInit
  ): Promise<{ data: any; baseUrl: string; response: Response }> {
    let lastError: any = null;
    const bases = this.lastGoodBaseUrl
      ? [
          this.lastGoodBaseUrl,
          ...CANDIDATE_BASE_URLS.filter((b) => b !== this.lastGoodBaseUrl),
        ]
      : CANDIDATE_BASE_URLS;

    for (const base of bases) {
      try {
        const res = await fetch(`${base}${path}`, init);
        if (!res.ok) {
          lastError = new Error(`HTTP ${res.status}`);
          continue;
        }
        const data = await res.json();
        this.lastGoodBaseUrl = base;
        return { data, baseUrl: base, response: res };
      } catch (err) {
        lastError = err;
        // try next base
      }
    }
    throw lastError ?? new Error("No backend reachable");
  }

  private async checkApiHealth(): Promise<void> {
    try {
      const { data, baseUrl } = await this.fetchWithFallback("/health", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10000),
      });
      console.log("Checking API health at:", `${baseUrl}/health`);
      this.isApiAvailable =
        !!data?.model_loaded && (data?.known_faces ?? 0) > 0;
      console.log("Face Recognition API Status:", data);
      console.log("API Available:", this.isApiAvailable, "Base URL:", baseUrl);
    } catch (error) {
      console.warn("Face Recognition API not available:", error);
      this.isApiAvailable = false;
    }
  }

  public async recognizeFace(
    imageDataUrl: string
  ): Promise<FaceRecognitionResponse> {
    console.log(
      "Starting face recognition, API available:",
      this.isApiAvailable
    );

    // Try the API even if initial health check failed; it may have started after page load
    if (!this.isApiAvailable) {
      console.log("API not available, checking health...");
      await this.checkApiHealth();
    }

    try {
      const { data: result, baseUrl } = await this.fetchWithFallback(
        "/recognize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageDataUrl }),
          signal: AbortSignal.timeout(30000),
        }
      );
      console.log("Sent recognition request to:", `${baseUrl}/recognize`);
      console.log("Recognition result:", result);
      return result;
    } catch (error) {
      console.error("Face recognition API error:", error);
      // Recheck health in background so the next attempt may work
      this.checkApiHealth().catch(() => {}); // Don't block on this

      // Fallback to mock verification
      console.log("Using mock verification due to API error");
      return this.mockVerification();
    }
  }

  public async getTeamMembers(): Promise<any> {
    // Always try to check health first
    await this.checkApiHealth();

    try {
      const teamRes = await this.fetchWithFallback("/team", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10000),
      });
      let data = teamRes.data ?? { team_members: [], team_data: {} };
      console.log("Fetching team members from:", `${teamRes.baseUrl}/team`);

      // If empty, try health as a fallback source
      const count = Array.isArray(data.team_members)
        ? data.team_members.length
        : 0;
      if (count === 0) {
        try {
          const healthRes = await this.fetchWithFallback("/health", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(8000),
          });
          const h = healthRes.data;
          if (h) {
            data = {
              team_members: Array.isArray(h.team_members) ? h.team_members : [],
              team_data: {},
            };
          }
        } catch (_) {
          // ignore
        }
      }
      console.log("Team members response (final):", data);
      return data;
    } catch (error) {
      console.error("Error fetching team members:", error);
      // Return empty data instead of failing silently
      return { team_members: [], team_data: {} };
    }
  }

  public async uploadTeamMember(
    name: string,
    imageDataUrl: string,
    teamData: any
  ): Promise<any> {
    if (!this.isApiAvailable) {
      await this.checkApiHealth();
      if (!this.isApiAvailable) {
        throw new Error("Face Recognition API not available");
      }
    }

    try {
      const base = this.lastGoodBaseUrl ?? DEFAULT_BASE_URL;
      const response = await fetch(`${base}/upload_team_member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          image: imageDataUrl,
          team_data: teamData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Upload team member error:", error);
      throw error;
    }
  }

  private mockVerification(): FaceRecognitionResponse {
    // Return mock data when Python API is not available
    console.warn("Using mock verification - Python backend not reachable");
    return {
      matched: false,
      confidence: 0.3,
      liveness: 0.8,
      identity: null,
      reason:
        "❌ Python Face Recognition API not reachable - Start backend: python simple_backend.py",
      processing_time: 500,
      image_quality: {
        brightness: 0.75,
        sharpness: 0.8,
        face_size: 0.7,
        angle_quality: 0.75,
      },
    };
  }

  public isAvailable(): boolean {
    return this.isApiAvailable;
  }

  public async forceHealthCheck(): Promise<boolean> {
    await this.checkApiHealth();
    return this.isApiAvailable;
  }

  public getApiUrl(): string {
    return this.lastGoodBaseUrl ?? DEFAULT_BASE_URL;
  }
}

// Export singleton instance
export const faceRecognitionService = FaceRecognitionService.getInstance();
