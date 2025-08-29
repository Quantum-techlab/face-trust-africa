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

const host = (typeof window !== 'undefined' && window.location && window.location.hostname) ? window.location.hostname : 'localhost';
const API_BASE_URL = `http://${host}:5000`;

export class FaceRecognitionService {
  private static instance: FaceRecognitionService;
  private isApiAvailable = false;

  private constructor() {
    this.checkApiHealth();
  }

  public static getInstance(): FaceRecognitionService {
    if (!FaceRecognitionService.instance) {
      FaceRecognitionService.instance = new FaceRecognitionService();
    }
    return FaceRecognitionService.instance;
  }

  private async checkApiHealth(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        this.isApiAvailable = data.model_loaded;
        console.log('Face Recognition API Status:', data);
      }
    } catch (error) {
      console.warn('Face Recognition API not available:', error);
      this.isApiAvailable = false;
    }
  }

  public async recognizeFace(imageDataUrl: string): Promise<FaceRecognitionResponse> {
    // Try the API even if initial health check failed; it may have started after page load
    if (!this.isApiAvailable) {
      await this.checkApiHealth();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/recognize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageDataUrl
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Face recognition API error:', error);
      // Recheck health in background so the next attempt may work
      try { await this.checkApiHealth(); } catch {}
      // Fallback to mock verification
      return this.mockVerification();
    }
  }

  public async getTeamMembers(): Promise<any> {
    if (!this.isApiAvailable) {
      await this.checkApiHealth();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/team`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
    
    return { team_members: [], team_data: {} };
  }

  public async uploadTeamMember(name: string, imageDataUrl: string, teamData: any): Promise<any> {
    if (!this.isApiAvailable) {
      await this.checkApiHealth();
      if (!this.isApiAvailable) {
        throw new Error('Face Recognition API not available');
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/upload_team_member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          image: imageDataUrl,
          team_data: teamData
        }),
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Upload team member error:', error);
      throw error;
    }
  }

  private mockVerification(): FaceRecognitionResponse {
    // Return mock data when Python API is not available
    return {
      matched: false,
      confidence: 0.3,
      liveness: 0.8,
      identity: null,
      reason: "Python Face Recognition API not available - using mock data",
      processing_time: 500,
      image_quality: {
        brightness: 0.75,
        sharpness: 0.80,
        face_size: 0.70,
        angle_quality: 0.75
      }
    };
  }

  public isAvailable(): boolean {
    return this.isApiAvailable;
  }
}

// Export singleton instance
export const faceRecognitionService = FaceRecognitionService.getInstance();