export type DemoPlayer = {
  userId: string;
  nickname: string;
  teamName: string;
  poolId: string;
};

export type DemoPool = {
  id: string;
  name: string;
  code: string;
};

export const DEMO_POOLS: DemoPool[] = [
  { id: "demo-pool-1", name: "Vathorst VAR", code: "VATHORST" },
  { id: "demo-pool-2", name: "Familie Fanatics", code: "FAMILIE" },
  { id: "demo-pool-3", name: "Kantine Coaches", code: "KANTINE" },
  { id: "demo-pool-4", name: "Oranje Appgroep", code: "ORANJE" },
  { id: "demo-pool-5", name: "Straatpoule United", code: "STRAAT" },
  { id: "demo-pool-6", name: "WK Werkvloer", code: "WERK" },
  { id: "demo-pool-7", name: "Bankzitters FC", code: "BANK" },
  { id: "demo-pool-8", name: "Slime Scouts", code: "SLIME" },
];

const nicknames = [
  ["Joostinho_88", "FC LastMinute"],
  ["milanVAR", "De Laatste Man"],
  ["Nora_NoLook", "Buitenspel Bende"],
  ["KeesKeeper", "Clean Sheet Crew"],
  ["xPannaPietx", "Balbezit Boys"],
  ["TikkieTerug", "Doelpunt Dweilers"],
  ["Mila92", "Latje Trap"],
  ["OranjeOpa", "Familie 4-3-3"],
  ["Cas_Corner", "Kansloos United"],
  ["Mister90plus", "Blessuretijd BV"],
  ["BanaanBal", "Gele Kaartjes"],
  ["Noah_Nacounter", "Handsvol"],
  ["Tactical_Tess", "Swipe FC"],
  ["PolderPirlo", "Amersfoort Athletic"],
  ["SnackVAR", "Kroketten Crew"],
  ["SaarSprint", "Dansende Defensie"],
  ["FennaFluit", "Schijnbeweging"],
  ["KoenKopbal", "Linkspoot Legends"],
  ["BoBuitenkant", "Roze Raket"],
  ["OmeOffside", "Net Niet FC"],
  ["DaanDoelpunt", "De Twaalfde Man"],
  ["NoLookNora", "Blind Passes"],
  ["CornerCas", "Vlaggenstok FC"],
  ["PamPenalty", "Elf Meter"],
  ["WoutWissel", "Bankwarmers"],
  ["NachoNiels", "Stadion Snacks"],
  ["RodeDuivel_10", "Kaartclub"],
  ["TrivelaBo", "Trivela Town"],
  ["KnalKees", "Afstandsschot"],
  ["PuckPoule", "Puntenpakkers"],
  ["BeckenBram", "Derde Helft"],
  ["TurboSaar", "Turbo Teens"],
  ["HakjeHugo", "Sierlijke Slopers"],
  ["DataLouis", "Data Dugout"],
  ["GokjeGoed", "Toto Tactiek"],
  ["BalOpDak", "Dakduiven FC"],
  ["GrasGijs", "Modderpoten"],
  ["MuurMila", "Verdedigingsmuur"],
  ["JesseJoga", "Samba Selectie"],
  ["Ravi_Raket", "Counter Kings"],
] as const;

export const DEMO_PLAYERS: DemoPlayer[] = nicknames.map(([nickname, teamName], index) => ({
  userId: `demo-player-${index + 1}`,
  nickname,
  teamName,
  poolId: DEMO_POOLS[index % DEMO_POOLS.length].id,
}));

export function hasPublicProfile(profile?: { nickname: string | null; team_name: string | null } | null) {
  return Boolean(profile?.nickname?.trim() || profile?.team_name?.trim());
}

const privateNameFragments = ["stefan", "fedde", "linde", "sandra", "appel"];

export function hasSafePublicProfile(profile?: { nickname: string | null; team_name: string | null } | null) {
  if (!hasPublicProfile(profile)) return false;
  const text = `${profile?.nickname ?? ""} ${profile?.team_name ?? ""}`.toLowerCase();
  return !privateNameFragments.some((fragment) => text.includes(fragment));
}
