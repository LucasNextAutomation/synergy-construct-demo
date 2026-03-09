export interface ROIScenario {
  label: string
  annualReturn: number
  totalReturn5yr: number
}

export interface InvestmentAnalysis {
  thesis: string
  comparables: string[]
  risks: string[]
  roiScenarios: ROIScenario[]
}

export interface Investment {
  id: string
  type: "Land" | "Building" | "Mixed-use"
  title: string
  location: string
  county: string
  city: string
  marketValueEUR: number
  listedPriceEUR: number
  discountPercent: number
  sizeSqm: number
  lotSizeSqm?: number
  yearBuilt?: number
  source: "ANAF" | "UNPIR" | "imobiliare.ro" | "storia.ro" | "executari.com" | "ANABI"
  investmentScore: number
  status: "new" | "analyzing" | "shortlisted" | "passed"
  auctionDate?: string
  cadastreRef: string
  landRegistryRef: string
  contactInfo?: string
  analysis: InvestmentAnalysis
  hidden?: boolean
}

export const mockInvestments: Investment[] = [
  {
    id: "INV-001",
    type: "Building",
    title: "Cladire comerciala centrala - B-dul Magheru, Bucuresti",
    location: "B-dul General Gheorghe Magheru 28",
    county: "Bucuresti",
    city: "Bucuresti",
    marketValueEUR: 1_850_000,
    listedPriceEUR: 1_290_000,
    discountPercent: 30,
    sizeSqm: 1_200,
    yearBuilt: 1938,
    source: "UNPIR",
    investmentScore: 94,
    status: "shortlisted",
    auctionDate: "2026-03-28",
    cadastreRef: "CF 234891-C1-Bucuresti S1",
    landRegistryRef: "Nr. top 12456/1",
    contactInfo: "CITR - Lichidator judiciar, tel: +40 21 319 7800",
    analysis: {
      thesis: "Prime location on Magheru Boulevard, Bucharest's main commercial artery. Building from interwar period with heritage value. Insolvency auction at 30% below market due to previous owner's bankruptcy. Ideal for boutique hotel conversion or premium office space. Area undergoing rapid gentrification with new metro station 200m away.",
      comparables: [
        "B-dul Magheru 15 - sold Q4 2025 for 2,100 EUR/sqm (office conversion)",
        "Str. CA Rosetti 12 - listed at 1,950 EUR/sqm (similar heritage building)",
        "B-dul Balcescu 8 - sold Q1 2026 for 2,400 EUR/sqm (boutique hotel)",
      ],
      risks: [
        "Heritage building - renovation restrictions apply (monument category B)",
        "Potential structural issues due to age - seismic assessment needed",
        "Insolvency procedure may have encumbrances - legal due diligence required",
        "Tenant relocation costs if currently occupied",
      ],
      roiScenarios: [
        { label: "Conservative (office)", annualReturn: 8.5, totalReturn5yr: 52 },
        { label: "Moderate (mixed-use)", annualReturn: 12.3, totalReturn5yr: 78 },
        { label: "Aggressive (hotel conversion)", annualReturn: 18.7, totalReturn5yr: 135 },
      ],
    },
  },
  {
    id: "INV-002",
    type: "Land",
    title: "Teren intravilan 5,200mp - zona industriala Cluj-Napoca",
    location: "Str. Fabricii FN, Cluj-Napoca",
    county: "Cluj",
    city: "Cluj-Napoca",
    marketValueEUR: 780_000,
    listedPriceEUR: 520_000,
    discountPercent: 33,
    sizeSqm: 5_200,
    lotSizeSqm: 5_200,
    source: "ANAF",
    investmentScore: 89,
    status: "new",
    auctionDate: "2026-04-05",
    cadastreRef: "CF 312567-Cluj-Napoca",
    landRegistryRef: "Nr. cad. 312567",
    analysis: {
      thesis: "Industrial-zoned intravilan land in Cluj's expanding tech/logistics corridor. ANAF seizure auction at 33% discount. Adjacent to new Tetarom IV industrial park. Perfect for warehouse/logistics development given Cluj's booming e-commerce sector. Utilities available at plot boundary.",
      comparables: [
        "Str. Fabricii lot 12 - sold Q3 2025 for 165 EUR/sqm (industrial)",
        "Tetarom III adjacent - listed at 180 EUR/sqm (developed lots)",
        "Floresti industrial zone - sold Q1 2026 for 120 EUR/sqm (raw land)",
      ],
      risks: [
        "ANAF auction - verify no additional tax liens",
        "Environmental assessment may be needed (former industrial use)",
        "Check PUZ zoning restrictions for building height/coverage",
        "Adjacent to flood-risk area - verify flood map status",
      ],
      roiScenarios: [
        { label: "Conservative (land hold)", annualReturn: 7.2, totalReturn5yr: 42 },
        { label: "Moderate (warehouse dev)", annualReturn: 14.5, totalReturn5yr: 95 },
        { label: "Aggressive (tech park)", annualReturn: 22.0, totalReturn5yr: 165 },
      ],
    },
  },
  {
    id: "INV-003",
    type: "Building",
    title: "Hala industriala 3,800mp cu teren 8,000mp - Timisoara",
    location: "Calea Sagului 152, Timisoara",
    county: "Timis",
    city: "Timisoara",
    marketValueEUR: 1_200_000,
    listedPriceEUR: 890_000,
    discountPercent: 26,
    sizeSqm: 3_800,
    lotSizeSqm: 8_000,
    yearBuilt: 2004,
    source: "executari.com",
    investmentScore: 86,
    status: "analyzing",
    cadastreRef: "CF 418923-Timisoara",
    landRegistryRef: "Nr. cad. 418923-C1",
    contactInfo: "BEJ Popescu Andrei, tel: +40 256 294 100",
    analysis: {
      thesis: "Modern industrial hall with generous land plot on Timisoara's main industrial corridor. Forced execution sale from logistics company bankruptcy. Building in good condition (2004 construction), 10m clear height, 3 loading docks. Excellent rental demand from auto parts suppliers serving nearby Continental and Hella plants.",
      comparables: [
        "Calea Sagului 180 - rented at 4.2 EUR/sqm/month (similar hall)",
        "Zona Industriala Vest - sold Q4 2025 at 350 EUR/sqm (hall + land)",
        "Freidorf area - listed at 280 EUR/sqm (older industrial)",
      ],
      risks: [
        "Forced execution - verify lien clearance timeline",
        "Check environmental compliance certificates",
        "Roof condition assessment needed (20+ years old)",
        "Verify utility capacity for potential expansion",
      ],
      roiScenarios: [
        { label: "Conservative (rental as-is)", annualReturn: 9.8, totalReturn5yr: 60 },
        { label: "Moderate (renovate + lease)", annualReturn: 13.5, totalReturn5yr: 88 },
        { label: "Aggressive (expand + subdivide)", annualReturn: 17.2, totalReturn5yr: 120 },
      ],
    },
  },
  {
    id: "INV-004",
    type: "Land",
    title: "Teren agricol extravilan 22ha - limita Brasov",
    location: "Sat Cristian, limita municipiu Brasov",
    county: "Brasov",
    city: "Cristian",
    marketValueEUR: 1_540_000,
    listedPriceEUR: 1_100_000,
    discountPercent: 29,
    sizeSqm: 220_000,
    lotSizeSqm: 220_000,
    source: "imobiliare.ro",
    investmentScore: 83,
    status: "new",
    cadastreRef: "CF 102345-Cristian",
    landRegistryRef: "Nr. cad. 102345",
    analysis: {
      thesis: "Large agricultural plot at Brasov city limit with conversion potential. PUG revision underway that may reclassify to intravilan (residential). Seller motivated due to inheritance dispute resolution. If rezoned, land value could triple. Close to new Brasov-Cristian bypass road under construction.",
      comparables: [
        "Cristian intravilan lots - selling at 35-45 EUR/sqm",
        "Brasov limit extravilan - 5-8 EUR/sqm (current agricultural)",
        "Ghimbav (post-rezone) - appreciated from 7 to 40 EUR/sqm in 3 years",
      ],
      risks: [
        "Rezoning not guaranteed - PUG approval timeline 12-24 months",
        "Agricultural land purchase restrictions (pre-emption rights)",
        "Infrastructure costs if rezoned (roads, utilities to be developer-funded)",
        "Inheritance dispute resolution must be verified complete",
      ],
      roiScenarios: [
        { label: "Conservative (no rezone)", annualReturn: 4.5, totalReturn5yr: 25 },
        { label: "Moderate (partial rezone)", annualReturn: 15.0, totalReturn5yr: 105 },
        { label: "Aggressive (full rezone + develop)", annualReturn: 28.0, totalReturn5yr: 240 },
      ],
    },
  },
  {
    id: "INV-005",
    type: "Mixed-use",
    title: "Imobil P+2E - centrul istoric Sibiu",
    location: "Piata Mica 14, Sibiu",
    county: "Sibiu",
    city: "Sibiu",
    marketValueEUR: 920_000,
    listedPriceEUR: 680_000,
    discountPercent: 26,
    sizeSqm: 650,
    yearBuilt: 1780,
    source: "UNPIR",
    investmentScore: 91,
    status: "shortlisted",
    auctionDate: "2026-03-22",
    cadastreRef: "CF 178234-Sibiu",
    landRegistryRef: "Nr. top 456/1/2",
    contactInfo: "Euro Insol SPRL, tel: +40 269 211 500",
    analysis: {
      thesis: "Exceptional location in Sibiu's historic Small Square (Piata Mica), UNESCO World Heritage buffer zone. 3-story building from 1780 with original architectural details. Insolvency sale at significant discount. Ground floor ideal for premium retail/restaurant, upper floors for boutique apartments or Airbnb. Sibiu tourism growing 15% annually.",
      comparables: [
        "Piata Mare 8 - sold 2025 for 1,800 EUR/sqm (full renovation)",
        "Str. Nicolae Balcescu 3 - listed at 1,500 EUR/sqm (partial renovation)",
        "Piata Mica 9 - Airbnb generating 45,000 EUR/year gross (similar size)",
      ],
      risks: [
        "Heritage zone - strict renovation requirements (Monumentelor approval)",
        "Structural assessment essential (240+ years old)",
        "Higher renovation costs in heritage buildings (+30-50%)",
        "Insolvency sale - verify clean title transfer",
      ],
      roiScenarios: [
        { label: "Conservative (restore + rent)", annualReturn: 7.8, totalReturn5yr: 47 },
        { label: "Moderate (boutique apartments)", annualReturn: 14.2, totalReturn5yr: 96 },
        { label: "Aggressive (premium hospitality)", annualReturn: 19.5, totalReturn5yr: 145 },
      ],
    },
  },
  {
    id: "INV-006",
    type: "Building",
    title: "Spatiu comercial 450mp - Centrul Vechi Constanta",
    location: "Str. Stefan cel Mare 78, Constanta",
    county: "Constanta",
    city: "Constanta",
    marketValueEUR: 380_000,
    listedPriceEUR: 285_000,
    discountPercent: 25,
    sizeSqm: 450,
    yearBuilt: 1955,
    source: "ANABI",
    investmentScore: 77,
    status: "analyzing",
    cadastreRef: "CF 223456-Constanta",
    landRegistryRef: "Nr. cad. 223456-C1",
    analysis: {
      thesis: "Commercial space in Constanta's old center, confiscated asset from corruption case. Below market due to forced sale nature. Area benefiting from EU-funded urban regeneration program. Good footfall location near the port and tourist area. Suitable for restaurant, retail, or co-working space.",
      comparables: [
        "Str. Stefan cel Mare 52 - rented at 8 EUR/sqm/month",
        "B-dul Tomis (nearby) - sold Q3 2025 at 950 EUR/sqm",
        "Centrul Vechi - average asking 750-900 EUR/sqm",
      ],
      risks: [
        "ANABI confiscated asset - legal process may take 3-6 months to complete",
        "Building condition needs assessment (1955 construction)",
        "Constanta seasonal tourism economy - winter vacancy risk",
        "Urban regeneration works nearby may cause temporary access issues",
      ],
      roiScenarios: [
        { label: "Conservative (basic renovation + rent)", annualReturn: 8.2, totalReturn5yr: 50 },
        { label: "Moderate (full reno + premium tenant)", annualReturn: 12.8, totalReturn5yr: 82 },
        { label: "Aggressive (convert to hospitality)", annualReturn: 16.0, totalReturn5yr: 110 },
      ],
    },
  },
  {
    id: "INV-007",
    type: "Land",
    title: "Teren intravilan 3,100mp - zona rezidentiala Iasi",
    location: "Str. Bucium FN, Iasi",
    county: "Iasi",
    city: "Iasi",
    marketValueEUR: 465_000,
    listedPriceEUR: 340_000,
    discountPercent: 27,
    sizeSqm: 3_100,
    lotSizeSqm: 3_100,
    source: "storia.ro",
    investmentScore: 80,
    status: "new",
    cadastreRef: "CF 456789-Iasi",
    landRegistryRef: "Nr. cad. 456789",
    analysis: {
      thesis: "Residential-zoned land in Iasi's premium Bucium neighborhood with panoramic city views. Motivated seller (divorce settlement). Ideal for small residential development (6-8 townhouses). Area has strong demand from IT professionals working at Amazon, Continental, and Endava offices in Iasi.",
      comparables: [
        "Str. Bucium (nearby lots) - selling at 160-180 EUR/sqm",
        "Developed townhouses in area - selling at 1,400-1,600 EUR/sqm",
        "Similar lot Galata hill - sold Q4 2025 at 145 EUR/sqm",
      ],
      risks: [
        "Sloped terrain - additional foundation costs",
        "Access road may need widening (check PUZ)",
        "Utility connections distance needs verification",
        "Divorce settlement sale - ensure both parties agree",
      ],
      roiScenarios: [
        { label: "Conservative (land hold 3yr)", annualReturn: 8.0, totalReturn5yr: 48 },
        { label: "Moderate (4 townhouses)", annualReturn: 18.5, totalReturn5yr: 130 },
        { label: "Aggressive (8 townhouses + sell)", annualReturn: 25.0, totalReturn5yr: 190 },
      ],
    },
  },
  // Hidden investments (revealed by scan)
  {
    id: "INV-008",
    type: "Building",
    title: "Complex hotelier abandoned 2,800mp - Sinaia",
    location: "B-dul Carol I 85, Sinaia",
    county: "Prahova",
    city: "Sinaia",
    marketValueEUR: 2_100_000,
    listedPriceEUR: 1_350_000,
    discountPercent: 36,
    sizeSqm: 2_800,
    lotSizeSqm: 4_500,
    yearBuilt: 1972,
    source: "executari.com",
    investmentScore: 88,
    status: "new",
    auctionDate: "2026-04-12",
    cadastreRef: "CF 567890-Sinaia",
    landRegistryRef: "Nr. cad. 567890-C1",
    contactInfo: "BEJ Ionescu Maria, tel: +40 244 311 200",
    analysis: {
      thesis: "Former 3-star hotel on Sinaia's main boulevard, abandoned since 2020. Forced execution at 36% below market. Prime mountain resort location near Peles Castle. Romania's ski tourism booming post-COVID. Hotel conversion to 4-star boutique with 45 rooms would capture premium segment. Romanian government offering 50% grants for mountain tourism through PNRR.",
      comparables: [
        "Hotel similar Sinaia - sold 2025 at 850 EUR/sqm (renovated)",
        "Predeal resort project - 1,200 EUR/sqm after renovation",
        "Busteni hotel - operating at 75% occupancy, 120 EUR/night avg",
      ],
      risks: [
        "Major renovation needed (abandoned 6 years)",
        "Heritage area restrictions possible",
        "Seasonal tourism - 60% revenue concentrated in 5 months",
        "PNRR grant application competitive",
      ],
      roiScenarios: [
        { label: "Conservative (basic refurb + operate)", annualReturn: 9.5, totalReturn5yr: 58 },
        { label: "Moderate (4-star conversion)", annualReturn: 16.8, totalReturn5yr: 118 },
        { label: "Aggressive (luxury boutique + spa)", annualReturn: 22.5, totalReturn5yr: 170 },
      ],
    },
    hidden: true,
  },
  {
    id: "INV-009",
    type: "Land",
    title: "Teren industrial 12,000mp cu PUZ aprobat - Arad",
    location: "Zona Industriala Vest, Arad",
    county: "Arad",
    city: "Arad",
    marketValueEUR: 600_000,
    listedPriceEUR: 360_000,
    discountPercent: 40,
    sizeSqm: 12_000,
    lotSizeSqm: 12_000,
    source: "ANAF",
    investmentScore: 92,
    status: "new",
    auctionDate: "2026-03-30",
    cadastreRef: "CF 678901-Arad",
    landRegistryRef: "Nr. cad. 678901",
    analysis: {
      thesis: "Industrial land with approved PUZ in Arad's western industrial zone, ANAF tax seizure at exceptional 40% discount. All utilities at boundary. Adjacent to automotive suppliers (Arad is Romania's #2 auto manufacturing hub after Pitesti). Pre-approved for up to 8,000 sqm built area. Immediate development possible.",
      comparables: [
        "Zona Industriala Vest - recent sales at 55-65 EUR/sqm",
        "Curtici logistics park - 48 EUR/sqm (less developed area)",
        "Arad industrial average - 45-60 EUR/sqm for serviced plots",
      ],
      risks: [
        "ANAF auction - final price may increase with competition",
        "Verify no environmental contamination (previous industrial use)",
        "Check flood risk map (proximity to Mures river)",
        "PUZ validity period - confirm not expired",
      ],
      roiScenarios: [
        { label: "Conservative (hold + resell)", annualReturn: 12.0, totalReturn5yr: 76 },
        { label: "Moderate (build-to-suit)", annualReturn: 20.5, totalReturn5yr: 150 },
        { label: "Aggressive (spec warehouse + lease)", annualReturn: 27.0, totalReturn5yr: 210 },
      ],
    },
    hidden: true,
  },
  {
    id: "INV-010",
    type: "Mixed-use",
    title: "Imobil P+3E cu spatii comerciale - Centrul Istoric Brasov",
    location: "Str. Republicii 22, Brasov",
    county: "Brasov",
    city: "Brasov",
    marketValueEUR: 1_650_000,
    listedPriceEUR: 1_155_000,
    discountPercent: 30,
    sizeSqm: 980,
    yearBuilt: 1890,
    source: "UNPIR",
    investmentScore: 93,
    status: "new",
    auctionDate: "2026-04-18",
    cadastreRef: "CF 789012-Brasov",
    landRegistryRef: "Nr. top 789/1",
    contactInfo: "KPMG Restructuring SPRL, tel: +40 268 404 500",
    analysis: {
      thesis: "Trophy asset on Strada Republicii (Brasov's pedestrian main street). 4-story building from 1890 with commercial ground floor and residential upper floors. Insolvency sale at 30% discount. Brasov is Romania's #1 tourist city after Bucharest. Ground floor retail commands premium rents (25-35 EUR/sqm/month). Upper floors ideal for premium short-term rentals.",
      comparables: [
        "Str. Republicii 15 - ground floor rented at 30 EUR/sqm/month",
        "Str. Republicii 8 - sold 2025 at 2,100 EUR/sqm (fully renovated)",
        "Piata Sfatului area Airbnb - generating 50-80 EUR/night per unit",
      ],
      risks: [
        "Heritage zone Category A - strictest renovation requirements",
        "Structural assessment critical (130+ years old building)",
        "Insolvency procedure timeline may extend 6-12 months",
        "High renovation costs in heritage zone",
      ],
      roiScenarios: [
        { label: "Conservative (minor reno + rent)", annualReturn: 8.0, totalReturn5yr: 48 },
        { label: "Moderate (renovate + mixed income)", annualReturn: 15.5, totalReturn5yr: 108 },
        { label: "Aggressive (luxury conversion)", annualReturn: 21.0, totalReturn5yr: 160 },
      ],
    },
    hidden: true,
  },
]

export const investmentStats = {
  totalOpportunities: 31,
  highScore: 7,
  belowMarket: 12,
  newThisWeek: 9,
  sourcesActive: 6,
  lastScanTime: "2026-03-04T09:15:00",
  sourceBreakdown: [
    { source: "ANAF", count: 8 },
    { source: "UNPIR", count: 7 },
    { source: "imobiliare.ro", count: 6 },
    { source: "storia.ro", count: 4 },
    { source: "executari.com", count: 4 },
    { source: "ANABI", count: 2 },
  ],
  typeBreakdown: [
    { type: "Land", count: 13 },
    { type: "Building", count: 12 },
    { type: "Mixed-use", count: 6 },
  ],
  regionBreakdown: [
    { region: "Bucuresti", count: 7 },
    { region: "Cluj", count: 5 },
    { region: "Brasov", count: 4 },
    { region: "Timis", count: 4 },
    { region: "Constanta", count: 3 },
    { region: "Iasi", count: 3 },
    { region: "Sibiu", count: 2 },
    { region: "Others", count: 3 },
  ],
}
