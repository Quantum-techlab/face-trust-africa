// Mock service for demo - hardcoded data only
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

export interface TeamMember {
  name: string;
  role: string;
  department: string;
}

export interface TeamResponse {
  team_members: TeamMember[];
  total_members: number;
}

export interface RecognitionResult {
  matched: boolean;
  identity?: {
    name: string;
    full_name: string;
    role: string;
    department: string;
  };
  confidence?: number;
  reason?: string;
  liveness?: number;
}

// Hardcoded demo data
const MOCK_DATA = {
  full_name: "Abdulrasaq Abdulrasaq",
  first_name: "Abdulrasaq",
  last_name: "Abdulrasaq",
  position: "Founder & CEO",
  department: "Executive",
  employee_id: "FT001",
  email: "abdulrasaq@facetrust.ai",
  phone: "+234-801-234-5678",
};

export class FaceRecognitionService {
  private static instance: FaceRecognitionService;

  private constructor() {
    console.log("🎭 FaceRecognitionService initialized in DEMO MODE");
    console.log("✓ Using hardcoded data for Abdulrasaq Abdulrasaq");
  }

  public static getInstance(): FaceRecognitionService {
    if (!FaceRecognitionService.instance) {
      FaceRecognitionService.instance = new FaceRecognitionService();
    }
    return FaceRecognitionService.instance;
  }

  async verifyFace(imageBase64: string): Promise<RecognitionResult> {
    // Simulate instant verification with hardcoded success
    console.log("🎭 Mock verification - instantly returning success for Abdulrasaq Abdulrasaq");
    
    return {
      matched: true,
      identity: {
        name: MOCK_DATA.first_name,
        full_name: MOCK_DATA.full_name,
        role: MOCK_DATA.position,
        department: MOCK_DATA.department,
      },
      confidence: 98.5,
      liveness: 95.2,
      reason: "Face verified successfully",
    };
  }

  async getTeamMembers(): Promise<TeamResponse> {
    // Return hardcoded team member
    return {
      team_members: [
        {
          name: MOCK_DATA.full_name,
          role: MOCK_DATA.position,
          department: MOCK_DATA.department,
        },
      ],
      total_members: 1,
    };
  }

  getApiStatus(): { isAvailable: boolean; reconnectAttempts: number } {
    return {
      isAvailable: true, // Always available in demo mode
      reconnectAttempts: 0,
    };
  }
}

export const faceRecognitionService = FaceRecognitionService.getInstance();
