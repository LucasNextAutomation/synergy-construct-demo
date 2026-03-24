export interface TenderDocument {
  name: string
  type: "pdf" | "p7s" | "rar" | "xlsx"
  size: string
  ocrProcessed?: boolean
}

export interface TenderBrief {
  summary: string
  keyRequirements: string[]
  certifications: string[]
  estimatedTimeline: string
  riskFlags: string[]
}

export interface Tender {
  id: string
  seapId: string
  title: string
  authority: string
  cpvCode: string
  cpvDescription: string
  category: "Infrastructure" | "Buildings" | "Energy" | "Industrial"
  region: string
  city: string
  estimatedValueRON: number
  estimatedValueEUR: number
  submissionDeadline: string
  publishDate: string
  estimatedDuration: string
  guaranteeRON: number
  status: "new" | "analyzing" | "briefed" | "passed"
  matchScore: number
  documents: TenderDocument[]
  aiBrief: TenderBrief
  hidden?: boolean
  source?: 'mock' | 'seap-live'
}

export const mockTenders: Tender[] = [
  {
    id: "T-001",
    seapId: "CN1087432",
    title: "Modernizarea si extinderea retelei de apa si canalizare - Sector 3 Bucuresti",
    authority: "Primaria Sectorului 3 Bucuresti",
    cpvCode: "45232150-8",
    cpvDescription: "Water pipeline construction",
    category: "Infrastructure",
    region: "Bucuresti",
    city: "Bucuresti",
    estimatedValueRON: 87_500_000,
    estimatedValueEUR: 17_600_000,
    submissionDeadline: "2026-04-15",
    publishDate: "2026-03-04",
    estimatedDuration: "24 months",
    guaranteeRON: 1_750_000,
    status: "briefed",
    matchScore: 92,
    documents: [
      { name: "Caiet de sarcini.pdf", type: "pdf", size: "4.2 MB", ocrProcessed: true },
      { name: "Fisa de date.pdf", type: "pdf", size: "1.1 MB" },
      { name: "Formulare.p7s", type: "p7s", size: "2.8 MB", ocrProcessed: true },
      { name: "Planuri tehnice.rar", type: "rar", size: "45 MB" },
    ],
    aiBrief: {
      summary: "Major infrastructure project to modernize and extend water/sewage network in Sector 3 Bucharest. Covers 47km of pipeline replacement, 12 new pumping stations, and SCADA system integration. EU co-financed under POIM.",
      keyRequirements: [
        "Minimum 5 similar projects completed in last 5 years",
        "Annual turnover >175M RON average (last 3 years)",
        "ISO 9001, ISO 14001, OHSAS 18001 certifications required",
        "Key personnel: Project Manager (10yr exp), Site Engineer (7yr exp)",
        "Joint ventures allowed (max 3 partners)",
      ],
      certifications: ["ISO 9001:2015", "ISO 14001:2015", "ISO 45001:2018", "ANRE authorization"],
      estimatedTimeline: "24 months from contract signing, milestone payments quarterly",
      riskFlags: ["Tight deadline for EU funding absorption", "Complex permitting in urban area", "High guarantee requirement (2% of value)"],
    },
  },
  {
    id: "T-002",
    seapId: "CN1087519",
    title: "Constructia unui bloc de locuinte sociale - Municipiul Cluj-Napoca",
    authority: "Primaria Municipiului Cluj-Napoca",
    cpvCode: "45211000-9",
    cpvDescription: "Multi-dwelling building construction",
    category: "Buildings",
    region: "Cluj",
    city: "Cluj-Napoca",
    estimatedValueRON: 42_300_000,
    estimatedValueEUR: 8_500_000,
    submissionDeadline: "2026-04-22",
    publishDate: "2026-03-03",
    estimatedDuration: "18 months",
    guaranteeRON: 846_000,
    status: "analyzing",
    matchScore: 88,
    documents: [
      { name: "Documentatie tehnica.pdf", type: "pdf", size: "8.7 MB", ocrProcessed: true },
      { name: "Studiu geotehnic.pdf", type: "pdf", size: "3.2 MB" },
      { name: "Deviz general.xlsx", type: "xlsx", size: "1.5 MB" },
    ],
    aiBrief: {
      summary: "Construction of a 96-unit social housing complex (P+4E) in Cluj-Napoca, Floresti neighborhood. Includes underground parking, green spaces, and connection to existing utilities. PNRR funded.",
      keyRequirements: [
        "Minimum 3 residential projects >20M RON in last 5 years",
        "Seismic zone compliance (zone 6 - 0.15g acceleration)",
        "Energy efficiency class A minimum (nZEB standard)",
        "BIM Level 2 capability preferred",
      ],
      certifications: ["ISO 9001:2015", "ISO 14001:2015"],
      estimatedTimeline: "18 months, phased delivery (structure 8mo, finishes 6mo, exterior 4mo)",
      riskFlags: ["PNRR funding - strict milestone deadlines", "Labor shortage risk in Cluj market"],
    },
  },
  {
    id: "T-003",
    seapId: "CN1087601",
    title: "Reabilitarea energetica a Spitalului Judetean de Urgenta Timisoara",
    authority: "Consiliul Judetean Timis",
    cpvCode: "45454100-5",
    cpvDescription: "Restoration/renovation of buildings",
    category: "Energy",
    region: "Timis",
    city: "Timisoara",
    estimatedValueRON: 156_200_000,
    estimatedValueEUR: 31_400_000,
    submissionDeadline: "2026-05-01",
    publishDate: "2026-03-01",
    estimatedDuration: "30 months",
    guaranteeRON: 3_124_000,
    status: "briefed",
    matchScore: 95,
    documents: [
      { name: "Proiect tehnic complet.pdf", type: "pdf", size: "22 MB", ocrProcessed: true },
      { name: "Audit energetic.pdf", type: "pdf", size: "5.6 MB", ocrProcessed: true },
      { name: "Autorizatie construire.p7s", type: "p7s", size: "0.8 MB", ocrProcessed: true },
      { name: "Deviz analitic.xlsx", type: "xlsx", size: "3.1 MB" },
    ],
    aiBrief: {
      summary: "Comprehensive energy rehabilitation of Timisoara County Emergency Hospital (42,000 sqm). Includes thermal insulation, HVAC replacement, solar panel installation (500kW), LED lighting, and building management system. EU Green Deal funding.",
      keyRequirements: [
        "Experience with hospital/healthcare facility renovation (min 2 projects)",
        "Work must proceed without interrupting hospital operations",
        "Minimum 40% energy savings guarantee post-renovation",
        "Annual turnover >300M RON (last 3 years)",
      ],
      certifications: ["ISO 9001:2015", "ISO 14001:2015", "ISO 45001:2018", "ISO 50001:2018 (energy management)"],
      estimatedTimeline: "30 months in 4 phases to maintain hospital operations",
      riskFlags: ["Hospital operational continuity requirement", "Very high value - strong competition expected", "Complex phasing needed"],
    },
  },
  {
    id: "T-004",
    seapId: "CN1087688",
    title: "Constructia halei industriale si platformei logistice - Parcul Industrial Iasi",
    authority: "Agentia de Dezvoltare Regionala Nord-Est",
    cpvCode: "45213250-0",
    cpvDescription: "Industrial building construction",
    category: "Industrial",
    region: "Iasi",
    city: "Iasi",
    estimatedValueRON: 68_900_000,
    estimatedValueEUR: 13_850_000,
    submissionDeadline: "2026-04-10",
    publishDate: "2026-03-04",
    estimatedDuration: "16 months",
    guaranteeRON: 1_378_000,
    status: "new",
    matchScore: 85,
    documents: [
      { name: "Specificatii tehnice.pdf", type: "pdf", size: "6.3 MB", ocrProcessed: true },
      { name: "Plan situatie.pdf", type: "pdf", size: "2.1 MB" },
      { name: "Certificat urbanism.p7s", type: "p7s", size: "0.5 MB", ocrProcessed: true },
    ],
    aiBrief: {
      summary: "Construction of 15,000 sqm industrial hall with 5,000 sqm logistics platform in Iasi Industrial Park. Steel structure, 12m clear height, 5t/sqm floor load, 4 loading docks. Includes office area (800 sqm) and utilities connections.",
      keyRequirements: [
        "Steel structure experience mandatory (min 3 industrial projects)",
        "Fire resistance rating REI 120 for structural elements",
        "Completion within 16 months (penalty clause 0.1%/day)",
        "Local subcontractor preference (min 30%)",
      ],
      certifications: ["ISO 9001:2015", "ISO 14001:2015", "ISO 3834-2 (welding quality)"],
      estimatedTimeline: "16 months: foundations 3mo, structure 5mo, cladding/services 5mo, commissioning 3mo",
      riskFlags: ["Aggressive timeline with penalty clause", "Steel price volatility risk", "Winter construction start"],
    },
  },
  {
    id: "T-005",
    seapId: "CN1087745",
    title: "Reabilitarea si modernizarea DN1 - tronson Ploiesti-Brasov km 87-102",
    authority: "Compania Nationala de Administrare a Infrastructurii Rutiere",
    cpvCode: "45233120-6",
    cpvDescription: "Road construction work",
    category: "Infrastructure",
    region: "Prahova",
    city: "Ploiesti",
    estimatedValueRON: 134_700_000,
    estimatedValueEUR: 27_100_000,
    submissionDeadline: "2026-04-28",
    publishDate: "2026-03-02",
    estimatedDuration: "24 months",
    guaranteeRON: 2_694_000,
    status: "briefed",
    matchScore: 78,
    documents: [
      { name: "Proiect executie.pdf", type: "pdf", size: "35 MB", ocrProcessed: true },
      { name: "Studiu trafic.pdf", type: "pdf", size: "8.4 MB", ocrProcessed: true },
      { name: "Studiu geotehnic.pdf", type: "pdf", size: "4.7 MB" },
      { name: "Formulare oferta.p7s", type: "p7s", size: "1.2 MB", ocrProcessed: true },
    ],
    aiBrief: {
      summary: "Rehabilitation of 15km section of DN1 national road between Ploiesti and Brasov through Prahova Valley. Includes road widening to 4 lanes, 3 roundabouts, 2 overpasses, drainage system, and road safety improvements.",
      keyRequirements: [
        "CNAIR pre-qualification required",
        "Minimum 2 road projects >50M RON in mountainous terrain",
        "Own asphalt plant within 100km or mobile plant on site",
        "Traffic management plan for construction phase",
      ],
      certifications: ["ISO 9001:2015", "ISO 14001:2015", "ISO 45001:2018", "CNAIR registration"],
      estimatedTimeline: "24 months with seasonal restrictions (Nov-Mar limited earthworks)",
      riskFlags: ["Mountain terrain complexity", "Traffic management during construction", "Seasonal weather restrictions"],
    },
  },
  {
    id: "T-006",
    seapId: "CN1087812",
    title: "Constructia centralei fotovoltaice 10MW - Comuna Medgidia, Constanta",
    authority: "Transelectrica SA",
    cpvCode: "45251160-0",
    cpvDescription: "Solar power installation",
    category: "Energy",
    region: "Constanta",
    city: "Medgidia",
    estimatedValueRON: 52_400_000,
    estimatedValueEUR: 10_540_000,
    submissionDeadline: "2026-04-18",
    publishDate: "2026-03-03",
    estimatedDuration: "12 months",
    guaranteeRON: 1_048_000,
    status: "analyzing",
    matchScore: 72,
    documents: [
      { name: "Caiet sarcini tehnic.pdf", type: "pdf", size: "5.8 MB", ocrProcessed: true },
      { name: "Studiu radiere solara.pdf", type: "pdf", size: "2.3 MB" },
      { name: "Aviz racordare.p7s", type: "p7s", size: "0.3 MB", ocrProcessed: true },
    ],
    aiBrief: {
      summary: "EPC contract for 10MW solar photovoltaic plant on 15 hectares near Medgidia. Bifacial panels, string inverters, SCADA monitoring, 20kV transformer station, and grid connection. 25-year performance guarantee required.",
      keyRequirements: [
        "Minimum 3 solar projects >5MW completed",
        "Tier 1 panel manufacturers only (Bloomberg BNEF list)",
        "Performance ratio guarantee >82%",
        "O&M plan for first 5 years included in bid",
      ],
      certifications: ["ISO 9001:2015", "ISO 14001:2015", "ANRE authorization E-type"],
      estimatedTimeline: "12 months: permitting 2mo, civil works 3mo, installation 5mo, commissioning 2mo",
      riskFlags: ["Grid connection approval timeline uncertainty", "Panel supply chain delays possible", "Lower match - outside core competency"],
    },
  },
  {
    id: "T-007",
    seapId: "CN1087899",
    title: "Extinderea si modernizarea statiei de epurare ape uzate - Municipiul Brasov",
    authority: "Compania Apa Brasov SA",
    cpvCode: "45252200-0",
    cpvDescription: "Sewage treatment plant equipment",
    category: "Infrastructure",
    region: "Brasov",
    city: "Brasov",
    estimatedValueRON: 98_600_000,
    estimatedValueEUR: 19_830_000,
    submissionDeadline: "2026-05-10",
    publishDate: "2026-03-04",
    estimatedDuration: "28 months",
    guaranteeRON: 1_972_000,
    status: "new",
    matchScore: 82,
    documents: [
      { name: "Proiect tehnic STEP.pdf", type: "pdf", size: "18 MB", ocrProcessed: true },
      { name: "Studiu impact mediu.pdf", type: "pdf", size: "7.9 MB", ocrProcessed: true },
      { name: "Formulare.rar", type: "rar", size: "3.5 MB" },
    ],
    aiBrief: {
      summary: "Expansion of Brasov wastewater treatment plant from 120,000 PE to 200,000 PE capacity. New biological treatment line, sludge dewatering facility, biogas recovery system, and SCADA upgrade. POIM EU funding.",
      keyRequirements: [
        "Experience with WWTP projects >100,000 PE (min 1 project)",
        "FIDIC Yellow Book contract conditions",
        "18-month defect notification period",
        "Environmental permit compliance throughout construction",
      ],
      certifications: ["ISO 9001:2015", "ISO 14001:2015", "ISO 45001:2018"],
      estimatedTimeline: "28 months: design finalization 4mo, civil works 12mo, equipment 8mo, commissioning 4mo",
      riskFlags: ["FIDIC Yellow Book - design responsibility shared", "Complex environmental requirements", "Must maintain existing plant operations"],
    },
  },
  // Hidden tenders (revealed by scan)
  {
    id: "T-008",
    seapId: "CN1087956",
    title: "Constructia campusului scolar integrat - Municipiul Sibiu",
    authority: "Primaria Municipiului Sibiu",
    cpvCode: "45214200-2",
    cpvDescription: "School building construction",
    category: "Buildings",
    region: "Sibiu",
    city: "Sibiu",
    estimatedValueRON: 73_100_000,
    estimatedValueEUR: 14_700_000,
    submissionDeadline: "2026-05-15",
    publishDate: "2026-03-04",
    estimatedDuration: "20 months",
    guaranteeRON: 1_462_000,
    status: "new",
    matchScore: 90,
    documents: [
      { name: "Proiect tehnic campus.pdf", type: "pdf", size: "28 MB", ocrProcessed: true },
      { name: "Studiu geotehnic.pdf", type: "pdf", size: "3.8 MB" },
      { name: "Deviz estimativ.xlsx", type: "xlsx", size: "2.1 MB" },
    ],
    aiBrief: {
      summary: "New integrated school campus in Sibiu: primary school (600 students), gymnasium (400 students), sports hall, cafeteria, and outdoor facilities. Passive house standard, timber-hybrid structure. PNRR Pillar VI funded.",
      keyRequirements: [
        "Minimum 2 educational facility projects in last 7 years",
        "Passive house / nZEB construction experience",
        "Timber-hybrid structure experience preferred",
        "Completion by September 2028 school year start",
      ],
      certifications: ["ISO 9001:2015", "ISO 14001:2015", "Passive House certification preferred"],
      estimatedTimeline: "20 months: foundations 3mo, structure 7mo, finishes 7mo, commissioning 3mo",
      riskFlags: ["Fixed school year deadline", "Innovative timber-hybrid method", "High match - prioritize this tender"],
    },
    hidden: true,
  },
  {
    id: "T-009",
    seapId: "CN1087983",
    title: "Reabilitarea podului peste raul Olt - DN7 km 234",
    authority: "CNAIR - Directia Regionala Sibiu",
    cpvCode: "45221100-3",
    cpvDescription: "Bridge construction",
    category: "Infrastructure",
    region: "Valcea",
    city: "Ramnicu Valcea",
    estimatedValueRON: 28_400_000,
    estimatedValueEUR: 5_710_000,
    submissionDeadline: "2026-04-25",
    publishDate: "2026-03-04",
    estimatedDuration: "14 months",
    guaranteeRON: 568_000,
    status: "new",
    matchScore: 76,
    documents: [
      { name: "Expertiza tehnica pod.pdf", type: "pdf", size: "6.2 MB", ocrProcessed: true },
      { name: "Proiect consolidare.pdf", type: "pdf", size: "4.5 MB" },
    ],
    aiBrief: {
      summary: "Rehabilitation of 120m reinforced concrete bridge over Olt River on DN7. Structural strengthening, deck replacement, seismic isolation bearings, expansion joints, and approach road improvements. Bridge rated urgent by CNAIR inspection.",
      keyRequirements: [
        "Bridge rehabilitation experience mandatory (min 2 projects)",
        "Work under traffic - one lane open at all times",
        "Seismic zone 5 compliance",
        "Temporary bridge solution during deck replacement",
      ],
      certifications: ["ISO 9001:2015", "ISO 14001:2015", "CNAIR bridge contractor registration"],
      estimatedTimeline: "14 months including 3-month weather restriction period",
      riskFlags: ["Work over active waterway", "Traffic management complexity", "Lower value but good experience builder"],
    },
    hidden: true,
  },
  {
    id: "T-010",
    seapId: "CN1088012",
    title: "Modernizarea sistemului de incalzire centralizata - Municipiul Craiova",
    authority: "Primaria Municipiului Craiova",
    cpvCode: "45232140-5",
    cpvDescription: "District heating main construction",
    category: "Energy",
    region: "Dolj",
    city: "Craiova",
    estimatedValueRON: 112_800_000,
    estimatedValueEUR: 22_680_000,
    submissionDeadline: "2026-05-20",
    publishDate: "2026-03-04",
    estimatedDuration: "36 months",
    guaranteeRON: 2_256_000,
    status: "new",
    matchScore: 86,
    documents: [
      { name: "Studiu fezabilitate.pdf", type: "pdf", size: "14 MB", ocrProcessed: true },
      { name: "Audit energetic retea.pdf", type: "pdf", size: "6.8 MB", ocrProcessed: true },
      { name: "Analiza cost-beneficiu.p7s", type: "p7s", size: "3.2 MB", ocrProcessed: true },
      { name: "Formulare participare.rar", type: "rar", size: "1.8 MB" },
    ],
    aiBrief: {
      summary: "Complete modernization of Craiova district heating system: 85km of pre-insulated pipeline replacement, 3 new heat exchanger stations, smart metering for 15,000 apartments, and CHP plant efficiency upgrade. EU Modernization Fund.",
      keyRequirements: [
        "District heating experience mandatory (min 1 project >50M RON)",
        "Pre-insulated pipeline installation capability",
        "Smart metering system integration experience",
        "Minimum 30% local workforce requirement",
      ],
      certifications: ["ISO 9001:2015", "ISO 14001:2015", "ISO 45001:2018", "ISCIR authorization"],
      estimatedTimeline: "36 months in 3 annual phases (summer construction windows for pipeline work)",
      riskFlags: ["Very long project duration", "Seasonal construction restrictions", "High match - energy infrastructure expertise needed"],
    },
    hidden: true,
  },
]

export const tenderStats = {
  totalTenders: 23,
  newToday: 4,
  highValue: 8,
  avgValueRON: 34_200_000,
  sourcesActive: 3,
  regionsMonitored: 8,
  lastScanTime: "2026-03-04T08:45:00",
  categoryBreakdown: [
    { category: "Infrastructure", count: 9 },
    { category: "Buildings", count: 6 },
    { category: "Energy", count: 5 },
    { category: "Industrial", count: 3 },
  ],
  regionBreakdown: [
    { region: "Bucuresti", count: 5 },
    { region: "Cluj", count: 4 },
    { region: "Timis", count: 3 },
    { region: "Constanta", count: 3 },
    { region: "Brasov", count: 3 },
    { region: "Iasi", count: 2 },
    { region: "Prahova", count: 2 },
    { region: "Sibiu", count: 1 },
  ],
}
