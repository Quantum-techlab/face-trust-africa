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

const DEFAULT_BASE_URL = "http://localhost:5000";
const CANDIDATE_BASE_URLS = [
  "http://localhost:5000",
  "http://127.0.0.1:5000",
  "http://0.0.0.0:5000"
];

export class FaceRecognitionService {
  private static instance: FaceRecognitionService;
  private isApiAvailable = false;
  private lastGoodBaseUrl: string | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;

  private constructor() {
    this.checkApiHealth();
    this.startHealthCheckInterval();
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
        console.log(`Attempting connection to: ${base}${path}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const res = await fetch(`${base}${path}`, {
          ...init,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          lastError = new Error(`HTTP ${res.status}: ${res.statusText}`);
          console.warn(`Failed to connect to ${base}${path}: ${lastError.message}`);
          continue;
        }
        
        const data = await res.json();
        this.lastGoodBaseUrl = base;
        console.log(`✓ Successfully connected to: ${base}${path}`);
        return { data, baseUrl: base, response: res };
      } catch (err: any) {
        lastError = err;
        console.warn(`Connection failed to ${base}${path}:`, err.message);
        // Continue to next base
      }
    }
    throw lastError ?? new Error("No Python backend reachable on any port");
  }

  private async checkApiHealth(): Promise<void> {
    try {
      const { data, baseUrl } = await this.fetchWithFallback("/health", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(8000),
      });
      console.log("✓ API health check successful at:", `${baseUrl}/health`);
      this.isApiAvailable =
        !!data?.model_loaded && (data?.known_faces ?? 0) > 0;
      this.reconnectAttempts = 0; // Reset on successful connection
      console.log("Face Recognition API Status:", data);
      console.log("API Available:", this.isApiAvailable, "Base URL:", baseUrl);
    } catch (error) {
      this.reconnectAttempts++;
      console.warn(`✗ Face Recognition API not available (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}):`, error);
      this.isApiAvailable = false;
      
      // If we've exceeded max attempts, stop trying for a while
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.warn("Max reconnect attempts reached. Will retry in 30 seconds...");
        setTimeout(() => {
          this.reconnectAttempts = 0;
        }, 30000);
      }
    }
  }

  private startHealthCheckInterval(): void {
    // Check health every 15 seconds
    this.healthCheckInterval = setInterval(() => {
      if (!this.isApiAvailable && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.checkApiHealth();
      }
    }, 15000);
  }

  public async recognizeFace(
    imageDataUrl: string
  ): Promise<FaceRecognitionResponse> {
    console.log("🔍 Starting face recognition...");

    // Always try a fresh health check before recognition
    if (!this.isApiAvailable) {
      console.log("⚡ API not available, performing health check...");
      await this.checkApiHealth();
      
      if (!this.isApiAvailable) {
        console.log("❌ API still not available after health check");
        return this.mockVerification();
      }
    }

    try {
      const { data: result, baseUrl } = await this.fetchWithFallback(
        "/recognize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageDataUrl }),
        }
      );
      console.log("✓ Recognition successful:", `${baseUrl}/recognize`);
      console.log("📊 Recognition result:", result);
      return result;
    } catch (error: any) {
      console.error("❌ Face recognition API error:", error);
      
      // Mark API as unavailable and schedule a health check
      this.isApiAvailable = false;
      setTimeout(() => this.checkApiHealth(), 2000);

      // Return mock with detailed error info
      return {
        ...this.mockVerification(),
        reason: `❌ Backend Connection Failed: ${error.message || 'Unknown error'}\n\n🔧 Troubleshooting:\n1. Start Python backend: python start_backend.py\n2. Check if port 5000 is available\n3. Verify face recognition models are loaded`,
      };
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
    console.warn("⚠️ Using mock verification - Python backend not reachable");
    return {
      matched: false,
      confidence: 0.0,
      liveness: 0.0,
      identity: null,
      reason: "❌ Python Face Recognition Backend Disconnected",
      processing_time: 100,
      image_quality: {
        brightness: 0.0,
        sharpness: 0.0,
        face_size: 0.0,
        angle_quality: 0.0,
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
