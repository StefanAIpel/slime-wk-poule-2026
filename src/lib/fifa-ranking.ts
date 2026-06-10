export type FifaRankingRow = {
  rank: number;
  code: string;
  name: string;
  nameNl: string;
  points: number;
  previousRank: number;
  marketValue: string | null;
  marketValueMillions: number | null;
  transfermarktRank: number | null;
};

export const fifaRankingPublishedAt = "2026-04-01";
export const fifaRankingSource = "FIFA men's world ranking, fetched 2026-06-10";
export const squadValueSource = "Transfermarkt most valuable national teams and team profiles, fetched 2026-06-10";

export const fifaRanking: FifaRankingRow[] = [
  { rank: 1, code: "FRA", name: "France", nameNl: "Frankrijk", points: 1877.32, previousRank: 3, marketValue: "€1.52bn", marketValueMillions: 1520, transfermarktRank: 1 },
  { rank: 2, code: "ESP", name: "Spain", nameNl: "Spanje", points: 1876.4, previousRank: 1, marketValue: "€1.22bn", marketValueMillions: 1220, transfermarktRank: 3 },
  { rank: 3, code: "ARG", name: "Argentina", nameNl: "Argentinië", points: 1874.81, previousRank: 2, marketValue: "€782.50m", marketValueMillions: 782.5, transfermarktRank: 7 },
  { rank: 4, code: "ENG", name: "England", nameNl: "Engeland", points: 1825.97, previousRank: 4, marketValue: "€1.36bn", marketValueMillions: 1360, transfermarktRank: 2 },
  { rank: 5, code: "POR", name: "Portugal", nameNl: "Portugal", points: 1763.83, previousRank: 6, marketValue: "€1.01bn", marketValueMillions: 1010, transfermarktRank: 4 },
  { rank: 6, code: "BRA", name: "Brazil", nameNl: "Brazilië", points: 1761.16, previousRank: 5, marketValue: "€928.20m", marketValueMillions: 928.2, transfermarktRank: 6 },
  { rank: 7, code: "NED", name: "Netherlands", nameNl: "Nederland", points: 1757.87, previousRank: 7, marketValue: "€754.20m", marketValueMillions: 754.2, transfermarktRank: 8 },
  { rank: 8, code: "MAR", name: "Morocco", nameNl: "Marokko", points: 1755.87, previousRank: 8, marketValue: "€498.30m", marketValueMillions: 498.3, transfermarktRank: 12 },
  { rank: 9, code: "BEL", name: "Belgium", nameNl: "België", points: 1734.71, previousRank: 9, marketValue: "€547.50m", marketValueMillions: 547.5, transfermarktRank: 10 },
  { rank: 10, code: "GER", name: "Germany", nameNl: "Duitsland", points: 1730.37, previousRank: 10, marketValue: "€947.00m", marketValueMillions: 947, transfermarktRank: 5 },
  { rank: 11, code: "CRO", name: "Croatia", nameNl: "Kroatië", points: 1717.07, previousRank: 11, marketValue: "€387.30m", marketValueMillions: 387.3, transfermarktRank: 16 },
  { rank: 12, code: "ITA", name: "Italy", nameNl: "Italië", points: 1700.37, previousRank: 13, marketValue: "€315.70m", marketValueMillions: 315.7, transfermarktRank: 22 },
  { rank: 13, code: "COL", name: "Colombia", nameNl: "Colombia", points: 1693.09, previousRank: 14, marketValue: "€302.35m", marketValueMillions: 302.35, transfermarktRank: 23 },
  { rank: 14, code: "SEN", name: "Senegal", nameNl: "Senegal", points: 1688.99, previousRank: 12, marketValue: "€478.10m", marketValueMillions: 478.1, transfermarktRank: 13 },
  { rank: 15, code: "MEX", name: "Mexico", nameNl: "Mexico", points: 1681.03, previousRank: 16, marketValue: "€191.85m", marketValueMillions: 191.85, transfermarktRank: 37 },
  { rank: 16, code: "USA", name: "USA", nameNl: "Verenigde Staten", points: 1673.13, previousRank: 15, marketValue: "€385.65m", marketValueMillions: 385.65, transfermarktRank: 17 },
  { rank: 17, code: "URU", name: "Uruguay", nameNl: "Uruguay", points: 1673.07, previousRank: 17, marketValue: "€359.30m", marketValueMillions: 359.3, transfermarktRank: 20 },
  { rank: 18, code: "JPN", name: "Japan", nameNl: "Japan", points: 1660.43, previousRank: 19, marketValue: "€270.85m", marketValueMillions: 270.85, transfermarktRank: 25 },
  { rank: 19, code: "SUI", name: "Switzerland", nameNl: "Zwitserland", points: 1649.4, previousRank: 18, marketValue: "€332.50m", marketValueMillions: 332.5, transfermarktRank: 21 },
  { rank: 20, code: "DEN", name: "Denmark", nameNl: "Denemarken", points: 1620.81, previousRank: 21, marketValue: "€365.00m", marketValueMillions: 365, transfermarktRank: 19 },
  { rank: 21, code: "IRN", name: "IR Iran", nameNl: "Iran", points: 1615.3, previousRank: 20, marketValue: "€32.05m", marketValueMillions: 32.05, transfermarktRank: null },
  { rank: 22, code: "TUR", name: "Türkiye", nameNl: "Turkije", points: 1599.04, previousRank: 25, marketValue: "€473.70m", marketValueMillions: 473.7, transfermarktRank: 14 },
  { rank: 23, code: "ECU", name: "Ecuador", nameNl: "Ecuador", points: 1594.78, previousRank: 23, marketValue: "€368.70m", marketValueMillions: 368.7, transfermarktRank: 18 },
  { rank: 24, code: "AUT", name: "Austria", nameNl: "Oostenrijk", points: 1593.45, previousRank: 24, marketValue: "€242.20m", marketValueMillions: 242.2, transfermarktRank: 30 },
  { rank: 25, code: "KOR", name: "Korea Republic", nameNl: "Zuid-Korea", points: 1588.66, previousRank: 22, marketValue: "€139.05m", marketValueMillions: 139.05, transfermarktRank: 47 },
  { rank: 26, code: "NGA", name: "Nigeria", nameNl: "Nigeria", points: 1585.09, previousRank: 26, marketValue: "€171.85m", marketValueMillions: 171.85, transfermarktRank: 40 },
  { rank: 27, code: "AUS", name: "Australia", nameNl: "Australië", points: 1580.67, previousRank: 27, marketValue: "€77.45m", marketValueMillions: 77.45, transfermarktRank: 58 },
  { rank: 28, code: "ALG", name: "Algeria", nameNl: "Algerije", points: 1564.26, previousRank: 28, marketValue: "€256.90m", marketValueMillions: 256.9, transfermarktRank: 27 },
  { rank: 29, code: "EGY", name: "Egypt", nameNl: "Egypte", points: 1563.24, previousRank: 31, marketValue: "€116.48m", marketValueMillions: 116.48, transfermarktRank: 49 },
  { rank: 30, code: "CAN", name: "Canada", nameNl: "Canada", points: 1556.48, previousRank: 29, marketValue: "€198.65m", marketValueMillions: 198.65, transfermarktRank: 36 },
  { rank: 31, code: "NOR", name: "Norway", nameNl: "Noorwegen", points: 1550.94, previousRank: 32, marketValue: "€589.90m", marketValueMillions: 589.9, transfermarktRank: 9 },
  { rank: 32, code: "UKR", name: "Ukraine", nameNl: "Oekraïne", points: 1546.88, previousRank: 30, marketValue: "€247.00m", marketValueMillions: 247, transfermarktRank: 28 },
  { rank: 33, code: "PAN", name: "Panama", nameNl: "Panama", points: 1540.64, previousRank: 33, marketValue: "€34.53m", marketValueMillions: 34.53, transfermarktRank: null },
  { rank: 34, code: "CIV", name: "Côte d'Ivoire", nameNl: "Ivoorkust", points: 1532.98, previousRank: 37, marketValue: "€522.10m", marketValueMillions: 522.1, transfermarktRank: 11 },
  { rank: 35, code: "POL", name: "Poland", nameNl: "Polen", points: 1528, previousRank: 34, marketValue: "€231.60m", marketValueMillions: 231.6, transfermarktRank: 32 },
  { rank: 36, code: "RUS", name: "Russia", nameNl: "Rusland", points: 1525.6, previousRank: 36, marketValue: "€242.70m", marketValueMillions: 242.7, transfermarktRank: 29 },
  { rank: 37, code: "WAL", name: "Wales", nameNl: "Wales", points: 1524.29, previousRank: 35, marketValue: "€180.65m", marketValueMillions: 180.65, transfermarktRank: 39 },
  { rank: 38, code: "SWE", name: "Sweden", nameNl: "Zweden", points: 1514.77, previousRank: 42, marketValue: "€406.08m", marketValueMillions: 406.08, transfermarktRank: 15 },
  { rank: 39, code: "SRB", name: "Serbia", nameNl: "Servië", points: 1508.65, previousRank: 39, marketValue: "€206.00m", marketValueMillions: 206, transfermarktRank: 34 },
  { rank: 40, code: "PAR", name: "Paraguay", nameNl: "Paraguay", points: 1503.5, previousRank: 40, marketValue: "€153.65m", marketValueMillions: 153.65, transfermarktRank: 42 },
  { rank: 41, code: "CZE", name: "Czechia", nameNl: "Tsjechië", points: 1501.38, previousRank: 43, marketValue: "€188.18m", marketValueMillions: 188.18, transfermarktRank: 38 },
  { rank: 42, code: "HUN", name: "Hungary", nameNl: "Hongarije", points: 1500.58, previousRank: 41, marketValue: "€209.20m", marketValueMillions: 209.2, transfermarktRank: 33 },
  { rank: 43, code: "SCO", name: "Scotland", nameNl: "Schotland", points: 1498.35, previousRank: 38, marketValue: "€170.25m", marketValueMillions: 170.25, transfermarktRank: 41 },
  { rank: 44, code: "TUN", name: "Tunisia", nameNl: "Tunesië", points: 1483.05, previousRank: 47, marketValue: "€69.95m", marketValueMillions: 69.95, transfermarktRank: 60 },
  { rank: 45, code: "CMR", name: "Cameroon", nameNl: "Kameroen", points: 1481.24, previousRank: 45, marketValue: "€198.70m", marketValueMillions: 198.7, transfermarktRank: 35 },
  { rank: 46, code: "COD", name: "Congo DR", nameNl: "DR Congo", points: 1478.35, previousRank: 48, marketValue: "€143.90m", marketValueMillions: 143.9, transfermarktRank: 46 },
  { rank: 47, code: "GRE", name: "Greece", nameNl: "Griekenland", points: 1475.82, previousRank: 46, marketValue: "€275.60m", marketValueMillions: 275.6, transfermarktRank: 24 },
  { rank: 48, code: "SVK", name: "Slovakia", nameNl: "Slowakije", points: 1473.94, previousRank: 44, marketValue: "€59.85m", marketValueMillions: 59.85, transfermarktRank: 64 },
  { rank: 49, code: "VEN", name: "Venezuela", nameNl: "Venezuela", points: 1468.05, previousRank: 50, marketValue: "€79.00m", marketValueMillions: 79, transfermarktRank: 56 },
  { rank: 50, code: "UZB", name: "Uzbekistan", nameNl: "Oezbekistan", points: 1465.34, previousRank: 52, marketValue: "€85.33m", marketValueMillions: 85.33, transfermarktRank: 54 },
  { rank: 51, code: "CRC", name: "Costa Rica", nameNl: "Costa Rica", points: 1459.9, previousRank: 51, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 52, code: "MLI", name: "Mali", nameNl: "Mali", points: 1459.13, previousRank: 54, marketValue: "€116.55m", marketValueMillions: 116.55, transfermarktRank: 48 },
  { rank: 53, code: "PER", name: "Peru", nameNl: "Peru", points: 1455.87, previousRank: 53, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 54, code: "CHI", name: "Chile", nameNl: "Chili", points: 1455.28, previousRank: 55, marketValue: "€66.80m", marketValueMillions: 66.8, transfermarktRank: 62 },
  { rank: 55, code: "QAT", name: "Qatar", nameNl: "Qatar", points: 1454.96, previousRank: 56, marketValue: "€19.93m", marketValueMillions: 19.93, transfermarktRank: null },
  { rank: 56, code: "ROU", name: "Romania", nameNl: "Roemenië", points: 1451.16, previousRank: 49, marketValue: "€56.15m", marketValueMillions: 56.15, transfermarktRank: 65 },
  { rank: 57, code: "IRQ", name: "Iraq", nameNl: "Irak", points: 1447.14, previousRank: 58, marketValue: "€21.10m", marketValueMillions: 21.1, transfermarktRank: null },
  { rank: 58, code: "SVN", name: "Slovenia", nameNl: "Slovenië", points: 1446.44, previousRank: 57, marketValue: "€100.50m", marketValueMillions: 100.5, transfermarktRank: 51 },
  { rank: 59, code: "IRL", name: "Republic of Ireland", nameNl: "Ierland", points: 1436.63, previousRank: 59, marketValue: "€146.85m", marketValueMillions: 146.85, transfermarktRank: 45 },
  { rank: 60, code: "RSA", name: "South Africa", nameNl: "Zuid-Afrika", points: 1429.73, previousRank: 60, marketValue: "€49.25m", marketValueMillions: 49.25, transfermarktRank: 68 },
  { rank: 61, code: "KSA", name: "Saudi Arabia", nameNl: "Saudi-Arabië", points: 1421.43, previousRank: 61, marketValue: "€40.68m", marketValueMillions: 40.68, transfermarktRank: 72 },
  { rank: 62, code: "BFA", name: "Burkina Faso", nameNl: "Burkina Faso", points: 1412.49, previousRank: 62, marketValue: "€110.55m", marketValueMillions: 110.55, transfermarktRank: 50 },
  { rank: 63, code: "JOR", name: "Jordan", nameNl: "Jordanië", points: 1391.45, previousRank: 64, marketValue: "€20.00m", marketValueMillions: 20, transfermarktRank: null },
  { rank: 64, code: "ALB", name: "Albania", nameNl: "Albanië", points: 1388.06, previousRank: 63, marketValue: "€88.80m", marketValueMillions: 88.8, transfermarktRank: 53 },
  { rank: 65, code: "BIH", name: "Bosnia and Herzegovina", nameNl: "Bosnië en Herzegovina", points: 1385.84, previousRank: 71, marketValue: "€151.60m", marketValueMillions: 151.6, transfermarktRank: 43 },
  { rank: 66, code: "HON", name: "Honduras", nameNl: "Honduras", points: 1380.27, previousRank: 65, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 67, code: "MKD", name: "North Macedonia", nameNl: "Noord-Macedonië", points: 1372.04, previousRank: 66, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 68, code: "UAE", name: "United Arab Emirates", nameNl: "Verenigde Arabische Emiraten", points: 1370.47, previousRank: 68, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 69, code: "CPV", name: "Cabo Verde", nameNl: "Kaapverdië", points: 1366.13, previousRank: 67, marketValue: "€54.50m", marketValueMillions: 54.5, transfermarktRank: 67 },
  { rank: 70, code: "NIR", name: "Northern Ireland", nameNl: "Noord-Ierland", points: 1362.16, previousRank: 69, marketValue: "€79.90m", marketValueMillions: 79.9, transfermarktRank: 55 },
  { rank: 71, code: "JAM", name: "Jamaica", nameNl: "Jamaica", points: 1358, previousRank: 70, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 72, code: "GEO", name: "Georgia", nameNl: "Georgië", points: 1350.18, previousRank: 73, marketValue: "€260.00m", marketValueMillions: 260, transfermarktRank: 26 },
  { rank: 73, code: "FIN", name: "Finland", nameNl: "Finland", points: 1346.41, previousRank: 75, marketValue: "€41.85m", marketValueMillions: 41.85, transfermarktRank: 71 },
  { rank: 74, code: "GHA", name: "Ghana", nameNl: "Ghana", points: 1346.31, previousRank: 72, marketValue: "€234.60m", marketValueMillions: 234.6, transfermarktRank: 31 },
  { rank: 75, code: "ISL", name: "Iceland", nameNl: "IJsland", points: 1345.07, previousRank: 74, marketValue: "€89.10m", marketValueMillions: 89.1, transfermarktRank: 52 },
  { rank: 76, code: "BOL", name: "Bolivia", nameNl: "Bolivia", points: 1329.42, previousRank: 76, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 77, code: "ISR", name: "Israel", nameNl: "Israël", points: 1328.33, previousRank: 77, marketValue: "€62.90m", marketValueMillions: 62.9, transfermarktRank: 63 },
  { rank: 78, code: "KOS", name: "Kosovo", nameNl: "Kosovo", points: 1318.83, previousRank: 79, marketValue: "€147.48m", marketValueMillions: 147.48, transfermarktRank: 44 },
  { rank: 79, code: "OMA", name: "Oman", nameNl: "Oman", points: 1313.46, previousRank: 78, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 80, code: "GUI", name: "Guinea", nameNl: "Guinee", points: 1300.01, previousRank: 80, marketValue: "€74.13m", marketValueMillions: 74.13, transfermarktRank: 59 },
  { rank: 81, code: "MNE", name: "Montenegro", nameNl: "Montenegro", points: 1295.52, previousRank: 82, marketValue: "€68.55m", marketValueMillions: 68.55, transfermarktRank: 61 },
  { rank: 82, code: "CUW", name: "Curaçao", nameNl: "Curaçao", points: 1294.65, previousRank: 81, marketValue: "€25.78m", marketValueMillions: 25.78, transfermarktRank: null },
  { rank: 83, code: "HAI", name: "Haiti", nameNl: "Haïti", points: 1291.71, previousRank: 83, marketValue: "€55.90m", marketValueMillions: 55.9, transfermarktRank: 66 },
  { rank: 84, code: "SYR", name: "Syria", nameNl: "Syrië", points: 1288.56, previousRank: 84, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 85, code: "NZL", name: "New Zealand", nameNl: "Nieuw-Zeeland", points: 1281.57, previousRank: 85, marketValue: "€34.35m", marketValueMillions: 34.35, transfermarktRank: null },
  { rank: 86, code: "BUL", name: "Bulgaria", nameNl: "Bulgarije", points: 1278.9, previousRank: 87, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 87, code: "GAB", name: "Gabon", nameNl: "Gabon", points: 1272.51, previousRank: 86, marketValue: "€34.98m", marketValueMillions: 34.98, transfermarktRank: 75 },
  { rank: 88, code: "UGA", name: "Uganda", nameNl: "Oeganda", points: 1264.09, previousRank: 88, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 89, code: "ANG", name: "Angola", nameNl: "Angola", points: 1263.1, previousRank: 89, marketValue: "€47.35m", marketValueMillions: 47.35, transfermarktRank: 69 },
  { rank: 90, code: "BEN", name: "Benin", nameNl: "Benin", points: 1258.98, previousRank: 92, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 91, code: "BHR", name: "Bahrain", nameNl: "Bahrein", points: 1258.53, previousRank: 90, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 92, code: "ZAM", name: "Zambia", nameNl: "Zambia", points: 1255.82, previousRank: 91, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 93, code: "THA", name: "Thailand", nameNl: "Thailand", points: 1252.14, previousRank: 96, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 94, code: "CHN", name: "China PR", nameNl: "China", points: 1251.6, previousRank: 93, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 95, code: "PLE", name: "Palestine", nameNl: "Palestina", points: 1244.73, previousRank: 95, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 96, code: "GUA", name: "Guatemala", nameNl: "Guatemala", points: 1243.47, previousRank: 94, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 97, code: "BLR", name: "Belarus", nameNl: "Belarus", points: 1235.82, previousRank: 98, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 98, code: "LUX", name: "Luxembourg", nameNl: "Luxemburg", points: 1227.77, previousRank: 102, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 99, code: "VIE", name: "Vietnam", nameNl: "Vietnam", points: 1225.68, previousRank: 108, marketValue: null, marketValueMillions: null, transfermarktRank: null },
  { rank: 100, code: "SLV", name: "El Salvador", nameNl: "El Salvador", points: 1225.26, previousRank: 99, marketValue: null, marketValueMillions: null, transfermarktRank: null },
];

export const fifaRankingByCode = new Map(fifaRanking.map((row) => [row.code, row]));

export function fifaRankForTeam(code: string | null | undefined) {
  if (!code) return null;
  return fifaRankingByCode.get(code.toUpperCase())?.rank ?? null;
}

export function fifaRankLabel(code: string | null | undefined) {
  const rank = fifaRankForTeam(code);
  return rank ? `#${rank}` : null;
}
