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
  full_name: "Abdulrasaq Abdulrasaq",
  first_name: "Abdulrasaq",
  middle_name: "Adeola",
  last_name: "Abdulrasaq",
  position: "Founder & CEO",
  department: "Executive",
  employee_id: "FT001",
  email: "abdulrasaq@facetrust.ai",
  phone: "+234-801-234-5678",
  
  // National Identity
  nin: "12345678901",
  unique_id_number: "FT-EMP-001",
  
  // Driver's License
  license_number: "LAG-A12345678",
  drivers_license_status: "Valid" as const,
  license_issue_date: "2020-03-15",
  license_expiry_date: "2025-03-14",
  license_class: "Class C - Private Vehicle",
  
  // Passport
  passport_number: "A50123456",
  passport_status: "Valid" as const,
  passport_issue_date: "2022-06-10",
  passport_expiry_date: "2032-06-09",
  passport_issuing_authority: "Nigerian Immigration Service",
  
  // Voter's Card
  voters_id_number: "90-A123456789",
  voters_id_status: "Active" as const,
  polling_unit: "Unit 012, Ikeja Ward",
  
  // Personal Information
  gender: "Male",
  date_of_birth: "1995-01-15",
  age: 29,
  nationality: "Nigerian",
  marital_status: "Single",
  blood_type: "O+",
  
  // Address
  address_street: "45 Innovation Drive",
  address_city: "Lagos",
  address_state: "Lagos State",
  address_country: "Nigeria",
  address_postal_code: "101233",
  
  // Social Media
  social_media: {
    linkedin: "linkedin.com/in/abdulrasaq-abdulrasaq",
    twitter: "@abdulrasaq",
    facebook: "facebook.com/abdulrasaq.abdulrasaq"
  },
  
  // Public Records
  public_records: {
    voter_registration: true,
    business_registration: "FaceTrust AI Limited (RC: 1234567)",
    education: ["BSc Computer Science - University of Lagos", "MSc Artificial Intelligence - MIT"],
    employment: "Founder & CEO at FaceTrust AI"
  },
  
  // Verification History
  verification_history: {
    last_verified: new Date().toISOString(),
    verification_count: 47,
    risk_score: 2,
    trust_score: 98
  },
  
  // Tax Information
  tax_id: "TIN-12345678-0001",
  
  // Professional
  professional_certifications: [
    "Certified Ethical Hacker (CEH)",
    "AWS Solutions Architect",
    "ISO 27001 Lead Implementer"
  ]
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
