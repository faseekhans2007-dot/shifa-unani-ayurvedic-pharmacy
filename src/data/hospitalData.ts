import { Doctor, Department, PharmacyProduct, HealthRecord } from '../types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'hijama-center',
    name: "hijama center",
    description: "Highly specialized clinical cupping chamber conforming to strict safety and sanitation rules. Harnesses wet (Hijama-bil-Shart), dry, and oil cupping to draw out cellular toxins, purify blood streams, improve micro-circulation, and relieve chronic musculoskeletal stiffness.",
    iconName: 'Activity',
    specialties: ['Wet Cupping (Hijama-bil-Shart)', 'Dry & Oil Cupping (Tadbeer)', 'Blood Humor Purification', 'Chronic Inflammation Relief'],
    treatmentMethods: ['Hygienic single-use sterile disposables', 'Targeted localized pressure cups', 'Certified blood-letting suction protocols']
  },
  {
    id: 'full-body-massage-chair',
    name: "full body chair massage",
    description: "Premium therapeutic automated physical therapies using advanced high-end localized vibration chairs. Calms nervous system stress pathways, stretches spinal discs, coordinates neuromuscular balance, eases muscle tension, and boosts physical blood flow.",
    iconName: 'Flame',
    specialties: ['Spinal Stiffening Decompression', 'Deep Tissue Tension Relief', 'Full Body Postural Alignment', 'Rapid Circulation & Pain Defense'],
    treatmentMethods: ['Automated zero-gravity stretch routines', 'Custom mechanical acupressure points', 'Thermodynamic heat-assisted therapy']
  },
  {
    id: 'clinical-center',
    name: "clinical center",
    description: "Your reliable primary care diagnostic center. Fully prepared for standard physical checkups, complete fever screening, clinical checks, blood pressure diagnostics, blood glucose tracks, general health management, and custom pharmacist advice.",
    iconName: 'HeartHandshake',
    specialties: ['Comprehensive Fever Screening', 'Routine Blood Pressure Checkup', 'General Physical Diagnostics', 'Direct Herbal Pharmacy Guidance'],
    treatmentMethods: ['Primary clinical consultation', 'Diagnostic symptom analytics', 'Custom wellness formulation counseling']
  }
];

export const DOCTORS: Doctor[] = [
  {
    id: 'dr-ma-subhan-javeed-hijama',
    name: 'DR MA SUBHAN JAVEED',
    title: 'Hijama & Cupping Specialist, BUMS (Unani & Regimental Therapy)',
    departmentId: 'hijama-center',
    rating: 4.95,
    patientsServed: 4800,
    experienceYears: 15,
    specialties: ['Clinical Hijama Cupping', 'Sports Muscle Recovery', 'Toxin Removal'],
    bio: 'DR MA SUBHAN JAVEED is an exceptionally qualified Unani Regimental therapist with deep expert precision in sterile, high-hygiene wet cupping treatments.',
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Sat'],
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'dr-ma-subhan-javeed-massage',
    name: 'DR MA SUBHAN JAVEED',
    title: 'Biomechanical & Massage Expert, BAMS, MD (Acupressure)',
    departmentId: 'full-body-massage-chair',
    rating: 4.9,
    patientsServed: 3200,
    experienceYears: 15,
    specialties: ['Full Body Massage Chair', 'Neural Decompression', 'Stress Release'],
    bio: 'DR MA SUBHAN JAVEED leads our advanced physical wellness division, designing automated chair routines that align the spine and refresh deep blood channels.',
    availability: ['Mon', 'Wed', 'Fri', 'Sat'],
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'dr-ma-subhan-javeed-clinical',
    name: 'DR MA SUBHAN JAVEED',
    title: 'PG EMC, Hijama, cupping Expert (General Medicine & Diagnostics)',
    departmentId: 'clinical-center',
    rating: 4.88,
    patientsServed: 5100,
    experienceYears: 15,
    specialties: ['Clinical Center Fever Check', 'Adult Checkups', 'Primary Diagnosis'],
    bio: 'DR MA SUBHAN JAVEED represents our primary care anchor, diagnosing cold/flu, managing fevers, performing physical wellness screens, and prescribing apothecary blends.',
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600'
  }
];

export const PRODUCTS: PharmacyProduct[] = [
  {
    id: 'shifa-barley-talbina',
    name: 'Shifa Pure Barley Talbina (Traditional)',
    category: 'Talbina',
    description: 'A soothing and extremely nutritious traditional barley porridge cooked gently with milk and sweetened with pure honey. Superb for gut health and calming the mind.',
    benefits: ['Excellent prebiotic that supports stomach health', 'Satiating, fiber-rich, and sustains energy', 'Soothes nervous stress and elevates mood'],
    ingredients: ['Premium Organic Barley Grain', 'Pure Honey', 'Skimmed Milk Extract', 'Cardamom Seeds'],
    price: 240,
    rating: 4.88,
    image: 'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?auto=format&fit=crop&q=80&w=600',
    isUnani: true
  },
  {
    id: 'shifa-dates-talbina',
    name: 'Shifa Royal Dates & Almond Talbina',
    category: 'Talbina',
    description: 'Premium barley porridge infused with soft Saudi dates and crushed sun-cured almonds. Tailored for muscle repair, cardiac energy, and daily wellness.',
    benefits: ['High in iron, potassium, and magnesium', 'Natural energy booster for all age groups', 'Supports healthy weight management'],
    ingredients: ['Organic Ground Barley', 'Premium Saudi Dates', 'Crushed California Almonds', 'Organic Raw Honey'],
    price: 290,
    rating: 4.92,
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=600',
    isUnani: true
  },
  {
    id: 'shifa-himalayan-honey',
    name: 'Shifa Raw Himalayan Wild Honey',
    category: 'Dry Fruits, Honey',
    description: 'Unprocessed, unheated wildflower honey directly extracted from high-altitude Himalayan forest hives. Packed with natural pollen, active enzymes, and raw vitality.',
    benefits: ['Natural throat demulcent & cough relief', 'Assists digestives and metabolic fires', 'Strengthens daily vitality & tissue recovery'],
    ingredients: ['100% Raw Wildflower Honey'],
    price: 390,
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600',
    isUnani: true
  },
  {
    id: 'shifa-royal-dry-fruits',
    name: 'Shifa Royal Selection Dry Fruits',
    category: 'Dry Fruits, Honey',
    description: 'A curated hand-selected blend of premium whole cashews, rich almonds, Kashmiri walnuts, and dried figs. Slow sun-dried to lock in essential minerals and vitamins.',
    benefits: ["Rich in heart-healthy monounsaturated fats", "Excellent dietary source of plant-based protein", "Combats general fatigue & neural weakness"],
    ingredients: ["California Almonds", "Kashmiri Walnuts", "Premium Cashews", "Turkish Dried Figs (Anjeer)", "Afghan Raisins"],
    price: 640,
    rating: 4.87,
    image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
    isUnani: false
  },
  {
    id: 'arq-maullah-special',
    name: 'Arq-e-Shahtara (Blood Purifier)',
    category: 'Asava/Arishtas (Liquid)',
    description: 'A classic steam-distilled liquid Unani formulation that targets blood impurities. Resolves chronic breakout syndromes, acne, and hot skin eruptions.',
    benefits: ['Purifies blood naturally', 'Helps drain lymphatic stagnation', 'Promotes crystal clear skin texture'],
    ingredients: ['Shahtara Herb (Fumaria parviﬂora)', 'Chiraita', 'Mundhi', 'Pure Spring Distilled Extract'],
    price: 220,
    rating: 4.75,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600',
    isUnani: true
  },
  {
    id: 'shifa-immunity-talbina',
    name: 'Shifa Saffron Immunity Talbina',
    category: 'Immunity',
    description: 'Special formulation of traditional Talbina enhanced with organic saffron threads and immune-stimulating botanicals. Specially structured to boost white cell activity.',
    benefits: ['Helps elevate overall humoral protection', 'Rich source of protective antioxidants', 'Soothes throat discomfort and deep system heat'],
    ingredients: ['Roasted Barley Powder', 'Kashmiri Saffron (Kesar)', 'Crushed Pistachios', 'Green Cardamom Extract'],
    price: 350,
    rating: 4.92,
    image: 'https://images.unsplash.com/photo-1563483774720-3b4cb10e14a1?auto=format&fit=crop&q=80&w=600',
    isUnani: true
  },
  {
    id: 'shifa-immunity-honey',
    name: 'Shifa Sidr Immunity Honey (with Black Seed)',
    category: 'Immunity',
    description: 'Therapeutic wild honey infused with active black seed (Kalonji) extract and wild ginger distillate. Proven to strongly protect bronchial health and reinforce immunity.',
    benefits: ['Provides a formidable immune armor', 'Soothes severe coughs & bronchial pathways', 'Helps cleanse systemic impurities'],
    ingredients: ['Pure Sidr Honey', 'Kalonji (Black Seed) Cold-Pressed Oil', 'Zanjabil (Ginger) Gingerol Extract'],
    price: 480,
    rating: 4.96,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600',
    isUnani: true
  },
  {
    id: 'shifa-immunity-dry-fruits',
    name: 'Shifa Immunity Dry Fruits & Seed Medley',
    category: 'Immunity',
    description: 'A nutritional powerhouse of walnuts, almonds, figs, and pumpkin seeds toasted with multi-floral honey. Provides natural Zinc, Selenium, and iron for ultimate cell vigor.',
    benefits: ['Supports normal red and white cell production', 'Rich in natural Zinc & Selenium immune mineral trace', 'Strengthens cartilage tissue and general stamina'],
    ingredients: ['Pumpkin Seeds', 'Kashmiri Walnuts', 'Saudi Ajwa Dates', 'California Almonds', 'Organic Flaxseeds'],
    price: 680,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600',
    isUnani: false
  }
];

export const DEMO_PATIENT: HealthRecord = {
  patientId: "PAT-88219-A",
  name: "Faseeh Ahmad",
  email: "kfasee877@gmail.com",
  phone: "+91 98765 43210",
  age: 28,
  gender: "Male",
  bloodGroup: "O Positive",
  metricsHistory: [
    {
      date: "2026-05-20",
      bp: "118/76",
      pulse: 72,
      weight: 71,
      doshaDominance: "Pitta"
    },
    {
      date: "2026-04-15",
      bp: "122/82",
      pulse: 78,
      weight: 72.5,
      doshaDominance: "Pitta"
    },
    {
      date: "2026-03-02",
      bp: "128/85",
      pulse: 82,
      weight: 74,
      doshaDominance: "Vata-Pitta"
    }
  ],
  prescriptions: [
    {
      id: "RX-90812",
      date: "2026-05-20",
      doctorName: "DR MA SUBHAN JAVEED",
      medicineName: "Rasayana Chyawanprash Supreme & Gulkand Muatadil",
      type: "Ayurvedic",
      dosage: "1 full tablespoon on an empty stomach with milk",
      duration: "60 Days",
      instructions: "Take early in the morning. Avoid sour foods for 3 hours after intake."
    },
    {
      id: "RX-87611",
      date: "2026-04-15",
      doctorName: "DR MA SUBHAN JAVEED",
      medicineName: "Arq-e-Shahtara",
      type: "Unani",
      dosage: "15 ml twice daily diluted with 50ml warm water",
      duration: "30 Days",
      instructions: "Drink before morning breakfast and night supper. Aids blood cooling."
    }
  ],
  consultationNotes: [
    {
      id: "CN-4091",
      date: "2026-05-20",
      doctorName: "DR MA SUBHAN JAVEED",
      departmentName: "hijama center",
      symptoms: ["Intermittent acid reflux", "Slight fatigue post-midday", "Mild dry patches on skin in dry weather"],
      diagnosis: "Elevated Pitta humoral aggravation with mild Vata dryness in tissues (Dhatus). Secondary toxin (Ama) presence in digestive tract.",
      treatmentPlan: "Clinical wet cupping at hijama center to clear metabolic congestion and harmonize liver functions."
    },
    {
      id: "CN-3045",
      date: "2026-04-15",
      doctorName: "DR MA SUBHAN JAVEED",
      departmentName: "clinical center",
      symptoms: ["Mild skin inflammation", "Indigestion"],
      diagnosis: "Excess Safra (yellow bile humor) causing minor systemic heat surges.",
      treatmentPlan: "Use Arq-e-Shahtara blood cleanser, decrease oily items, and schedule a general wellness follow-up."
    }
  ]
};
