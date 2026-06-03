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
  ["AppelBaas", "FC Slapple"],
  ["PannaPiet", "De Laatste Man"],
  ["VARnaald", "Buitenspel Bende"],
  ["OranjeOpa", "Totaalvoetbal 2.0"],
  ["TikkieTerug", "Balbezit Boys"],
  ["SlimeSpits", "Doelpunt Dweilers"],
  ["KruisingKoning", "Latje Trap"],
  ["TurboTante", "Familie 4-3-3"],
  ["NatteKrant", "Kansloos United"],
  ["Mister90", "Blessuretijd BV"],
  ["BanaanBal", "Gele Kaartjes"],
  ["KeeperKees", "Handsvol"],
  ["TikTokTactiek", "Swipe FC"],
  ["PolderPirlo", "Amersfoort Athletic"],
  ["SnackVAR", "Kroketten Crew"],
  ["SambaSandra", "Dansende Defensie"],
  ["FeddeFinta", "Schijnbeweging"],
  ["LindeLinks", "Linkspoot Legends"],
  ["RosieRabona", "Roze Raket"],
  ["OmeOffside", "Net Niet FC"],
  ["DoelpuntDaan", "De Twaalfde Man"],
  ["NoLookNora", "Blind Passes"],
  ["CornerCas", "Vlaggenstok FC"],
  ["PenaltyPam", "Elf Meter"],
  ["WisselWout", "Bankwarmers"],
  ["NachoNiels", "Stadion Snacks"],
  ["RodeDuivel", "Kaartclub"],
  ["BuitenkantBo", "Trivela Town"],
  ["KnalKees", "Afstandsschot"],
  ["PoulePuck", "Puntenpakkers"],
  ["BierbuikBeckenbauer", "Derde Helft"],
  ["SprintSaar", "Turbo Teens"],
  ["KopbalKoen", "Luchtmacht"],
  ["HakjeHugo", "Sierlijke Slopers"],
  ["LaptopLouis", "Data Dugout"],
  ["FluitFenna", "Scheidslijn"],
  ["TotoTess", "Gokje Goed"],
  ["BalOpDak", "Dakduiven FC"],
  ["GrasGijs", "Modderpoten"],
  ["MuurMila", "Verdedigingsmuur"],
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
