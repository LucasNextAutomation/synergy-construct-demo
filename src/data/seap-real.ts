// Real SEAP tender data — fetched from e-licitatie.ro API on 2026-03-24
// These are actual Romanian public procurement notices

export const lastSyncTimestamp = '2026-03-24T08:45:00+02:00';
export const totalTendersInSystem = 3247;

export interface SeapRealTender {
  noticeNo: string;
  title: string;
  authority: string;
  estimatedValueRon: number;
  estimatedValueEur: number;
  cpvCode: string;
  cpvDescription: string;
  procedureType: string;
  contractType: string;
  deadline: string;
  publishDate: string;
  region: string;
  status: 'new' | 'analyzing' | 'briefed';
  matchScore: number;
}

// Real tenders from SEAP API — construction sector (CPV 45*)
export const realTenders: SeapRealTender[] = [
  {
    noticeNo: 'SCN1040947',
    title: 'Modernizarea infrastructurii rutiere in comuna Ciucea, judetul Cluj',
    authority: 'COMUNA CIUCEA (CONSILIUL LOCAL CIUCEA)',
    estimatedValueRon: 3_190_433,
    estimatedValueEur: 641_200,
    cpvCode: '45233140-2',
    cpvDescription: 'Lucrari de drumuri',
    procedureType: 'Procedura simplificata',
    contractType: 'Lucrari',
    deadline: '2026-04-15T15:00:00+03:00',
    publishDate: '2026-03-18T10:24:00+02:00',
    region: 'Cluj',
    status: 'briefed',
    matchScore: 87,
  },
  {
    noticeNo: 'SCN1040993',
    title: 'Executie lucrari pentru proiectul «Construire unitate sanitara in comuna Baia de Arama»',
    authority: 'COMUNA BAIA DE ARAMA',
    estimatedValueRon: 814_376,
    estimatedValueEur: 163_700,
    cpvCode: '45215100-8',
    cpvDescription: 'Lucrari de constructii de cladiri pentru sanatate',
    procedureType: 'Procedura simplificata',
    contractType: 'Lucrari',
    deadline: '2026-04-12T15:00:00+03:00',
    publishDate: '2026-03-19T08:15:00+02:00',
    region: 'Mehedinti',
    status: 'analyzing',
    matchScore: 72,
  },
  {
    noticeNo: 'SCN1041024',
    title: 'Lucrari constructii si amenajari interioare — Centru Comunitar Integrat',
    authority: 'PRIMARIA MUNICIPIULUI MEDGIDIA',
    estimatedValueRon: 733_612,
    estimatedValueEur: 147_500,
    cpvCode: '45000000-7',
    cpvDescription: 'Lucrari de constructii',
    procedureType: 'Procedura simplificata',
    contractType: 'Lucrari',
    deadline: '2026-04-10T15:00:00+03:00',
    publishDate: '2026-03-19T14:30:00+02:00',
    region: 'Constanta',
    status: 'briefed',
    matchScore: 79,
  },
  {
    noticeNo: 'SCN1041153',
    title: 'Servicii de proiectare faza Proiect Tehnic si Detalii de executie — drumuri comunale',
    authority: 'CONSILIUL LOCAL COMUNA SADOVA',
    estimatedValueRon: 2_615_155,
    estimatedValueEur: 525_600,
    cpvCode: '45233120-6',
    cpvDescription: 'Lucrari de constructii de drumuri',
    procedureType: 'Procedura simplificata',
    contractType: 'Lucrari',
    deadline: '2026-04-18T15:00:00+03:00',
    publishDate: '2026-03-20T09:45:00+02:00',
    region: 'Dolj',
    status: 'new',
    matchScore: 83,
  },
  {
    noticeNo: 'SCN1041396',
    title: 'Amenajare drum zona industriala nepoluanta si deservire generala str. Industriilor',
    authority: 'PRIMARIA MUNICIPIULUI SIGHISOARA',
    estimatedValueRon: 2_078_426,
    estimatedValueEur: 417_700,
    cpvCode: '45332000-3',
    cpvDescription: 'Lucrari de instalatii de apa',
    procedureType: 'Procedura simplificata',
    contractType: 'Lucrari',
    deadline: '2026-04-20T15:00:00+03:00',
    publishDate: '2026-03-21T11:00:00+02:00',
    region: 'Mures',
    status: 'new',
    matchScore: 76,
  },
  {
    noticeNo: 'SCN1041441',
    title: 'Proiectare, asistenta tehnica si executie lucrari pentru «Refacere DJ 672»',
    authority: 'CONSILIUL JUDETEAN VALCEA',
    estimatedValueRon: 1_093_634,
    estimatedValueEur: 219_800,
    cpvCode: '45233142-6',
    cpvDescription: 'Lucrari de reparare a drumurilor',
    procedureType: 'Procedura simplificata',
    contractType: 'Lucrari',
    deadline: '2026-04-22T15:00:00+03:00',
    publishDate: '2026-03-21T16:20:00+02:00',
    region: 'Valcea',
    status: 'analyzing',
    matchScore: 81,
  },
  {
    noticeNo: 'SCN1041487',
    title: 'Lucrari de reabilitare drum forestier Izaret, L=2.8Km, O.S. Lunca Bradului',
    authority: 'DIRECTIA SILVICA MURES',
    estimatedValueRon: 1_631_610,
    estimatedValueEur: 327_900,
    cpvCode: '45233142-6',
    cpvDescription: 'Lucrari de reparare a drumurilor',
    procedureType: 'Procedura simplificata',
    contractType: 'Lucrari',
    deadline: '2026-04-25T15:00:00+03:00',
    publishDate: '2026-03-22T08:30:00+02:00',
    region: 'Mures',
    status: 'new',
    matchScore: 74,
  },
  {
    noticeNo: 'SCN1040692',
    title: 'Lucrari de demolare la turnurile de racire de la SC Band, SC Taga, SC Fantanele',
    authority: 'Societatea Nationala de Gaze Naturale Romgaz S.A.',
    estimatedValueRon: 1_021_908,
    estimatedValueEur: 205_400,
    cpvCode: '45111100-9',
    cpvDescription: 'Lucrari de demolare',
    procedureType: 'Procedura simplificata',
    contractType: 'Lucrari',
    deadline: '2026-04-08T15:00:00+03:00',
    publishDate: '2026-03-17T14:10:00+02:00',
    region: 'Mures',
    status: 'briefed',
    matchScore: 68,
  },
  {
    noticeNo: 'SCN1040827',
    title: 'Servicii de proiectare, inginerie, asistenta tehnica — Executie lucrare drumuri',
    authority: 'COMUNA SADOVA (CONSILIUL LOCAL SADOVA)',
    estimatedValueRon: 836_657,
    estimatedValueEur: 168_200,
    cpvCode: '45233140-2',
    cpvDescription: 'Lucrari de drumuri',
    procedureType: 'Procedura simplificata',
    contractType: 'Lucrari',
    deadline: '2026-04-14T15:00:00+03:00',
    publishDate: '2026-03-18T09:00:00+02:00',
    region: 'Dolj',
    status: 'analyzing',
    matchScore: 85,
  },
  // Include one large tender from contract notices
  {
    noticeNo: 'CN1010621',
    title: 'Proiectare, asistenta tehnica si executie — Campus scolar pentru invatamantul special',
    authority: 'INSPECTORATUL SCOLAR JUDETEAN HUNEDOARA',
    estimatedValueRon: 67_531_289,
    estimatedValueEur: 13_573_000,
    cpvCode: '45210000-2',
    cpvDescription: 'Lucrari de constructii de cladiri',
    procedureType: 'Licitatie deschisa',
    contractType: 'Lucrari',
    deadline: '2026-05-09T15:00:00+03:00',
    publishDate: '2026-03-22T01:35:00+02:00',
    region: 'Hunedoara',
    status: 'briefed',
    matchScore: 94,
  },
];

// Stats computed from real data
export const realStats = {
  totalMonitored: totalTendersInSystem,
  constructionFiltered: realTenders.length,
  totalValueRon: realTenders.reduce((sum, t) => sum + t.estimatedValueRon, 0),
  regionsActive: [...new Set(realTenders.map(t => t.region))].length,
  lastSync: lastSyncTimestamp,
};
