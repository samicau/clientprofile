import { useState, useMemo, useRef, useEffect } from 'react';

// ── Icon helper ────────────────────────────────────────────────
function Ic({ d, size = 16, className = '', sw = 1.75 }: {
  d: string; size?: number; className?: string; sw?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <path d={d} />
    </svg>
  );
}

const I = {
  building:    "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21",
  bank:        "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
  users:       "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
  cube:        "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9",
  dollar:      "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  doc:         "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
  folder:      "M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z",
  shield:      "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  chevDown:    "M19.5 8.25l-7.5 7.5-7.5-7.5",
  chevUp:      "M4.5 15.75l7.5-7.5 7.5 7.5",
  chevRight:   "M8.25 4.5l7.5 7.5-7.5 7.5",
  arrowLeft:   "M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18",
  search:      "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  funnel:      "M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z",
  trash:       "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0",
  plus:        "M12 4.5v15m7.5-7.5h-15",
  check:       "M4.5 12.75l6 6 9-13.5",
  warn:        "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
  globe:       "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
  checkCircle: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  briefcase:   "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z",
  refresh:     "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99",
  bookmark:    "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z",
  clock:       "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  updown:      "M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9",
  externalLink:"M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25",
  info:        "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z",
};

// ── Types ──────────────────────────────────────────────────────
type View = 'home' | 'detail';

interface LegalEntity {
  id: number;
  name: string;
  federalId: string;
  customerName: string;
  namespace: string;
  status: 'Setup' | 'Active' | 'Terminated' | 'Suspended';
  hasIncompleteTaxCodes?: boolean;
}

interface TaxRow {
  id: number; name: string; status: 'Active' | 'Incomplete';
  shortName: string; category: string; state: string;
  auth: string | null; rate: number | null; psd: string | null;
  isAuthorized: boolean; taxCode: string; ctsCode: string; entityId: number;
}

interface StatDef {
  label: string; value: string | number; sub: string;
  icon: string; iconBg: string; iconColor: string; accent: string;
  filter: string;
}

interface DashboardTaxCodeRow {
  id: number; taxCode: string; taxCodeNumber: string; entityId: number;
  addedDate: string; detailsOk: boolean; authRequired: boolean;
}

// ── Static data ────────────────────────────────────────────────
const ENTITIES: LegalEntity[] = [
  { id: 1,  name: 'Avengers',                         federalId: '12-3121212', customerName: 'Disney',                       namespace: 'Disney',                      status: 'Setup', hasIncompleteTaxCodes: true },
  { id: 2,  name: 'preprod test',                      federalId: '56-4323728', customerName: 'Sandhya',                      namespace: 'sandhya',                     status: 'Setup' },
  { id: 3,  name: 'File Demo 2',                       federalId: '87-6677878', customerName: 'Atlantic Tool',                namespace: 'MoveLegalEntitiesFrom64235',   status: 'Setup' },
  { id: 4,  name: 'ca tax code test',                  federalId: '21-5615158', customerName: 'DTP-20771',                    namespace: 'DTP20771 test',                status: 'Setup' },
  { id: 5,  name: 'DTP-21711-Test',                    federalId: '14-1457895', customerName: 'FM_MR Test Customer',          namespace: 'dtpmaster_site_65',            status: 'Setup' },
  { id: 6,  name: 'California Testing Dont Delete',    federalId: '00-7766115', customerName: 'California Testing VDI',       namespace: 'CA VDI Testing',              status: 'Active', hasIncompleteTaxCodes: true },
  { id: 7,  name: 'test',                              federalId: '71-1226848', customerName: 'walmart',                      namespace: 'Testing12345',                 status: 'Setup' },
  { id: 8,  name: 'test',                              federalId: '15-6186148', customerName: 'walmart',                      namespace: 'Testing12345',                 status: 'Setup' },
  { id: 9,  name: 'MONTANA INSTRUMENTS CORPORATIO',    federalId: '26-3355823', customerName: 'ATLAS COPCO NORTH AMERICA LLC', namespace: 'CNET-T9046-00',              status: 'Active' },
  { id: 10, name: 'DEKKER VACUUM TECHNOLOGIES INC',    federalId: '35-2036937', customerName: 'ATLAS COPCO NORTH AMERICA LLC', namespace: 'CNET-T9046-00',              status: 'Active' },
  { id: 11, name: 'AIR GAS SOLUTIONS LLC',             federalId: '85-3710843', customerName: 'ATLAS COPCO NORTH AMERICA LLC', namespace: 'CNET-T9046-00',              status: 'Active' },
  { id: 12, name: 'ATLAS COPCO RENTAL LLC',            federalId: '20-4789087', customerName: 'ATLAS COPCO NORTH AMERICA LLC', namespace: 'CNET-T9046-00',              status: 'Active' },
  { id: 13, name: 'ATLAS COPCO NORTH AMERICA LLC',     federalId: '20-5024915', customerName: 'ATLAS COPCO NORTH AMERICA LLC', namespace: 'CNET-T9046-00',              status: 'Active' },
  { id: 14, name: 'SCHEUGENPFLUG INC',                 federalId: '26-1471096', customerName: 'ATLAS COPCO NORTH AMERICA LLC', namespace: 'CNET-T9046-00',              status: 'Terminated' },
  { id: 15, name: 'MID-SOUTH ENGINE AND POWER SYS',    federalId: '46-4320006', customerName: 'ATLAS COPCO NORTH AMERICA LLC', namespace: 'CNET-T9046-00',              status: 'Active' },
  { id: 16, name: 'CH SPENCER LLC',                    federalId: '38-4036205', customerName: 'ATLAS COPCO NORTH AMERICA LLC', namespace: 'CNET-T9046-00',              status: 'Suspended', hasIncompleteTaxCodes: true },
  { id: 17, name: 'ATLAS COPCO TOOLS ASSEMBLY S',      federalId: '38-2561314', customerName: 'ATLAS COPCO NORTH AMERICA LLC', namespace: 'CNET-T9046-00',              status: 'Active' },
  { id: 18, name: 'BEACONMEDAES LLC',                  federalId: '56-2067998', customerName: 'ATLAS COPCO NORTH AMERICA LLC', namespace: 'CNET-T9046-00',              status: 'Active' },
  { id: 19, name: 'PERCEPTRON INC',                    federalId: '38-2381442', customerName: 'ATLAS COPCO NORTH AMERICA LLC', namespace: 'CNET-T9046-00',              status: 'Active' },
  { id: 20, name: 'QUINCY COMPRESSOR LLC',             federalId: '30-0592561', customerName: 'ATLAS COPCO NORTH AMERICA LLC', namespace: 'CNET-T9046-00',              status: 'Active' },
  { id: 21, name: 'INDUSTRIAL FLOW NORTH AMERICA',     federalId: '04-2446442', customerName: 'ATLAS COPCO NORTH AMERICA LLC', namespace: 'CNET-T9046-00',              status: 'Active' },
  { id: 22, name: 'HENROB CORPORATION',                federalId: '95-3853525', customerName: 'ATLAS COPCO NORTH AMERICA LLC', namespace: 'CNET-T9046-00',              status: 'Active' },
  { id: 23, name: 'POWER TECHNIQUE NORTH AMERICA',     federalId: '26-1990832', customerName: 'ATLAS COPCO NORTH AMERICA LLC', namespace: 'CNET-T9046-00',              status: 'Active' },
  { id: 24, name: 'COMPRESSOR TECHNIQUE SERVICE',      federalId: '33-2156789', customerName: 'ATLAS COPCO NORTH AMERICA LLC', namespace: 'CNET-T9046-00',              status: 'Active' },
  { id: 25, name: 'EDWARDS VACUUM LLC',                federalId: '22-4567890', customerName: 'ATLAS COPCO NORTH AMERICA LLC', namespace: 'CNET-T9046-00',              status: 'Active' },
];

const TAX_ROWS: TaxRow[] = [
  { id: 1,  name: 'Apple Creek Village (Wayne) - Withholding Tax',          status: 'Incomplete', shortName: 'APPLE CREEK VILLAGE RES',    category: 'Withholding Tax',            state: 'Ohio',    auth: 'Filing', rate: null, psd: null, isAuthorized: false, taxCode: 'USA-00000111-NR', ctsCode: 'CTS-39001', entityId: 1 },
  { id: 2,  name: 'Alabama State - Withholding Tax',                         status: 'Active',     shortName: 'AL SIT',                     category: 'Withholding Tax',            state: 'Alabama', auth: 'Filing', rate: null, psd: null, isAuthorized: true, taxCode: 'USA-00000222-NR', ctsCode: 'CTS-01002', entityId: 2 },
  { id: 3,  name: 'Alabama State - Employee Back Up Withholding',            status: 'Active',     shortName: 'AL BACKUP W/H',              category: 'Backup Withholding',         state: 'Alabama', auth: 'Filing', rate: null, psd: null, isAuthorized: true, taxCode: 'USA-00000333-NR', ctsCode: 'CTS-01003', entityId: 3 },
  { id: 4,  name: 'Alabama State - Employer Unemployment Tax',               status: 'Active',     shortName: 'AL SUI',                     category: 'Employer Unemployment Tax',  state: 'Alabama', auth: 'Filing', rate: 60.1, psd: null, isAuthorized: true, taxCode: 'USA-00000444-NR', ctsCode: 'CTS-01004', entityId: 4 },
  { id: 5,  name: 'Alabama State - Employer Security Assessment Tax',        status: 'Active',     shortName: 'AL SECURITY ASSESSMENT',     category: 'Employee Additional Medicare',state: 'Alabama', auth: 'Filing', rate: 64.1, psd: null, isAuthorized: false, taxCode: 'USA-00000555-NR', ctsCode: 'CTS-01005', entityId: 5 },
  { id: 6,  name: 'Attalla City (Etowah County) - Employee Occupational Tax',status: 'Active',     shortName: 'ATTALLA CITY TAX',           category: 'Employee Occupation Tax',    state: 'Alabama', auth: 'Filing', rate: 81.1, psd: null, isAuthorized: true, taxCode: 'USA-00000666-NR', ctsCode: 'CTS-01006', entityId: 6 },
  { id: 7,  name: 'Auburn City (Lee County) - Employee Occupational Tax',    status: 'Active',     shortName: 'AUBURN',                     category: 'Employee Occupation Tax',    state: 'Alabama', auth: 'Filing', rate: 67.1, psd: null, isAuthorized: false, taxCode: 'USA-00000777-NR', ctsCode: 'CTS-01007', entityId: 7 },
  { id: 8,  name: 'Bear Creek City (Marion County) - Employee Occupational Tax', status: 'Active', shortName: 'BEAR CREEK OCCUPATIONAL TAX', category: 'Employee Occupation Tax',   state: 'Alabama', auth: 'Filing', rate: 51.1, psd: null, isAuthorized: true, taxCode: 'USA-00000888-NR', ctsCode: 'CTS-01008', entityId: 8 },
  { id: 9,  name: 'Beaverton Town (Lamar County) - Employee Occupational Tax',status: 'Active',    shortName: 'BEAVERTON',                  category: 'Employee Occupation Tax',    state: 'Alabama', auth: 'Filing', rate: 64.1, psd: null, isAuthorized: false, taxCode: 'USA-00000999-NR', ctsCode: 'CTS-01009', entityId: 9 },
  { id: 10, name: 'Bessemer City (Jefferson County) - Employee Occupational Tax', status: 'Active',shortName: 'BESSEMER',                   category: 'Employee Occupation Tax',    state: 'Alabama', auth: 'Filing', rate: 47.1, psd: null, isAuthorized: true, taxCode: 'USA-00001110-NR', ctsCode: 'CTS-01010', entityId: 10 },
];

const DASHBOARD_TAX_CODES: DashboardTaxCodeRow[] = ENTITIES.map((entity, i) => {
  const code = TAX_ROWS[i % TAX_ROWS.length];
  return {
    id: entity.id,
    taxCode: code.shortName,
    taxCodeNumber: `USA-${(entity.id * 111).toString().padStart(8, '0')}-NR`,
    entityId: entity.id,
    addedDate: ['01/12/2025', '03/04/2025', '07/22/2025', '11/09/2025'][i % 4],
    detailsOk: !entity.hasIncompleteTaxCodes,
    authRequired: entity.id % 9 !== 0,
  };
});
const TOTAL_DASHBOARD_TAX_CODES = 18536;

const QUICK_LINKS: { label: string; icon: string }[] = [
  { label: 'Getting started with Tax & Payments', icon: I.doc },
  { label: 'Support portal',                      icon: I.shield },
  { label: 'Community portal',                     icon: I.users },
  { label: 'Agency requirements',                  icon: I.folder },
  { label: 'Release notes',                        icon: I.bookmark },
];

const STATS: StatDef[] = [
  { label: 'Tax details missing',    value: DASHBOARD_TAX_CODES.filter(r => !r.detailsOk).length, sub: 'Setup information is missing', icon: I.doc,  iconBg: 'bg-rose-50',  iconColor: 'text-rose-500',  accent: 'border-rose-400', filter: 'Details missing' },
  { label: 'Inactive tax codes',      value: DASHBOARD_TAX_CODES.filter(r => ENTITIES.find(e => e.id === r.entityId)?.status !== 'Active').length, sub: 'Inactive with pending liabilities', icon: I.checkCircle, iconBg: 'bg-slate-50', iconColor: 'text-slate-400', accent: 'border-slate-300', filter: 'Inactive' },
  { label: 'Authorizations required', value: DASHBOARD_TAX_CODES.filter(r => r.authRequired).length, sub: 'For Dayforce to act on your behalf', icon: I.folder, iconBg: 'bg-rose-50', iconColor: 'text-rose-500', accent: 'border-rose-400', filter: 'Authorization required' },
];

// ── Tax status badge ───────────────────────────────────────────
function TaxBadge({ status }: { status: 'Active' | 'Incomplete' }) {
  if (status === 'Active') {
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100">Active</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100">
      <Ic d={I.warn} size={11} className="shrink-0" />Incomplete
    </span>
  );
}

// ── Authorization status ────────────────────────────────────────
const AUTH_STATUSES = ['Needs action', 'In progress', 'Authorized'] as const;
type AuthStatus = typeof AUTH_STATUSES[number];
const AUTH_STYLES: Record<AuthStatus, string> = {
  'Needs action': 'bg-rose-50 text-rose-700 border-rose-200',
  'In progress':  'bg-amber-50 text-amber-700 border-amber-200',
  'Authorized':   'bg-teal-50 text-teal-700 border-teal-200',
};

// ── Stat card ──────────────────────────────────────────────────
function StatCard({ s, active, onClick }: Readonly<{ s: StatDef; active: boolean; onClick?: () => void }>) {
  const interactive = Boolean(onClick);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={interactive ? active : undefined}
      disabled={!interactive}
      className={`bg-white rounded-xl border border-slate-200 border-l-4 ${s.accent} p-4 flex items-start gap-3.5 shadow-sm text-left ${interactive ? 'cursor-pointer hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2' : 'cursor-default'} ${active ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
    >
      <div className={`${s.iconBg} ${s.iconColor} rounded-lg p-2.5 shrink-0`}>
        <Ic d={s.icon} size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-medium leading-tight">{s.label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1 leading-none">{s.value}</p>
        <p className="text-xs text-slate-400 mt-1.5">{s.sub}</p>
      </div>
    </button>
  );
}

// ── Sort icon ──────────────────────────────────────────────────
function SortIc({ col, active, dir }: { col: string; active: boolean; dir: 'asc' | 'desc' }) {
  return (
    <Ic
      d={active ? (dir === 'asc' ? "M12 4.5v15m0-15l-4.5 4.5M12 4.5l4.5 4.5" : "M12 19.5v-15m0 15l-4.5-4.5M12 19.5l4.5-4.5") : I.updown}
      size={12}
      className={`ml-1 shrink-0 ${active ? 'text-blue-600' : 'text-slate-300'}`}
    />
  );
}

// ── Multi-select autocomplete filter ────────────────────────────
function MultiSelectFilter({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const filteredOptions = options.filter(o => o.toLowerCase().includes(query.toLowerCase()));
  const toggleOption = (opt: string) => onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${selected.length ? 'border-blue-300 text-blue-700 bg-blue-50' : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50'}`}>
        {label}{selected.length > 0 && ` (${selected.length})`}
        <Ic d={I.chevDown} size={11} />
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg p-2">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder={`Search ${label.toLowerCase()}…`}
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded mb-2 focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-slate-400" />
          <div className="max-h-48 overflow-y-auto flex flex-col gap-0.5">
            {filteredOptions.length === 0 && <p className="text-xs text-slate-400 px-2 py-1">No matches</p>}
            {filteredOptions.map(opt => (
              <label key={opt} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-50 cursor-pointer text-xs text-slate-700">
                <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggleOption(opt)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 cursor-pointer shrink-0" />
                <span className="truncate">{opt}</span>
              </label>
            ))}
          </div>
          {selected.length > 0 && (
            <button type="button" onClick={() => onChange([])}
              className="w-full text-left text-xs font-medium text-blue-600 hover:text-blue-700 mt-1 px-2 py-1">
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Mark as dropdown (bulk authorization update) ────────────────
function MarkAsDropdown({ disabled, onSelect }: { disabled: boolean; onSelect: (status: AuthStatus) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button type="button" disabled={disabled} onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${disabled ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed' : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer'}`}>
        Mark as
        <Ic d={I.chevDown} size={11} />
      </button>
      {open && !disabled && (
        <div className="absolute right-0 z-10 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
          {AUTH_STATUSES.map(status => (
            <button key={status} type="button" onClick={() => { onSelect(status); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── HOME PAGE (Tax & Payments Dashboard) ────────────────────────
function HomePage({ onSelect, onManageAuthorizations }: { onSelect: (e: LegalEntity) => void; onManageAuthorizations: () => void }) {
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [customerFilter, setCustomerFilter] = useState<string[]>([]);
  const [namespaceFilter, setNamespaceFilter] = useState<string[]>([]);
  const [entityNameFilter, setEntityNameFilter] = useState<string[]>([]);
  const [entityNumberFilter, setEntityNumberFilter] = useState<string[]>([]);
  const [issuesFilter, setIssuesFilter] = useState<string[]>([]);
  const [sortCol, setSortCol] = useState<'taxCode' | 'entity' | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const entityById = useMemo(() => new Map(ENTITIES.map(e => [e.id, e])), []);
  const customerOptions = useMemo(() => [...new Set(ENTITIES.map(e => e.customerName))].sort((a, b) => a.localeCompare(b)), []);
  const namespaceOptions = useMemo(() => [...new Set(ENTITIES.map(e => e.namespace))].sort((a, b) => a.localeCompare(b)), []);
  const entityNameOptions = useMemo(() => [...new Set(ENTITIES.map(e => e.name))].sort((a, b) => a.localeCompare(b)), []);
  const entityNumberOptions = useMemo(() => [...new Set(ENTITIES.map(e => e.federalId))].sort((a, b) => a.localeCompare(b)), []);
  const issuesOptions = ['Details missing', 'Inactive', 'Authorization required'];

  const handleSort = (col: 'taxCode' | 'entity') => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const displayed = useMemo(() => {
    let rows = [...DASHBOARD_TAX_CODES];
    if (customerFilter.length) rows = rows.filter(r => customerFilter.includes(entityById.get(r.entityId)?.customerName ?? ''));
    if (namespaceFilter.length) rows = rows.filter(r => namespaceFilter.includes(entityById.get(r.entityId)?.namespace ?? ''));
    if (entityNameFilter.length) rows = rows.filter(r => entityNameFilter.includes(entityById.get(r.entityId)?.name ?? ''));
    if (entityNumberFilter.length) rows = rows.filter(r => entityNumberFilter.includes(entityById.get(r.entityId)?.federalId ?? ''));
    if (issuesFilter.length) rows = rows.filter(r =>
      (issuesFilter.includes('Details missing') && !r.detailsOk) ||
      (issuesFilter.includes('Inactive') && entityById.get(r.entityId)?.status !== 'Active') ||
      (issuesFilter.includes('Authorization required') && r.authRequired)
    );
    if (search) rows = rows.filter(r => {
      const entity = entityById.get(r.entityId);
      return r.taxCode.toLowerCase().includes(search.toLowerCase()) ||
        entity?.name.toLowerCase().includes(search.toLowerCase()) ||
        entity?.customerName.toLowerCase().includes(search.toLowerCase()) ||
        entity?.namespace.toLowerCase().includes(search.toLowerCase());
    });
    if (sortCol) {
      rows.sort((a, b) => {
        const av = sortCol === 'taxCode' ? a.taxCode : (entityById.get(a.entityId)?.name ?? '');
        const bv = sortCol === 'taxCode' ? b.taxCode : (entityById.get(b.entityId)?.name ?? '');
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return rows;
  }, [search, customerFilter, namespaceFilter, entityNameFilter, entityNumberFilter, issuesFilter, sortCol, sortDir, entityById]);

  const hasActiveFilters = Boolean(search || customerFilter.length || namespaceFilter.length || entityNameFilter.length || entityNumberFilter.length || issuesFilter.length);
  const clearAllFilters = () => {
    setSearch(''); setCustomerFilter([]); setNamespaceFilter([]);
    setEntityNameFilter([]); setEntityNumberFilter([]); setIssuesFilter([]);
    setPage(1);
  };
  const toggleStatFilter = (filter: string) => {
    setIssuesFilter(current => current.includes(filter) ? [] : [filter]);
    setPage(1);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 font-sans overflow-hidden">

      {/* ── Top nav bar ── */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
          <Ic d={I.doc} size={16} className="text-white" />
        </div>
        <h1 className="text-base font-semibold text-slate-900">Tax &amp; Payments Dashboard</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {STATS.map(s => <StatCard key={s.label} s={s} active={issuesFilter.includes(s.filter)} onClick={() => toggleStatFilter(s.filter)} />)}
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 mb-5 flex items-center gap-4 overflow-x-auto">
          <p className="text-sm font-semibold text-slate-900 shrink-0">Quick links</p>
          <div className="flex items-center gap-2 flex-wrap">
            {QUICK_LINKS.map(link => (
              <button key={link.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors shrink-0">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Ic d={link.icon} size={11} />
                </span>
                <span className="text-xs font-medium text-slate-700 whitespace-nowrap">{link.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Heading + search + create case */}
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">{TOTAL_DASHBOARD_TAX_CODES.toLocaleString()} tax codes need attention</h2>
            <div className="flex items-center gap-2">
              {showSearch && (
                <div className="relative">
                  <Ic d={I.search} size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search tax codes…"
                    className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 placeholder-slate-400"
                  />
                </div>
              )}
              <button onClick={() => { setShowSearch(v => !v); setSearch(''); }}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                <Ic d={I.search} size={16} />
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                Create case
                <Ic d={I.externalLink} size={13} />
              </button>
              <button onClick={onManageAuthorizations}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-300 bg-orange-50 text-sm font-medium text-orange-700 hover:bg-orange-100 transition-colors">
                <Ic d={I.shield} size={14} />
                Manage Authorizations
              </button>
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex items-center justify-between px-5 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <MultiSelectFilter label="Legal entity name" options={entityNameOptions} selected={entityNameFilter} onChange={v => { setEntityNameFilter(v); setPage(1); }} />
              <MultiSelectFilter label="Legal entity number" options={entityNumberOptions} selected={entityNumberFilter} onChange={v => { setEntityNumberFilter(v); setPage(1); }} />
              <MultiSelectFilter label="Issues" options={issuesOptions} selected={issuesFilter} onChange={v => { setIssuesFilter(v); setPage(1); }} />
              <MultiSelectFilter label="Customer name" options={customerOptions} selected={customerFilter} onChange={v => { setCustomerFilter(v); setPage(1); }} />
              <MultiSelectFilter label="Namespace" options={namespaceOptions} selected={namespaceFilter} onChange={v => { setNamespaceFilter(v); setPage(1); }} />
            </div>
            {hasActiveFilters && (
              <button onClick={clearAllFilters}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap">
                Clear all filters
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto border-t border-slate-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60">
                  <th onClick={() => handleSort('taxCode')}
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900 whitespace-nowrap select-none">
                    <span className="inline-flex items-center">Tax code<SortIc col="taxCode" active={sortCol === 'taxCode'} dir={sortDir} /></span>
                  </th>
                  <th onClick={() => handleSort('entity')}
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900 whitespace-nowrap select-none">
                    <span className="inline-flex items-center">Legal entity<SortIc col="entity" active={sortCol === 'entity'} dir={sortDir} /></span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">Customer name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">Namespace</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">Added date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">Issues</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map(row => {
                  const entity = entityById.get(row.entityId);
                  if (!entity) return null;
                  return (
                    <tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-3">
                        <button onClick={() => onSelect(entity)} className="text-blue-600 hover:underline text-left font-medium text-[13px]">
                          {row.taxCode}
                        </button>
                        <p className="text-xs text-slate-400 mt-0.5">{row.taxCodeNumber}</p>
                      </td>
                      <td className="px-6 py-3">
                        <button onClick={() => onSelect(entity)} className="text-blue-600 hover:underline text-left font-medium text-[13px]">
                          {entity.name}
                        </button>
                        <p className="text-xs text-slate-400 mt-0.5">{entity.federalId}</p>
                      </td>
                      <td className="px-6 py-3 text-[13px] text-slate-600">{entity.customerName}</td>
                      <td className="px-6 py-3 text-[13px] text-slate-500">{entity.namespace}</td>
                      <td className="px-6 py-3 text-[13px] text-slate-600 whitespace-nowrap">{row.addedDate}</td>
                      <td className="px-6 py-3">
                        <div className="flex flex-col gap-1 items-start">
                          {row.detailsOk && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                              <Ic d={I.check} size={11} className="shrink-0" />Details
                            </span>
                          )}
                          {row.authRequired && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-600">
                              <Ic d={I.warn} size={11} className="shrink-0" />Authorization
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-500">
              Showing {(page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, displayed.length)} of {displayed.length.toLocaleString()}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Rows per page</span>
                <select className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400">
                  <option>10</option><option>25</option><option>50</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <Ic d={I.chevRight} size={12} className="rotate-180" />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500">Page</span>
                  <select value={page} onChange={e => setPage(Number(e.target.value))}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400">
                    {Array.from({ length: Math.max(1, Math.ceil(displayed.length / rowsPerPage)) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
                <button onClick={() => setPage(p => p + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors">
                  <Ic d={I.chevRight} size={12} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── DETAIL PAGE main content ───────────────────────────────────
function DetailContent({ entity, onBack, preselectEntityFilter = true }: { entity: LegalEntity; onBack: () => void; preselectEntityFilter?: boolean }) {
  const [stateFilter, setStateFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [authFilter, setAuthFilter] = useState<string[]>([]);
  const [entityNameFilter, setEntityNameFilter] = useState<string[]>([]);
  const [entityNumberFilter, setEntityNumberFilter] = useState<string[]>(
    preselectEntityFilter ? [entity.federalId] : []
  );
  const [namespaceFilter, setNamespaceFilter] = useState<string[]>([]);
  const [customerFilter, setCustomerFilter] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [authStatus, setAuthStatus] = useState<Record<number, AuthStatus>>(
    () => Object.fromEntries(TAX_ROWS.map(r => [r.id, r.isAuthorized ? 'Authorized' : 'Needs action']))
  );
  const setRowAuthStatus = (id: number, status: AuthStatus) => {
    setAuthStatus(p => ({ ...p, [id]: status }));
  };
  const [notification, setNotification] = useState<{ count: number; status: AuthStatus } | null>(null);
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(t);
  }, [notification]);
  const markSelectedAs = (status: AuthStatus) => {
    if (selected.length === 0) return;
    const count = selected.length;
    setAuthStatus(p => {
      const next = { ...p };
      selected.forEach(id => { next[id] = status; });
      return next;
    });
    setNotification({ count, status });
    setSelected([]);
  };

  const TOTAL = 10625;

  const toggleRow = (id: number) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const allChecked = selected.length === TAX_ROWS.length;
  const toggleAll = () => setSelected(allChecked ? [] : TAX_ROWS.map(r => r.id));
  const entityById = useMemo(() => new Map(ENTITIES.map(e => [e.id, e])), []);
  const stateOptions = useMemo(() => [...new Set(TAX_ROWS.map(r => r.state))].sort((a, b) => a.localeCompare(b)), []);
  const statusOptions = useMemo(() => [...new Set(TAX_ROWS.map(r => r.status))].sort((a, b) => a.localeCompare(b)), []);
  const authOptions: string[] = [...AUTH_STATUSES];
  const entityNameOptions = useMemo(() => [...new Set(TAX_ROWS.map(r => entityById.get(r.entityId)?.name ?? ''))].sort((a, b) => a.localeCompare(b)), [entityById]);
  const entityNumberOptions = useMemo(() => [...new Set(TAX_ROWS.map(r => entityById.get(r.entityId)?.federalId ?? ''))].sort((a, b) => a.localeCompare(b)), [entityById]);
  const namespaceOptions = useMemo(() => [...new Set(TAX_ROWS.map(r => entityById.get(r.entityId)?.namespace ?? ''))].sort((a, b) => a.localeCompare(b)), [entityById]);
  const customerOptions = useMemo(() => [...new Set(TAX_ROWS.map(r => entityById.get(r.entityId)?.customerName ?? ''))].sort((a, b) => a.localeCompare(b)), [entityById]);
  const filtered = TAX_ROWS.filter(r => {
    const rowEntity = entityById.get(r.entityId);
    return (stateFilter.length === 0 || stateFilter.includes(r.state)) &&
      (statusFilter.length === 0 || statusFilter.includes(r.status)) &&
      (authFilter.length === 0 || authFilter.includes(authStatus[r.id])) &&
      (entityNameFilter.length === 0 || entityNameFilter.includes(rowEntity?.name ?? '')) &&
      (entityNumberFilter.length === 0 || entityNumberFilter.includes(rowEntity?.federalId ?? '')) &&
      (namespaceFilter.length === 0 || namespaceFilter.includes(rowEntity?.namespace ?? '')) &&
      (customerFilter.length === 0 || customerFilter.includes(rowEntity?.customerName ?? ''));
  });
  const hasActiveFilters = Boolean(stateFilter.length || statusFilter.length || authFilter.length || entityNameFilter.length || entityNumberFilter.length || namespaceFilter.length || customerFilter.length);
  const clearAllFilters = () => {
    setStateFilter([]); setStatusFilter([]); setAuthFilter([]);
    setEntityNameFilter([]); setEntityNumberFilter([]); setNamespaceFilter([]); setCustomerFilter([]);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="p-6 w-full max-w-screen-2xl mx-auto">

        {/* Company header card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-4 mb-5">
          <button onClick={onBack}
            className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 shrink-0 transition-colors">
            <Ic d={I.arrowLeft} size={16} />
          </button>
          <div>
            <h2 className="text-base font-semibold text-slate-900">State &amp; local</h2>
            <p className="text-xs text-slate-500 mt-0.5">{entity.name} ({entity.federalId})</p>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">State &amp; Local tax codes added</h3>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"><Ic d={I.funnel} size={14} /></button>
            </div>
          </div>

          {/* Contextual bulk-action bar — appears next to the checkboxes it acts on */}
          {selected.length > 0 ? (
            <div className="flex items-center justify-between px-5 py-2.5 border-b border-blue-100 bg-blue-50">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-blue-800">{selected.length} selected</span>
                <span className="text-xs text-blue-700">Mark as</span>
                <MarkAsDropdown disabled={false} onSelect={markSelectedAs} />
              </div>
              <button onClick={() => setSelected([])} className="text-xs font-medium text-blue-700 hover:text-blue-900 transition-colors">
                Clear selection
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-5 py-2 border-b border-slate-100 bg-slate-50/80">
              <Ic d={I.info} size={14} className="text-slate-400 shrink-0" />
              <span className="text-xs text-slate-500">Select tax codes using the checkboxes to update their authorization status in bulk</span>
            </div>
          )}

          {/* Filter row */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-2 flex-wrap">
              <MultiSelectFilter label="Customer name" options={customerOptions} selected={customerFilter} onChange={setCustomerFilter} />
              <MultiSelectFilter label="Namespace" options={namespaceOptions} selected={namespaceFilter} onChange={setNamespaceFilter} />
              <MultiSelectFilter label="Legal entity name" options={entityNameOptions} selected={entityNameFilter} onChange={setEntityNameFilter} />
              <MultiSelectFilter label="Legal entity number" options={entityNumberOptions} selected={entityNumberFilter} onChange={setEntityNumberFilter} />
              <MultiSelectFilter label="State" options={stateOptions} selected={stateFilter} onChange={setStateFilter} />
              <MultiSelectFilter label="Status" options={statusOptions} selected={statusFilter} onChange={setStatusFilter} />
              <MultiSelectFilter label="Authorization status" options={authOptions} selected={authFilter} onChange={setAuthFilter} />
            </div>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap">Clear all filters</button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="w-10 px-4 py-3 text-left">
                    <input type="checkbox" checked={allChecked} onChange={toggleAll} className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer" />
                  </th>
                  {['Tax name', 'Legal entity name', 'Status', 'Short name', 'State', 'Authorization status'].map(col => (
                    <th key={col} className="px-3 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => (
                  <tr key={row.id} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors ${selected.includes(row.id) ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.includes(row.id)} onChange={() => toggleRow(row.id)} className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer" />
                    </td>
                    <td className="px-3 py-3 max-w-xs">
                      <div className="flex items-start gap-1.5">
                        {row.status === 'Incomplete' && <Ic d={I.warn} size={14} className="text-orange-500 shrink-0 mt-0.5" />}
                        <div>
                          <p className="text-slate-900 font-medium leading-snug text-[13px]">{row.name}</p>
                          <p className="mt-0.5 text-xs font-mono text-slate-500">
                            {row.taxCode}
                            <span className="mx-1.5 text-slate-300">|</span>
                            <span className="italic text-slate-400">{row.ctsCode}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <p className="text-[13px] text-slate-700">{entityById.get(row.entityId)?.name}</p>
                      <p className="mt-0.5 text-xs font-mono text-slate-500">
                        {entityById.get(row.entityId)?.federalId}
                        <span className="mx-1.5 text-slate-300">|</span>
                        <span className="italic text-slate-400">{entityById.get(row.entityId)?.namespace}</span>
                      </p>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap"><TaxBadge status={row.status} /></td>
                    <td className="px-3 py-3 text-xs text-slate-600 font-mono whitespace-nowrap">{row.shortName}</td>
                    <td className="px-3 py-3 text-[13px] text-slate-600 whitespace-nowrap">{row.state}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <select
                        value={authStatus[row.id]}
                        onChange={e => setRowAuthStatus(row.id, e.target.value as AuthStatus)}
                        className={`text-xs font-medium rounded-md border px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer ${AUTH_STYLES[authStatus[row.id]]}`}>
                        {AUTH_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-500">Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, TOTAL)} of {TOTAL.toLocaleString()}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Rows per page</span>
                <select className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400">
                  <option>10</option><option>25</option><option>50</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <Ic d={I.chevRight} size={12} className="rotate-180" />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500">Page</span>
                  <select value={page} onChange={e => setPage(Number(e.target.value))}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400">
                    {Array.from({ length: Math.min(Math.ceil(TOTAL / 10), 100) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
                <button onClick={() => setPage(p => p + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors">
                  <Ic d={I.chevRight} size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-slate-200 rounded-lg shadow-lg px-4 py-3">
          <Ic d={I.checkCircle} size={16} className="text-emerald-500 shrink-0" />
          <span className="text-sm text-slate-700">{notification.count} tax code{notification.count === 1 ? '' : 's'} marked as {notification.status.toLowerCase()}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
            <Ic d={I.plus} size={14} className="rotate-45" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── DETAIL PAGE wrapper ────────────────────────────────────────
function DetailPage({ entity, onBack, preselectEntityFilter = true }: { entity: LegalEntity; onBack: () => void; preselectEntityFilter?: boolean }) {
  return (
    <div className="h-full flex flex-col bg-slate-50 font-sans overflow-hidden">
      <DetailContent entity={entity} onBack={onBack} preselectEntityFilter={preselectEntityFilter} />
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<View>('home');
  const [entity, setEntity] = useState<LegalEntity | null>(null);
  const [preselectEntityFilter, setPreselectEntityFilter] = useState(true);

  if (view === 'detail' && entity) {
    return <DetailPage entity={entity} onBack={() => setView('home')} preselectEntityFilter={preselectEntityFilter} />;
  }
  return (
    <HomePage
      onSelect={e => { setEntity(e); setPreselectEntityFilter(true); setView('detail'); }}
      onManageAuthorizations={() => { setEntity(ENTITIES[0]); setPreselectEntityFilter(false); setView('detail'); }}
    />
  );
}
