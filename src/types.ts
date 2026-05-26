export interface Doctor {
  id: string;
  name: string;
  title: string; // e.g. "BAMS, MD (Ayurveda)", "BUMS (Unani Medicine)"
  departmentId: string;
  rating: number;
  patientsServed: number;
  experienceYears: number;
  specialties: string[];
  bio: string;
  availability: string[]; // e.g. ["Mon", "Wed", "Fri"]
  image: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  iconName: string; // lucide icon identifier
  specialties: string[];
  treatmentMethods: string[];
}

export interface Appointment {
  id: string;
  userId?: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  departmentName: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: string;
}

export interface HealthMetric {
  date: string;
  bp: string; // e.g., "120/80"
  pulse: number; // bmp
  weight: number; // kg
  doshaDominance: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridoshic';
}

export interface Prescription {
  id: string;
  date: string;
  doctorName: string;
  medicineName: string; // e.g., "Amla Churna", "Khamira Abresham"
  type: 'Ayurvedic' | 'Unani';
  dosage: string; // e.g., "1 tsp twice daily after meals"
  duration: string; // e.g., "30 days"
  instructions: string;
}

export interface ConsultationNote {
  id: string;
  date: string;
  doctorName: string;
  departmentName: string;
  symptoms: string[];
  diagnosis: string;
  treatmentPlan: string;
}

export interface HealthRecord {
  patientId: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  bloodGroup: string;
  metricsHistory: HealthMetric[];
  prescriptions: Prescription[];
  consultationNotes: ConsultationNote[];
}

export interface PharmacyProduct {
  id: string;
  name: string;
  scientificName?: string;
  category: 'Talbina' | 'Asava/Arishtas (Liquid)' | 'Bhasma/Ras' | 'Dry Fruits, Honey' | 'Herbal Hair/Skin' | 'Immunity';
  description: string;
  benefits: string[];
  ingredients: string[];
  price: number;
  rating: number;
  image: string; // Unsplash url or descriptive preview
  isUnani: boolean;
}
