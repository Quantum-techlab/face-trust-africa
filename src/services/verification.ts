import { faceRecognitionService } from './faceRecognitionService';

export interface VerificationResponse {
  matched: boolean;
  confidence?: number; // 0..1
  liveness?: number;   // 0..1
  identity?: {
    full_name: string;
    // Name breakdown
    first_name?: string;
    middle_name?: string;
    last_name?: string;

    // Government IDs
    nin?: string; // National Identity Number
    license_number?: string; // Driver's License Number
    passport_number?: string;
    unique_id_number?: string; // Generic unique ID when applicable

    // Demographics
    gender?: string;
    date_of_birth?: string; // ISO date string
    nationality?: string;
    age_estimate?: number;

    // Contact & Address (city-level granularity for MVP)
    phone?: string;
    email?: string;
    address?: string; // Kept for backward compatibility
    address_city?: string;
    address_state?: string;
    address_country?: string;

    // Social
    social_media?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };

    // Public Records
    public_records?: {
      voter_registration?: boolean;
      business_registration?: string;
      education?: string[];
      employment?: string;
    };

    // Official Records / Status
    drivers_license_status?: "Valid" | "Expired" | "Suspended";
    passport_status?: "Valid" | "Expired";
    voters_id_status?: "Active" | "Inactive";

    // Risk & verification history
    verification_history?: {
      last_verified?: string;
      verification_count?: number;
      risk_score?: number; // 0-100, lower is better
    };
  } | null;
  reason?: string;
  fraud_indicators?: {
    multiple_attempts?: boolean;
    suspicious_timing?: boolean;
    device_fingerprint_mismatch?: boolean;
    location_anomaly?: boolean;
  };
  processing_time?: number; // milliseconds
  image_quality?: {
    brightness?: number;
    sharpness?: number;
    face_size?: number;
    angle_quality?: number;
  };
}

export interface VerificationLog {
  id: string;
  timestamp: number;
  officer_id?: string;
  result: VerificationResponse;
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  device_info?: {
    user_agent: string;
    ip_address?: string;
    device_type: string;
  };
}

// Enhanced mock data for demonstration
const mockIdentities: NonNullable<VerificationResponse["identity"]>[] = [
  {
    full_name: "Adebayo Johnson",
    first_name: "Adebayo",
    middle_name: "",
    last_name: "Johnson",
    nin: "12345678901",
    unique_id_number: "NIN-12345678901",
    license_number: "LAG-AB123456",
    drivers_license_status: "Valid",
    passport_number: "A12345678",
    passport_status: "Valid",
    voters_id_status: "Active",
    gender: "Male",
    date_of_birth: "1992-05-14",
    nationality: "Nigerian",
    age_estimate: 32,
    phone: "+234-801-234-5678",
    email: "adebayo.johnson@email.com",
    address: "Lagos, Lagos State, Nigeria",
    address_city: "Lagos",
    address_state: "Lagos State",
    address_country: "Nigeria",
    social_media: {
      facebook: "facebook.com/adebayo.johnson",
      twitter: "@adebayoj",
      linkedin: "linkedin.com/in/adebayo-johnson"
    },
    public_records: {
      voter_registration: true,
      business_registration: "RC123456 - Johnson Enterprises",
      education: ["University of Lagos - Computer Science", "Lagos Business School - MBA"],
      employment: "Senior Software Engineer at TechCorp Nigeria"
    },
    verification_history: {
      last_verified: "2024-01-15T10:30:00Z",
      verification_count: 12,
      risk_score: 15
    }
  },
  {
    full_name: "Fatima Abdullahi",
    first_name: "Fatima",
    middle_name: "",
    last_name: "Abdullahi",
    nin: "98765432109",
    unique_id_number: "NIN-98765432109",
    license_number: "ABJ-CD789012",
    drivers_license_status: "Valid",
    passport_number: "B98765432",
    passport_status: "Valid",
    voters_id_status: "Active",
    gender: "Female",
    date_of_birth: "1997-09-22",
    nationality: "Nigerian",
    age_estimate: 28,
    phone: "+234-803-987-6543",
    email: "fatima.abdullahi@email.com",
    address: "Abuja, FCT, Nigeria",
    address_city: "Abuja",
    address_state: "FCT",
    address_country: "Nigeria",
    social_media: {
      instagram: "@fatima_abdullahi",
      linkedin: "linkedin.com/in/fatima-abdullahi"
    },
    public_records: {
      voter_registration: true,
      education: ["Ahmadu Bello University - Medicine"],
      employment: "Medical Doctor at National Hospital Abuja"
    },
    verification_history: {
      last_verified: "2024-01-20T14:45:00Z",
      verification_count: 8,
      risk_score: 5
    }
  },
  {
    full_name: "Chinedu Okafor",
    first_name: "Chinedu",
    middle_name: "",
    last_name: "Okafor",
    nin: "11223344556",
    unique_id_number: "NIN-11223344556",
    license_number: "PH-EF345678",
    drivers_license_status: "Suspended",
    passport_number: "P56473829",
    passport_status: "Expired",
    voters_id_status: "Inactive",
    gender: "Male",
    date_of_birth: "1989-12-03",
    nationality: "Nigerian",
    age_estimate: 35,
    phone: "+234-805-111-2233",
    email: "chinedu.okafor@email.com",
    address: "Port Harcourt, Rivers State, Nigeria",
    address_city: "Port Harcourt",
    address_state: "Rivers State",
    address_country: "Nigeria",
    social_media: {
      facebook: "facebook.com/chinedu.okafor",
      twitter: "@chineduo",
      instagram: "@chinedu_okafor"
    },
    public_records: {
      voter_registration: true,
      business_registration: "RC789012 - Okafor Oil Services Ltd",
      education: ["University of Port Harcourt - Petroleum Engineering"],
      employment: "CEO at Okafor Oil Services Ltd"
    },
    verification_history: {
      last_verified: "2024-01-18T09:15:00Z",
      verification_count: 25,
      risk_score: 8
    }
  }
];

// Simulate AI processing with realistic delays and outcomes
export async function verifyFace(imageDataUrl: string): Promise<VerificationResponse> {
  const startTime = Date.now();
  
  // Try Python face recognition API first
  try {
    const apiResult = await faceRecognitionService.recognizeFace(imageDataUrl);
    // Always prefer API result if reachable (even if no match)
    return {
      ...apiResult,
      processing_time: Date.now() - startTime
    };
  } catch (error) {
    console.log('Python API error, falling back to mock:', error);
  }
  
  // Simulate network latency and AI processing time
  await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
  
  const processingTime = Date.now() - startTime;
  
  // Simulate image quality analysis
  const imageQuality = {
    brightness: Math.random() * 0.4 + 0.6, // 0.6-1.0
    sharpness: Math.random() * 0.3 + 0.7,   // 0.7-1.0
    face_size: Math.random() * 0.5 + 0.5,   // 0.5-1.0
    angle_quality: Math.random() * 0.4 + 0.6 // 0.6-1.0
  };
  
  // Determine if verification should succeed based on image quality
  const qualityScore = (imageQuality.brightness + imageQuality.sharpness + 
                       imageQuality.face_size + imageQuality.angle_quality) / 4;
  
  const shouldMatch = qualityScore > 0.65 && Math.random() > 0.3;
  const liveness = Math.random() * 0.3 + 0.65; // 0.65-0.95
  
  // Simulate liveness detection failure
  if (liveness < 0.7) {
    return {
      matched: false,
      confidence: Math.random() * 0.3 + 0.2,
      liveness,
      identity: null,
      reason: "Liveness check failed - potential spoof detected",
      fraud_indicators: {
        suspicious_timing: Math.random() > 0.7,
        device_fingerprint_mismatch: Math.random() > 0.8
      },
      processing_time: processingTime,
      image_quality: imageQuality
    };
  }
  
  if (!shouldMatch) {
    const fraudIndicators = {
      multiple_attempts: Math.random() > 0.6,
      suspicious_timing: Math.random() > 0.7,
      device_fingerprint_mismatch: Math.random() > 0.8,
      location_anomaly: Math.random() > 0.9
    };
    
    return {
      matched: false,
      confidence: Math.random() * 0.4 + 0.1, // 0.1-0.5
      liveness,
      identity: null,
      reason: Math.random() > 0.5 ? "No matching identity found in database" : "Face match confidence too low",
      fraud_indicators: Object.values(fraudIndicators).some(Boolean) ? fraudIndicators : undefined,
      processing_time: processingTime,
      image_quality: imageQuality
    };
  }
  
  // Successful match - select random identity
  const selectedIdentity = mockIdentities[Math.floor(Math.random() * mockIdentities.length)];
  const confidence = Math.random() * 0.25 + 0.75; // 0.75-1.0 for successful matches
  
  return {
    matched: true,
    confidence,
    liveness,
    identity: selectedIdentity,
    processing_time: processingTime,
    image_quality: imageQuality
  };
}

// Enhanced logging with more details
export async function logVerification(payload: {
  ts: number;
  res: VerificationResponse;
  officerId?: string;
  location?: { latitude?: number; longitude?: number; address?: string };
}): Promise<void> {
  const logEntry: VerificationLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: payload.ts,
    officer_id: payload.officerId || "demo_officer",
    result: payload.res,
    location: payload.location,
    device_info: {
      user_agent: navigator.userAgent,
      device_type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? "mobile" : "desktop"
    }
  };
  
  // Store in localStorage for demo purposes (replace with Supabase later)
  const existingLogs = JSON.parse(localStorage.getItem('verification_logs') || '[]');
  existingLogs.unshift(logEntry);
  
  // Keep only last 50 logs
  if (existingLogs.length > 50) {
    existingLogs.splice(50);
  }
  
  localStorage.setItem('verification_logs', JSON.stringify(existingLogs));
  
  console.log("[logVerification] Stored:", logEntry);
}

// Get verification logs for display
export function getVerificationLogs(): VerificationLog[] {
  return JSON.parse(localStorage.getItem('verification_logs') || '[]');
}

// Clear logs (for testing)
export function clearVerificationLogs(): void {
  localStorage.removeItem('verification_logs');
}