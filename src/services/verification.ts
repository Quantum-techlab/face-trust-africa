export interface VerificationResponse {
  matched: boolean;
  confidence?: number; // 0..1
  liveness?: number;   // 0..1
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
const mockIdentities = [
  {
    full_name: "Adebayo Johnson",
    nin: "12345678901",
    license_number: "LAG-AB123456",
    gender: "Male",
    age_estimate: 32,
    phone: "+234-801-234-5678",
    email: "adebayo.johnson@email.com",
    address: "15 Victoria Island, Lagos State, Nigeria",
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
    nin: "98765432109",
    license_number: "ABJ-CD789012",
    gender: "Female",
    age_estimate: 28,
    phone: "+234-803-987-6543",
    email: "fatima.abdullahi@email.com",
    address: "42 Garki District, Abuja, FCT, Nigeria",
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
    nin: "11223344556",
    license_number: "PH-EF345678",
    gender: "Male",
    age_estimate: 35,
    phone: "+234-805-111-2233",
    email: "chinedu.okafor@email.com",
    address: "78 GRA Phase 2, Port Harcourt, Rivers State, Nigeria",
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
      image_quality
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
      image_quality
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
    image_quality
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