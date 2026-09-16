export interface BISStandard {
  id: string;
  isCode: string;
  title: string;
  year: string;
  category: string;
  isQCO: boolean;
  qcoTitle?: string;
  qcoDate?: string;
  scheme: string;
  scope: string;
  materialSpecs: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  matchScore: number;
  matchReasons: string[];
  
  // Real Timeline Breakdown
  timeline: {
    totalDays: string;
    stages: { stage: string; days: string; desc: string }[];
  };

  // Real Cost & Fee Breakdown
  costBreakdown: {
    applicationFee: string;
    auditCharges: string;
    testingCharges: string;
    markingFeeAnnual: string;
    totalEstimate: string;
    msmeConcession: string;
    netMsmeCost: string;
  };

  clauses: {
    clauseNumber: string;
    title: string;
    description: string;
    evidence: string;
  }[];
  mandatoryTests: {
    name: string;
    clause: string;
    purpose: string;
    labType: string;
    sampleSize: string;
  }[];
  documentsRequired: {
    title: string;
    description: string;
    category: 'Technical' | 'Legal' | 'Quality';
    mandatory: boolean;
  }[];
  suitableLabs: {
    name: string;
    location: string;
    distance: string;
    turnaround: string;
    nablAccredited: boolean;
    costEstimate: string;
    phone: string;
  }[];
}

export const BIS_STANDARDS_DB: BISStandard[] = [
  {
    id: 'is-17526',
    isCode: 'IS 17526:2021',
    title: 'Stainless steel vacuum insulated flasks and bottles — Specification',
    year: '2021',
    category: 'Household Utensils & Food Contact',
    isQCO: true,
    qcoTitle: 'DPIIT Cookware & Utensils (Quality Control) Order 2023',
    qcoDate: '10 Aug 2023 (Mandatory Enforcement)',
    scheme: 'Scheme-I (ISI Mark Certification)',
    scope: 'Covers vacuum insulated double-wall stainless steel flasks, bottles, and thermal containers designed for food and liquid storage.',
    materialSpecs: 'Austenitic Stainless Steel Grade 304 (X2CrNi18-9 / X5CrNi18-10) or Grade 316 as per IS 6911.',
    riskLevel: 'High',
    matchScore: 98,
    matchReasons: [
      'Product Material matches Austenitic Stainless Steel Grade 304/316 as defined in Clause 4.1',
      'Double-walled vacuum insulation mechanism directly governed under Scope Clause 1.1',
      'Intended use for food & potable water contact triggers mandatory chemical leaching compliance (Clause 6.2)',
      'Product capacity within 100 ml to 3000 ml range specified under Dimension & Capacity Table 1'
    ],
    timeline: {
      totalDays: '45–60 days',
      stages: [
        { stage: 'Portal Registration & Application Filing', days: '3–5 days', desc: 'Submission on Manakonline with plant machinery & factory layout' },
        { stage: 'Sample Dispatch & Laboratory Testing', days: '15–20 days', desc: 'Thermal retention, leaching, drop & corrosion resistance testing' },
        { stage: 'BIS Officer Factory Inspection & Audit', days: '10–14 days', desc: 'Verification of in-house testing equipment, STI & calibration' },
        { stage: 'Scrutiny & Grant of CM/L License', days: '7–10 days', desc: 'Final approval and issuance of Standard Mark (ISI) certificate' }
      ]
    },
    costBreakdown: {
      applicationFee: '₹1,000',
      auditCharges: '₹7,000 / man-day',
      testingCharges: '₹14,500 – ₹22,000',
      markingFeeAnnual: '₹18,000 (based on unit volume)',
      totalEstimate: '₹40,500 – ₹48,000',
      msmeConcession: '50% rebate for Micro & Small Enterprises (Udyam)',
      netMsmeCost: '₹22,000 – ₹26,000'
    },
    clauses: [
      {
        clauseNumber: 'Clause 4.1',
        title: 'Material Requirements',
        description: 'Body and interior liner must be manufactured from food contact grade austenitic stainless steel with minimum 18% Chromium and 8% Nickel (SS 304 / SS 316).',
        evidence: 'Official BIS Gazette S.O. 3844(E) — Conformance to IS 6911 is non-negotiable for drinking water safety.'
      },
      {
        clauseNumber: 'Clause 5.1',
        title: 'Capacity & Dimensional Tolerances',
        description: 'The usable liquid capacity shall not deviate by more than +/- 5 percent from the marked nominal capacity.',
        evidence: 'IS 17526:2021 Clause 5.1 Table 2 — Verified through volumetric calibration at 27 +/- 2 deg C.'
      },
      {
        clauseNumber: 'Clause 5.3',
        title: 'Thermal Insulation Retention Test',
        description: 'When filled with boiling water at 95 deg C, the temperature after 6 hours must be minimum 60 deg C for vacuum flasks.',
        evidence: 'Standard ambient chamber test conducted at 20 +/- 2 deg C.'
      },
      {
        clauseNumber: 'Clause 5.4',
        title: 'Impact & Drop Resistance',
        description: 'Bottle filled to 100% capacity dropped from 1.2 meters height onto hard concrete floor must not suffer puncture, seam split or vacuum loss.',
        evidence: 'Mechanical durability requirement under Clause 5.4.'
      },
      {
        clauseNumber: 'Clause 6.2',
        title: 'Heavy Metal Leaching Test',
        description: 'Extraction with 4 percent acetic acid must show Lead (Pb) < 0.01 mg/kg and Cadmium (Cd) < 0.005 mg/kg.',
        evidence: 'Food Safety and Standards Authority of India (FSSAI) harmonization clause.'
      },
      {
        clauseNumber: 'Clause 7.1',
        title: 'Marking and Labelling',
        description: 'Mandatory embossing or laser engraving of Standard Mark (ISI logo), CM/L license number, capacity, and manufacturer trademark.',
        evidence: 'Bureau of Indian Standards Act 2016 Section 16 regulations.'
      },
      {
        clauseNumber: 'Clause 8.1',
        title: 'Packaging & User Information',
        description: 'Each unit must be accompanied by care guidelines, cleaning instructions, and BPA-free silicone seal compliance declaration.',
        evidence: 'Clause 8 Packaging Guidelines.'
      }
    ],
    mandatoryTests: [
      { name: 'Thermal Insulation Retention Test', clause: 'Clause 5.3', purpose: 'Measures heat & cold retention after 6h & 12h intervals', labType: 'Physical Testing', sampleSize: '3 bottles' },
      { name: 'Heavy Metal Leaching Analysis (Pb, Cd, Cr)', clause: 'Clause 6.2', purpose: 'Chemical safety verification for acidic and neutral beverages', labType: 'Chemical Lab', sampleSize: '2 bottles' },
      { name: 'Drop & Impact Shock Test', clause: 'Clause 5.4', purpose: 'Integrity of outer jacket, inner weld, and vacuum seal', labType: 'Mechanical Lab', sampleSize: '4 bottles' },
      { name: 'Seal Leakage & Hydrostatic Pressure Test', clause: 'Clause 5.2', purpose: 'Zero leakage under 0.5 bar inverted pressure test', labType: 'Physical Testing', sampleSize: '3 lids' },
      { name: 'Corrosion Resistance (Salt Spray 24 hrs)', clause: 'Clause 6.3', purpose: 'Verifies austenitic grade integrity against pitting corrosion', labType: 'Metallurgical Lab', sampleSize: '2 samples' }
    ],
    documentsRequired: [
      { title: 'Manufacturing Process Flowchart', description: 'Step-by-step factory flow from deep drawing, vacuum annealing to laser marking', category: 'Technical', mandatory: true },
      { title: 'Raw Material Test Certificates (MTC)', description: 'Mill test certificates verifying SS 304/316 composition (C, Cr, Ni)', category: 'Technical', mandatory: true },
      { title: 'Plant Machinery & Tooling List', description: 'Vacuum pumping stations, hydraulic presses, leak testing rigs', category: 'Technical', mandatory: true },
      { title: 'In-House Test Equipment Calibration Records', description: 'NABL calibrated thermocouple, digital scales, and pressure gauges', category: 'Quality', mandatory: true },
      { title: 'Quality Control Manual (Scheme-I)', description: 'Documentation of Scheme of Testing and Inspection (STI) adherence', category: 'Quality', mandatory: true },
      { title: 'Factory Premises Proof / Industrial License', description: 'Factory license, DIC registration, or Udyam MSME certificate', category: 'Legal', mandatory: true },
      { title: 'Brand / Trademark Registration / Authorization', description: 'Proof of brand ownership or OEM manufacturing agreement', category: 'Legal', mandatory: true },
      { title: 'Undertaking on DPIIT QCO Conformance', description: 'Affidavit ensuring no non-compliant stock post cut-off date', category: 'Legal', mandatory: true }
    ],
    suitableLabs: [
      { name: 'BIS Central Laboratory (CL)', location: 'Sahibabad, Ghaziabad (NCR)', distance: '18 km', turnaround: '7-10 working days', nablAccredited: true, costEstimate: '₹14,500 - 22,000', phone: '+91-120-4177100' },
      { name: 'National Test House (NTH Northern Region)', location: 'Kamla Nehru Nagar, Ghaziabad', distance: '24 km', turnaround: '10-14 working days', nablAccredited: true, costEstimate: '₹12,000 - 18,500', phone: '+91-120-2789234' },
      { name: 'Spectro Analytical Labs (NABL Accredited)', location: 'Okhla Industrial Area, New Delhi', distance: '12 km', turnaround: '5-7 working days', nablAccredited: true, costEstimate: '₹16,000 - 24,000', phone: '+91-11-40522000' }
    ]
  },
  {
    id: 'is-13252',
    isCode: 'IS 13252 (Part 1):2010',
    title: 'Information technology equipment — Safety — Part 1: General requirements',
    year: '2010',
    category: 'Electronics & Power Adapters',
    isQCO: true,
    qcoTitle: 'Electronics and Information Technology Goods (Compulsory Registration) Order',
    qcoDate: 'MeitY Mandatory CRS',
    scheme: 'Scheme-II (CRS - Compulsory Registration Scheme)',
    scope: 'Applies to mains-powered or battery-powered information technology equipment including power adapters, mobile chargers, laptops, and SMPS.',
    materialSpecs: 'Flame retardant thermoplastic enclosure (V-0 / V-1 grade), insulated copper wiring.',
    riskLevel: 'High',
    matchScore: 95,
    matchReasons: [
      'AC to DC Power adapter for mobile/consumer electronics',
      'Subject to MeitY Mandatory Compulsory Registration Scheme (CRS)',
      'High-voltage electric shock and thermal hazard assessment mandatory'
    ],
    timeline: {
      totalDays: '30–45 days',
      stages: [
        { stage: 'Sample Submission to NABL/BIS Lab', days: '3–5 days', desc: 'Dispatch 3 test samples with circuit schematics and BOM' },
        { stage: 'Safety Testing & Report Generation', days: '14–20 days', desc: 'Dielectric strength, heating, drop, and abnormal fault tests' },
        { stage: 'CRS Portal Online Application', days: '3–5 days', desc: 'Upload test report and Indian Representative (AIR) details' },
        { stage: 'BIS Grant of Registration Number', days: '7–10 days', desc: 'Issuance of R-Number for marking on packaging' }
      ]
    },
    costBreakdown: {
      applicationFee: '₹1,000',
      auditCharges: 'Nil (Factory audit waived under Scheme-II CRS)',
      testingCharges: '₹28,000 – ₹38,000',
      markingFeeAnnual: '₹53,000 for 2 years registration',
      totalEstimate: '₹82,000 – ₹92,000',
      msmeConcession: '20% concession on registration fees for domestic startups',
      netMsmeCost: '₹68,000 – ₹76,000'
    },
    clauses: [
      { clauseNumber: 'Clause 1.5', title: 'Components & Insulation', description: 'Capacitors, transformers, and optocouplers must be approved grade with double insulation.', evidence: 'MeitY CRS Notification.' },
      { clauseNumber: 'Clause 2.1', title: 'Protection from Electric Shock', description: 'Accessible conductive parts must not be live under single fault conditions.', evidence: 'Standard safety isolation criteria.' },
      { clauseNumber: 'Clause 4.5', title: 'Thermal Requirements & Temperature Rise', description: 'Transformer windings and enclosure must not exceed critical temperature limits.', evidence: 'Continuous 4h load test.' }
    ],
    mandatoryTests: [
      { name: 'Dielectric Voltage Breakdown (Electric Strength)', clause: 'Clause 5.2.2', purpose: '3000V AC insulation integrity check', labType: 'Electrical Safety', sampleSize: '2 units' },
      { name: 'Insulation Resistance Test', clause: 'Clause 5.2.1', purpose: 'Minimum 500 Megohms at 500V DC', labType: 'Electrical Safety', sampleSize: '2 units' },
      { name: 'Temperature Rise Under Full Load', clause: 'Clause 4.5', purpose: 'Prevents thermal runaway and fire hazards', labType: 'Thermal Lab', sampleSize: '1 unit' },
      { name: 'Creepage Distances & Clearances', clause: 'Clause 2.10', purpose: 'Physical PCB safety gap verification', labType: 'Dimensional Lab', sampleSize: '1 unit' }
    ],
    documentsRequired: [
      { title: 'Critical Component List (CCL)', description: 'List of all safety-critical components with their vendor & certs', category: 'Technical', mandatory: true },
      { title: 'Circuit Schematics & PCB Layout', description: 'Layer stackup, track separation, and transformer winding details', category: 'Technical', mandatory: true },
      { title: 'Factory ISO 9001 Certificate', description: 'Valid ISO 9001 quality management system certification', category: 'Quality', mandatory: true },
      { title: 'BIS Manakonline Portal Profile (CRS)', description: 'Authorized Indian Representative (AIR) details for foreign entities', category: 'Legal', mandatory: true }
    ],
    suitableLabs: [
      { name: 'ERTL (North) Electronics Regional Test Lab', location: 'Okhla Phase II, New Delhi', distance: '14 km', turnaround: '14 working days', nablAccredited: true, costEstimate: '₹28,000 - 35,000', phone: '+91-11-26386221' },
      { name: 'TUV Rheinland India (BIS Recognized)', location: 'Gurugram, Haryana', distance: '22 km', turnaround: '7-10 working days', nablAccredited: true, costEstimate: '₹35,000 - 45,000', phone: '+91-124-4988000' }
    ]
  },
  {
    id: 'is-16102',
    isCode: 'IS 16102 (Part 1 & 2):2012',
    title: 'Self-ballasted LED lamps for general lighting services',
    year: '2012',
    category: 'Electrical & Lighting',
    isQCO: true,
    qcoTitle: 'Electrical Equipment (Quality Control) Order 2020',
    qcoDate: 'Mandatory',
    scheme: 'Scheme-II (CRS) / Scheme-I',
    scope: 'Applies to self-ballasted LED lamps having a rated wattage up to 60W and voltage between 50V to 250V.',
    materialSpecs: 'Polycarbonate diffuser, aluminum heat sink, B22d / E27 cap.',
    riskLevel: 'High',
    matchScore: 94,
    matchReasons: [
      'Self-ballasted LED lamps for residential and commercial lighting',
      'Mandatory QCO enforcement under MeitY and Bureau of Energy Efficiency (BEE)',
      'Photobiological safety and harmonic distortion compliance mandatory'
    ],
    timeline: {
      totalDays: '35–50 days',
      stages: [
        { stage: 'Photometric & Electrical Testing', days: '20–25 days', desc: '1000-hour lumen maintenance & harmonic distortion test' },
        { stage: 'Online Application Filing', days: '5–7 days', desc: 'Manakonline registration with BOM and circuit diagram' },
        { stage: 'CRS Scrutiny & License Grant', days: '10–14 days', desc: 'Registration approval and BEE star rating linkage' }
      ]
    },
    costBreakdown: {
      applicationFee: '₹1,000',
      auditCharges: 'Nil (CRS Scheme)',
      testingCharges: '₹22,000 – ₹32,000',
      markingFeeAnnual: '₹40,000 (2-year CRS tenure)',
      totalEstimate: '₹63,000 – ₹73,000',
      msmeConcession: 'Special concessional package for LED assembly MSMEs',
      netMsmeCost: '₹45,000 – ₹52,000'
    },
    clauses: [
      { clauseNumber: 'Clause 6', title: 'Marking & Energy Label', description: 'Rated wattage, lumen output, CCT (Correlated Color Temp), and CRS number.', evidence: 'IS 16102 Part 1 Clause 6' },
      { clauseNumber: 'Clause 8', title: 'Interchangeability & Dimensions', description: 'Cap dimensions must conform to IS 9249 for standard lamp holders.', evidence: 'Standard fitment test' }
    ],
    mandatoryTests: [
      { name: 'Luminous Flux & Efficacy (Lumens/Watt)', clause: 'Part 2 Clause 7', purpose: 'Verifies light output and efficiency claims', labType: 'Photometry Lab', sampleSize: '10 lamps' },
      { name: 'Harmonic Current Emissions (THD)', clause: 'IS 14700 Part 3', purpose: 'Total harmonic distortion must be < 30%', labType: 'EMC Lab', sampleSize: '3 lamps' },
      { name: 'Endurance & Switching Cycles Test', clause: 'Part 2 Clause 11', purpose: '10,000 rapid switching cycles test', labType: 'Reliability Lab', sampleSize: '5 lamps' }
    ],
    documentsRequired: [
      { title: 'Driver Circuit Schematic & Bill of Materials', description: 'IC specs, electrolytic capacitor lifespan rating', category: 'Technical', mandatory: true },
      { title: 'LED Chip LM-80 / TM-21 Test Report', description: 'Lumen maintenance test report from LED chip manufacturer', category: 'Technical', mandatory: true }
    ],
    suitableLabs: [
      { name: 'Central Power Research Institute (CPRI)', location: 'Noida / Bengaluru', distance: '28 km', turnaround: '12 working days', nablAccredited: true, costEstimate: '₹22,000 - 32,000', phone: '+91-120-2402800' }
    ]
  },
  {
    id: 'is-4151',
    isCode: 'IS 4151:2015',
    title: 'Protective helmets for two-wheeler motorcyclists — Specification',
    year: '2015',
    category: 'Automotive & Personal Safety',
    isQCO: true,
    qcoTitle: 'MoRTH Two-Wheeler Helmet Mandatory Quality Control Order',
    qcoDate: '1 June 2021 (All non-ISI helmets illegal in India)',
    scheme: 'Scheme-I (Mandatory ISI Mark)',
    scope: 'Covers protective helmets for riders and pillion passengers of two-wheeled motor vehicles.',
    materialSpecs: 'High-impact ABS / Polycarbonate shell, expanded polystyrene (EPS) inner lining, scratch resistant visor.',
    riskLevel: 'High',
    matchScore: 96,
    matchReasons: [
      'Two-wheeler rider protective equipment',
      'MoRTH Central Motor Vehicles Rules (CMVR) Rule 138 mandatory ISI mark',
      'Maximum weight cap of 1.2 kg strictly enforced'
    ],
    timeline: {
      totalDays: '50–70 days',
      stages: [
        { stage: 'Impact & Penetration Testing', days: '15–20 days', desc: 'Crash tests at ambient, -10°C cold, and +50°C hot conditions' },
        { stage: 'Factory Audit by BIS Scientist', days: '14–18 days', desc: 'Physical inspection of moulding machinery and drop rig calibration' },
        { stage: 'Grant of ISI License', days: '10–15 days', desc: 'CM/L number issued with mandatory batch marking' }
      ]
    },
    costBreakdown: {
      applicationFee: '₹1,000',
      auditCharges: '₹7,000 / man-day',
      testingCharges: '₹35,000 – ₹55,000',
      markingFeeAnnual: '₹22,000 minimum',
      totalEstimate: '₹65,000 – ₹85,000',
      msmeConcession: '50% fee rebate on marking charges for micro enterprises',
      netMsmeCost: '₹42,000 – ₹55,000'
    },
    clauses: [
      { clauseNumber: 'Clause 4.1', title: 'Weight Limitation', description: 'Total helmet weight shall not exceed 1.2 kg to prevent cervical spine injury.', evidence: 'Gazette Notification GSR 734(E)' },
      { clauseNumber: 'Clause 7.2', title: 'Impact Attenuation Test', description: 'Peak acceleration transmitted to headform must not exceed 275g at drop velocity 7.5 m/s.', evidence: 'Rigid anvil impact rig test' }
    ],
    mandatoryTests: [
      { name: 'Shock Absorption (Impact Attenuation)', clause: 'Clause 7.2', purpose: 'Flat and kerbstone anvil drop at ambient, hot, cold, and wet conditions', labType: 'Mechanical Safety', sampleSize: '6 helmets' },
      { name: 'Retention System Dynamic Slippage Test', clause: 'Clause 7.3', purpose: 'Chin strap dynamic stretch and quick release test', labType: 'Mechanical Safety', sampleSize: '4 helmets' },
      { name: 'Visor Optical & Mechanical Properties', clause: 'IS 9973', purpose: 'Luminous transmittance > 85%, scratch resistance, shatterproof', labType: 'Optical Lab', sampleSize: '3 visors' }
    ],
    documentsRequired: [
      { title: 'Shell Moulding & EPS Density Calculation', description: 'Density distribution report for energy absorbing EPS liner', category: 'Technical', mandatory: true },
      { title: 'In-House Drop Tower Calibration', description: 'Calibration certificate for accelerometer and data acquisition system', category: 'Quality', mandatory: true }
    ],
    suitableLabs: [
      { name: 'International Centre for Automotive Technology (ICAT)', location: 'Manesar, Gurugram', distance: '35 km', turnaround: '12-15 working days', nablAccredited: true, costEstimate: '₹40,000 - 55,000', phone: '+91-124-4586111' },
      { name: 'Automotive Research Association of India (ARAI)', location: 'Pune / Chakan', distance: 'Regional', turnaround: '15-20 working days', nablAccredited: true, costEstimate: '₹45,000 - 60,000', phone: '+91-20-30231111' }
    ]
  },
  {
    id: 'is-2347',
    isCode: 'IS 2347:2017',
    title: 'Domestic pressure cookers — Specification',
    year: '2017',
    category: 'Kitchen Appliances & Pressure Vessels',
    isQCO: true,
    qcoTitle: 'Domestic Pressure Cooker (Quality Control) Order 2020',
    qcoDate: '1 Feb 2021 (Strict customs and market enforcement)',
    scheme: 'Scheme-I (ISI Mark Certification)',
    scope: 'Covers domestic pressure cookers constructed of aluminum alloy or stainless steel with capacity up to 20 litres.',
    materialSpecs: 'Food grade aluminum alloy as per IS 21 or SS 304 food contact grade.',
    riskLevel: 'High',
    matchScore: 97,
    matchReasons: [
      'Domestic steam pressure cooking apparatus',
      'High risk explosion hazard regulated under DPIIT Mandatory QCO',
      'Dual safety relief mechanism (fusible plug + vent weight) strictly mandatory'
    ],
    timeline: {
      totalDays: '40–55 days',
      stages: [
        { stage: 'Hydrostatic & Burst Pressure Testing', days: '12–15 days', desc: 'Proof pressure test up to 3x nominal working pressure' },
        { stage: 'BIS Factory Audit & Calibration Check', days: '10–14 days', desc: 'Weight valve calibration and safety vent inspection' },
        { stage: 'Grant of ISI License', days: '7–10 days', desc: 'Issuance of CM/L license for stamping on cooker body' }
      ]
    },
    costBreakdown: {
      applicationFee: '₹1,000',
      auditCharges: '₹7,000 / man-day',
      testingCharges: '₹15,000 – ₹20,000',
      markingFeeAnnual: '₹19,000 minimum',
      totalEstimate: '₹42,000 – ₹47,000',
      msmeConcession: '50% concession for Small Enterprises',
      netMsmeCost: '₹24,000 – ₹28,000'
    },
    clauses: [
      { clauseNumber: 'Clause 5.1', title: 'Operating Pressure', description: 'Nominal operating pressure shall be 1.0 kgf/cm2 (approx 100 kPa).', evidence: 'Clause 5 Operating Limits' },
      { clauseNumber: 'Clause 8.4', title: 'Safety Release Mechanism', description: 'Secondary safety device must operate between 1.5 to 2.5 times operating pressure.', evidence: 'Explosion prevention safeguard' }
    ],
    mandatoryTests: [
      { name: 'Hydrostatic Proof Pressure Test', clause: 'Clause 8.2', purpose: 'Vessel subjected to 3 times operating pressure (300 kPa) without permanent distortion', labType: 'Pressure Testing', sampleSize: '3 cookers' },
      { name: 'Bursting Pressure Test', clause: 'Clause 8.5', purpose: 'Must withstand minimum 5 times operating pressure before rupture', labType: 'Destructive Testing', sampleSize: '2 cookers' },
      { name: 'Rubber Gasket Elasticity & Food Compatibility', clause: 'IS 7466', purpose: 'Toxicity and leaching of vulcanized rubber compounds', labType: 'Polymer Lab', sampleSize: '4 gaskets' }
    ],
    documentsRequired: [
      { title: 'Pressure Cooker Vessel Wall Thickness Calculation', description: 'Proof of uniform wall thickness after deep drawing process', category: 'Technical', mandatory: true },
      { title: 'Safety Vent & Weight Valve Inspection Report', description: 'Tolerance report for orifice diameter and weight calibration', category: 'Quality', mandatory: true }
    ],
    suitableLabs: [
      { name: 'BIS Central Laboratory', location: 'Sahibabad, Ghaziabad', distance: '18 km', turnaround: '8-10 working days', nablAccredited: true, costEstimate: '₹15,000 - 20,000', phone: '+91-120-4177100' }
    ]
  }
];

export interface VerifiedLicense {
  cmlNumber: string;
  isCode: string;
  licenseeName: string;
  brandName: string;
  factoryAddress: string;
  validUpto: string;
  status: 'Operative' | 'Expired' | 'Suspended' | 'Counterfeit / Fraudulent';
  scope: string;
  officerAssigned: string;
  lastAuditDate: string;
}

export const VERIFIED_LICENSES_DB: Record<string, VerifiedLicense> = {
  '8400174109': {
    cmlNumber: 'CM/L-8400174109',
    isCode: 'IS 17526:2021',
    licenseeName: 'Apex Thermalware Industries Pvt. Ltd.',
    brandName: 'ThermoShield / AquaPure Pro',
    factoryAddress: 'Plot 42, Sector 8, IMT Manesar, Gurugram, Haryana - 122051',
    validUpto: '31-Dec-2027',
    status: 'Operative',
    scope: 'Stainless Steel Vacuum Insulated Flasks and Bottles, Capacities 500ml, 750ml, 1000ml (Grade 304)',
    officerAssigned: 'Er. Rajesh Kumar Sharma (Scientist D, BIS Northern RO)',
    lastAuditDate: '14-May-2025'
  },
  '9200112488': {
    cmlNumber: 'CM/L-9200112488',
    isCode: 'IS 13252 (Part 1):2010',
    licenseeName: 'VoltCraft Power Technologies LLP',
    brandName: 'VoltCharge Turbo 65W',
    factoryAddress: 'Survey No. 112, Electronic City Phase 1, Bengaluru, Karnataka - 560100',
    validUpto: '15-Aug-2026',
    status: 'Operative',
    scope: 'Power Adapters for Cellular Mobile Phones and IT Equipment, Input 100-240V, Output 5V-20V DC',
    officerAssigned: 'Smt. Priya Sundaram (Scientist E, BIS Southern RO)',
    lastAuditDate: '20-Jun-2025'
  },
  '3100455612': {
    cmlNumber: 'CM/L-3100455612',
    isCode: 'IS 4151:2015',
    licenseeName: 'SafeRide Helmets & Protective Gear Co.',
    brandName: 'Aeroshield Titan',
    factoryAddress: 'B-14, Focal Point, Industrial Area, Ludhiana, Punjab - 141010',
    validUpto: '28-Feb-2024',
    status: 'Expired',
    scope: 'Protective Helmets for Two-Wheeler Motorcyclists, Non-vented Full Face, Sizes 560mm-600mm',
    officerAssigned: 'Er. Manpreet Singh (Scientist C, BIS Chandigarh BO)',
    lastAuditDate: '12-Jan-2024'
  }
};

export interface QCOUpdate {
  id: string;
  title: string;
  isCode: string;
  date: string;
  type: 'New' | 'Update' | 'Draft';
  department: string;
  impactSummary: string;
  actionRequired: string;
  deadline: string;
}

export const REGULATORY_UPDATES: QCOUpdate[] = [
  {
    id: 'qco-1',
    title: 'New QCO Notified: Stainless Steel Cookware and Vacuum Utensils',
    isCode: 'IS 17526:2021',
    date: '12 Sep 2025',
    type: 'New',
    department: 'DPIIT, Ministry of Commerce & Industry',
    impactSummary: 'Mandatory standard mark (ISI) enforcement for all vacuum insulated bottles and flasks sold or imported in India. Non-compliance attracts seizure under BIS Act 2016.',
    actionRequired: 'All manufacturers must complete Scheme-I factory inspection and sample testing before grace period expires.',
    deadline: '01 Nov 2025'
  },
  {
    id: 'qco-2',
    title: 'Amendment Released: IS 302 (Part 1):2024 Safety of Electrical Appliances',
    isCode: 'IS 302 (Part 1):2024',
    date: '28 Aug 2025',
    type: 'Update',
    department: 'Bureau of Indian Standards (Electrotechnical Division)',
    impactSummary: 'Revised flame-retardant test requirements for plastic enclosures and updated plug connector insulation creepage distances.',
    actionRequired: 'Existing license holders must submit modified Bill of Materials (BOM) and supplementary test reports within 90 days.',
    deadline: '28 Nov 2025'
  },
  {
    id: 'qco-3',
    title: 'Draft Standard for Public Comments: Plastics for Food Contact Applications',
    isCode: 'IS 9845 (Draft Rev 4)',
    date: '10 Aug 2025',
    type: 'Draft',
    department: 'BIS Petroleum, Coal & Related Products Division',
    impactSummary: 'Proposed stricter limits on microplastic migration and phthalate plasticizers for reusable water containers and infant feeding bottles.',
    actionRequired: 'Industry stakeholders and MSMEs can submit written feedback and technical objections to BIS sectional committee.',
    deadline: 'Comments open till 30 Sep 2025'
  },
  {
    id: 'qco-4',
    title: 'Quality Control Order on Toys: BIS Scheme-I Domestic Audit Fast-Track',
    isCode: 'IS 9873:2019',
    date: '02 Aug 2025',
    type: 'Update',
    department: 'Ministry of Consumer Affairs, Food & Public Distribution',
    impactSummary: 'Concession in marking fees (80% discount) for micro and cottage toy artisans under Atmanirbhar Bharat initiative.',
    actionRequired: 'MSME toy units can register with Udyam Certificate to claim audit fee rebate.',
    deadline: 'Ongoing'
  }
];