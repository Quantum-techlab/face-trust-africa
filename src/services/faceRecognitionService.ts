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
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    role: string;
    department: string;
    
    // National IDs
    nin?: string;
    unique_id_number?: string;
    
    // Driver's License
    license_number?: string;
    drivers_license_status?: "Valid" | "Expired" | "Suspended";
    license_issue_date?: string;
    license_expiry_date?: string;
    license_class?: string;
    
    // Passport
    passport_number?: string;
    passport_status?: "Valid" | "Expired";
    passport_issue_date?: string;
    passport_expiry_date?: string;
    passport_issuing_authority?: string;
    
    // Voter's Card
    voters_id_number?: string;
    voters_id_status?: "Active" | "Inactive";
    polling_unit?: string;
    
    // Personal
    gender?: string;
    date_of_birth?: string;
    age_estimate?: number;
    nationality?: string;
    marital_status?: string;
    blood_type?: string;
    
    // Contact
    phone?: string;
    email?: string;
    
    // Address
    address?: string;
    address_city?: string;
    address_state?: string;
    address_country?: string;
    address_postal_code?: string;
    
    // Social & Public Records
    social_media?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
    };
    public_records?: {
      voter_registration?: boolean;
      business_registration?: string;
      education?: string[];
      employment?: string;
    };
    
    // Verification
    verification_history?: {
      last_verified?: string;
      verification_count?: number;
      risk_score?: number;
      trust_score?: number;
    };
    
    // Professional
    tax_id?: string;
    professional_certifications?: string[];
  };
  confidence?: number;
  reason?: string;
  liveness?: number;
}

// Hardcoded demo data with comprehensive identity information
const MOCK_DATA = {
  full_name: "Adeniji Elijah Adetomiwa",
  first_name: "Adeniji",
  middle_name: "Elijah",
  last_name: "Adetomiwa",
  position: "Software Engineer",
  department: "Technology",
  employee_id: "FT-2024-0731",
  email: "adeniji.adetomiwa@outlook.com",
  phone: "+234-809-456-7821",
  
  // National Identity
  nin: "70483291056",
  unique_id_number: "NIN-70483291056",
  
  // Driver's License
  license_number: "LAG-D87654321",
  drivers_license_status: "Valid" as const,
  license_issue_date: "2021-08-20",
  license_expiry_date: "2026-08-19",
  license_class: "Class B - Light Vehicle",
  
  // Passport
  passport_number: "B08741263",
  passport_status: "Valid" as const,
  passport_issue_date: "2023-02-14",
  passport_expiry_date: "2033-02-13",
  passport_issuing_authority: "Nigerian Immigration Service (NIS)",
  
  // Voter's Card
  voters_id_number: "19-F087412639",
  voters_id_status: "Active" as const,
  polling_unit: "Unit 007, Surulere Ward III",
  
  // Personal Information
  gender: "Male",
  date_of_birth: "1999-07-31",
  age: 26,
  nationality: "Nigerian",
  marital_status: "Single",
  blood_type: "A+",
  
  // Address
  address_street: "12 Bode Thomas Street, Surulere",
  address_city: "Lagos",
  address_state: "Lagos State",
  address_country: "Nigeria",
  address_postal_code: "101283",
  
  // Social Media
  social_media: {
    linkedin: "linkedin.com/in/adeniji-adetomiwa",
    twitter: "@adeniji_eli",
    facebook: "facebook.com/adeniji.adetomiwa"
  },
  
  // Public Records
  public_records: {
    voter_registration: true,
    business_registration: "Adetomiwa Tech Solutions (RC: 2847193)",
    education: ["BSc Computer Science - University of Lagos", "Professional Diploma in Cybersecurity - NIIT"],
    employment: "Software Engineer at FaceTrust AI"
  },
  
  // Verification History
  verification_history: {
    last_verified: new Date().toISOString(),
    verification_count: 12,
    risk_score: 3,
    trust_score: 97
  },
  
  // Tax Information
  tax_id: "TIN-28471930-0042",
  
  // Professional
  professional_certifications: [
    "Oracle Certified Professional (OCP)",
    "CompTIA Security+",
    "Google Cloud Associate Engineer"
  ]
};

export class FaceRecognitionService {
  private static instance: FaceRecognitionService;

  private constructor() {
    console.log("🎭 FaceRecognitionService initialized in DEMO MODE");
    console.log("✓ Using hardcoded data for Adeniji Elijah Adetomiwa");
  }

  public static getInstance(): FaceRecognitionService {
    if (!FaceRecognitionService.instance) {
      FaceRecognitionService.instance = new FaceRecognitionService();
    }
    return FaceRecognitionService.instance;
  }

  async verifyFace(imageBase64: string): Promise<RecognitionResult> {
    // Simulate instant verification with hardcoded success
    console.log("🎭 Mock verification - instantly returning success for Adeniji Elijah Adetomiwa");
    
    return {
      matched: true,
      identity: {
        name: MOCK_DATA.first_name,
        full_name: MOCK_DATA.full_name,
        first_name: MOCK_DATA.first_name,
        middle_name: MOCK_DATA.middle_name,
        last_name: MOCK_DATA.last_name,
        role: MOCK_DATA.position,
        department: MOCK_DATA.department,
        
        // National IDs
        nin: MOCK_DATA.nin,
        unique_id_number: MOCK_DATA.unique_id_number,
        
        // Driver's License
        license_number: MOCK_DATA.license_number,
        drivers_license_status: MOCK_DATA.drivers_license_status,
        license_issue_date: MOCK_DATA.license_issue_date,
        license_expiry_date: MOCK_DATA.license_expiry_date,
        license_class: MOCK_DATA.license_class,
        
        // Passport
        passport_number: MOCK_DATA.passport_number,
        passport_status: MOCK_DATA.passport_status,
        passport_issue_date: MOCK_DATA.passport_issue_date,
        passport_expiry_date: MOCK_DATA.passport_expiry_date,
        passport_issuing_authority: MOCK_DATA.passport_issuing_authority,
        
        // Voter's Card
        voters_id_number: MOCK_DATA.voters_id_number,
        voters_id_status: MOCK_DATA.voters_id_status,
        polling_unit: MOCK_DATA.polling_unit,
        
        // Personal
        gender: MOCK_DATA.gender,
        date_of_birth: MOCK_DATA.date_of_birth,
        age_estimate: MOCK_DATA.age,
        nationality: MOCK_DATA.nationality,
        marital_status: MOCK_DATA.marital_status,
        blood_type: MOCK_DATA.blood_type,
        
        // Contact
        phone: MOCK_DATA.phone,
        email: MOCK_DATA.email,
        
        // Address
        address: `${MOCK_DATA.address_street}, ${MOCK_DATA.address_city}`,
        address_city: MOCK_DATA.address_city,
        address_state: MOCK_DATA.address_state,
        address_country: MOCK_DATA.address_country,
        address_postal_code: MOCK_DATA.address_postal_code,
        
        // Social & Public Records
        social_media: MOCK_DATA.social_media,
        public_records: MOCK_DATA.public_records,
        
        // Verification
        verification_history: MOCK_DATA.verification_history,
        
        // Professional
        tax_id: MOCK_DATA.tax_id,
        professional_certifications: MOCK_DATA.professional_certifications,
      },
      confidence: 98.5,
      liveness: 95.2,
      reason: "Face verified successfully - All identity documents validated",
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
