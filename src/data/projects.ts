export interface UnitOption {
  id: string;
  name: string;
  type: 'Studio' | '1-Bedroom' | '2-Bedroom' | 'Penthouse' | 'Loft';
  sizeSqm: number;
  initialDepositNgn: number;
  outrightPriceNgn: number;
  projectedAnnualRoiNgn: number;
  projectedRoiPercent: number;
  estimatedNightlyRateNgn: number;
  refCode: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  subTitle: string;
  location: string;
  neighborhood: string;
  status: 'Pre-Launch' | 'Under Construction' | 'Selling Out';
  badge: string;
  featured: boolean;
  heroImage: string;
  galleryImages: string[];
  titleDocument: string;
  deliveryDate: string;
  completionPercentage: number;
  unitsAvailableCount: number;
  amenities: string[];
  story: string;
  units: UnitOption[];
}

export const COMPANY_DETAILS = {
  name: 'SEKURED Real Estate Group',
  shortName: 'SEKURED',
  tagline: 'Attainable Mainland Luxury',
  mission: 'Delivering Island-grade architectural finishes, smart automation, and published 12-13% annual short-let yields at accessible mainland price points.',
  address: '1, Montgomery Road, Yaba, Lagos, Nigeria',
  phoneDisplay: '+234 809 230 2956',
  phoneCall: '+2348092302956',
  whatsappNumber: '2348092302956',
  secondaryPhone: '+234 802 306 4134',
  email: 'invest@sekuredrealestate.com',
  instagram: '@sekuredd',
  website: 'www.sekuredrealestate.com',
  logoUrl: 'https://sekuredrealestate.com/wp-content/uploads/2026/03/sekured-logo-1-3-scaled.png',
  heritageLogoUrl: 'https://sekuredrealestate.com/wp-content/uploads/2025/12/Aurelia-full-logo-coloured-150x150.png',
  totalUnitsSold: 120,
  activeProjectsCount: 3,
  averageRoiPercent: 12.8,
  investorCommunityCount: '1,400+'
};

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'belmont-residence',
    slug: 'belmont-residence',
    name: 'Belmont Residence',
    tagline: 'Invest in the Ikoyi of Akoka',
    subTitle: 'Fully automated, high-yield boutique short-let residences located directly in the Yaba/Akoka intellectual and tech corridor.',
    location: 'Akoka, Yaba, Lagos',
    neighborhood: 'Yaba Tech Corridor (Close to UNILAG, YABATECH & CcHub)',
    status: 'Selling Out',
    badge: 'Limited Units Available',
    featured: true,
    heroImage: 'https://sekuredrealestate.com/wp-content/uploads/2025/12/IMG_2820-scaled.jpg',
    galleryImages: [
      'https://sekuredrealestate.com/wp-content/uploads/2025/12/IMG_2820-scaled.jpg',
      'https://sekuredrealestate.com/wp-content/uploads/2026/01/WhatsApp-Image-2026-01-20-at-1.33.45-PM-592x444.jpeg',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    titleDocument: "Governor's Consent & Approved Building Plan",
    deliveryDate: 'Q4 2026',
    completionPercentage: 72,
    unitsAvailableCount: 7,
    amenities: [
      'Smart Keyless Entry & App-Based Climate Control',
      'Rooftop Swimming Pool & Resident Sundeck Lounge',
      '24/7 Dual Uninterrupted Hybrid Power Architecture',
      'High-Speed Fiber Internet Infrastructure Pre-Wired',
      'On-Site Convenience Minimart & Security Patrol',
      'Hands-Free Turnkey Short-Let Rental Management'
    ],
    story: 'Belmont Residence takes the luxury architectural detailing traditionally reserved for Ikoyi and Banana Island and delivers it directly to Akoka, Yaba. Positioned precisely between major tech incubators and top universities, it generates year-round rental and short-let demand.',
    units: [
      {
        id: 'belmont-studio',
        name: 'Studio Apartment',
        type: 'Studio',
        sizeSqm: 42,
        initialDepositNgn: 20000000,
        outrightPriceNgn: 55000000,
        projectedAnnualRoiNgn: 7200000,
        projectedRoiPercent: 13.1,
        estimatedNightlyRateNgn: 65000,
        refCode: 'SEK-BELMONT-STD',
        description: 'Engineered for high-occupancy executive short-lets, visiting lecturers, tech professionals, and corporate travelers.'
      },
      {
        id: 'belmont-1bed',
        name: '1-Bedroom Luxury Suite',
        type: '1-Bedroom',
        sizeSqm: 68,
        initialDepositNgn: 30000000,
        outrightPriceNgn: 85000000,
        projectedAnnualRoiNgn: 10000000,
        projectedRoiPercent: 11.8,
        estimatedNightlyRateNgn: 90000,
        refCode: 'SEK-BELMONT-1BED',
        description: 'Expansive open-plan living, designer European kitchen, and private sunset terrace tailored for premium diaspora stays and high rental yield.'
      },
      {
        id: 'belmont-penthouse',
        name: '2-Bedroom Regal Penthouse',
        type: 'Penthouse',
        sizeSqm: 125,
        initialDepositNgn: 50000000,
        outrightPriceNgn: 150000000,
        projectedAnnualRoiNgn: 19500000,
        projectedRoiPercent: 13.0,
        estimatedNightlyRateNgn: 145000,
        refCode: 'SEK-BELMONT-PENT',
        description: 'The crown jewel of Akoka featuring double-height ceiling voids, wrap-around panoramic terrace, and 2 dedicated private parking bays.'
      }
    ]
  },
  {
    id: 'mansory-ville',
    slug: 'mansory-ville',
    name: 'Mansory Ville',
    tagline: 'The Heartbeat of Lagos Just Got an Upgrade',
    subTitle: 'Pure mainland luxury in central Surulere with pre-launch pricing designed to maximize early-entry capital appreciation.',
    location: 'Surulere, Lagos Mainland',
    neighborhood: 'Surulere Central (5 Mins to National Stadium & Western Avenue)',
    status: 'Pre-Launch',
    badge: 'Pre-Launch Pricing',
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    titleDocument: 'Certificate of Occupancy (C of O) & Registered Survey',
    deliveryDate: 'Q2 2027',
    completionPercentage: 35,
    unitsAvailableCount: 14,
    amenities: [
      'Striking 4-Storey Contemporary Facade with Architectural LED Ribbons',
      'Engineered Underground Drainage with Elevated Plinth Design',
      'Multi-Tier Biometric Security & CCTV Perimeter System',
      'Dedicated High-Capacity Transformer & Solar Hybrid Backup',
      'Executive Residents Club & Private Landscaped Terrace'
    ],
    story: 'Surulere is historically the soul of urban Lagos, but has lacked modern architectural residences. Mansory Ville introduces clean monolithic lines, large glass expanses, and an irresistible pre-launch discount for astute investors.',
    units: [
      {
        id: 'mansory-studio',
        name: 'Studio Apartment',
        type: 'Studio',
        sizeSqm: 40,
        initialDepositNgn: 20000000,
        outrightPriceNgn: 55000000,
        projectedAnnualRoiNgn: 6800000,
        projectedRoiPercent: 12.4,
        estimatedNightlyRateNgn: 60000,
        refCode: 'SEK-MANSORY-STD',
        description: 'First-mover pre-launch rate with estimated 30% capital gain upon structural topping-out.'
      },
      {
        id: 'mansory-1bed',
        name: '1-Bedroom Apartment',
        type: '1-Bedroom',
        sizeSqm: 65,
        initialDepositNgn: 30000000,
        outrightPriceNgn: 85000000,
        projectedAnnualRoiNgn: 9800000,
        projectedRoiPercent: 11.5,
        estimatedNightlyRateNgn: 85000,
        refCode: 'SEK-MANSORY-1BED',
        description: 'Spacious urban sanctuary with seamless indoor-outdoor living, recessed LED lighting, and Italian porcelain tiles.'
      },
      {
        id: 'mansory-2bed',
        name: '2-Bedroom Luxury Residence',
        type: '2-Bedroom',
        sizeSqm: 110,
        initialDepositNgn: 45000000,
        outrightPriceNgn: 130000000,
        projectedAnnualRoiNgn: 16200000,
        projectedRoiPercent: 12.5,
        estimatedNightlyRateNgn: 125000,
        refCode: 'SEK-MANSORY-2BED',
        description: 'Dual ensuite bedrooms, guest cloakroom, and separate chef-prep island for luxury family living or dual-key short-let rental.'
      }
    ]
  },
  {
    id: 'sawyer-tower',
    slug: 'sawyer-tower',
    name: 'Sawyer Tower',
    tagline: 'Mainland Horizon Redefined',
    subTitle: 'Institutional-grade high-rise development with founder-verified construction milestones and panoramic mainland vistas.',
    location: 'Yaba Commercial Corridor, Lagos',
    neighborhood: 'Direct Highway Access (3 Mins to Third Mainland Bridge)',
    status: 'Under Construction',
    badge: 'Active Construction',
    featured: false,
    heroImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=1200&q=80'
    ],
    titleDocument: 'Federal Registered Conveyance, Approved Tower Engineering & EIA',
    deliveryDate: 'Q1 2027',
    completionPercentage: 54,
    unitsAvailableCount: 9,
    amenities: [
      'High-Speed Panoramic Dual Elevators',
      'Basement Valet Parking Facility with EV Charging',
      'Executive Co-Working Hub & Private Boardroom',
      'Ground-Floor Artisan Coffee Bar & Wellness Gym',
      '24/7 Armed Security Patrol & Biometric Access Turnstiles'
    ],
    story: 'Sawyer Tower represents tangible proof of SEKURED execution capacity. With weekly on-site updates, founder hard-hat reviews, and concrete milestone tracking, investors enjoy unmatched peace of mind as the tower ascends.',
    units: [
      {
        id: 'sawyer-loft',
        name: '1-Bedroom Executive Loft',
        type: 'Loft',
        sizeSqm: 74,
        initialDepositNgn: 35000000,
        outrightPriceNgn: 95000000,
        projectedAnnualRoiNgn: 12500000,
        projectedRoiPercent: 13.2,
        estimatedNightlyRateNgn: 95000,
        refCode: 'SEK-SAWYER-LOFT',
        description: 'Double-volume mezzanine design overlooking Yaba skyline, engineered for high-flying tech founders and corporate executives.'
      },
      {
        id: 'sawyer-sky',
        name: '2-Bedroom Sky Residence',
        type: '2-Bedroom',
        sizeSqm: 118,
        initialDepositNgn: 60000000,
        outrightPriceNgn: 165000000,
        projectedAnnualRoiNgn: 22000000,
        projectedRoiPercent: 13.3,
        estimatedNightlyRateNgn: 150000,
        refCode: 'SEK-SAWYER-SKY',
        description: 'Corner residence with 270-degree floor-to-ceiling glass wrapping the Third Mainland Bridge sunset.'
      }
    ]
  }
];

export const TESTIMONIALS_DATA = [
  {
    quote: "Working with Ibrahim Adeniji and the SEKURED team gave me the clarity I never had with other Lagos developers. Their published ROI was not marketing fluff—my Belmont unit deposit is backed by solid legal covenants and verifiable construction progress.",
    author: 'Dr. Obinna Anyaoku',
    role: 'Diaspora Investor (London, UK)',
    unitBought: 'Belmont Residence 1-Bed'
  },
  {
    quote: "Finding mainland properties with genuine Ikoyi-level finishing was impossible until Mansory Ville. The deposit structure allowed us to lock in pre-launch value before the inevitable price escalation.",
    author: 'Folasade & Tunde Adeleke',
    role: 'Homeowners & Angel Investors',
    unitBought: 'Mansory Ville 2-Bed Suite'
  },
  {
    quote: "As a tech founder working out of Yaba, I wanted a hands-off property that pays for itself. SEKURED handled the short-let management structure from day one.",
    author: 'Kareem Balogun',
    role: 'Fintech Executive, Lagos',
    unitBought: 'Belmont Studio'
  }
];
