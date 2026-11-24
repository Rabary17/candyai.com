// Tableaux comparatifs référencés dans le MDX par <ComparisonTable rows="..."/>.
// "TODO" s'affiche comme une donnée à compléter après test.
type Row = { app: string; cells: string[]; program?: string };
type Table = { en: string[]; fr: string[]; rows: Row[] };
const T = "TODO";

export const TABLES: Record<string, Table> = {
  "home-top3": {
    en: ["App", "From /month", "Adult content", "Images", "Our score"],
    fr: ["Application", "Dès /mois", "Contenu adulte", "Images", "Notre note"],
    rows: [
      { app: "Candy AI", cells: ["~$3.99 (annual)", "✅", "✅ tokens", T], program: "candy-ai" },
      { app: "OurDream AI", cells: [T, "✅", "✅", T], program: "ourdream-ai" },
      { app: "Replika", cells: ["~$7.99 (Pro)", "Limited", "❌", T], program: "replika" },
    ],
  },
  "candy-features": {
    en: ["Feature", "Free", "Premium"],
    fr: ["Fonction", "Gratuit", "Premium"],
    rows: [
      { app: "Chat", cells: [T, "Unlimited"] },
      { app: "Images", cells: ["❌", "~4 tokens"] },
      { app: "Voice calls", cells: ["❌", "~3 tokens/min"] },
      { app: "Live Action video", cells: ["❌", T] },
      { app: "Monthly tokens", cells: ["0", "100"] },
    ],
  },
  alternatives: {
    en: ["App", "From /month", "Free plan", "Images", "Voice", "Adult content", "Our score"],
    fr: ["Application", "Dès /mois", "Gratuit", "Images", "Voix", "Contenu adulte", "Notre note"],
    rows: [
      { app: "Candy AI", cells: ["~$3.99 (annual)", "Limited", "✅ tokens", "✅ tokens", "✅", T], program: "candy-ai" },
      { app: "OurDream AI", cells: [T, T, "✅", T, "✅", T], program: "ourdream-ai" },
      { app: "Kupid AI", cells: [T, T, "✅", T, "✅", T], program: "kupid-ai" },
      { app: "Nectar AI", cells: [T, T, "✅", T, "✅", T], program: "nectar-ai" },
      { app: "Replika", cells: ["~$7.99 (Pro)", "✅", "❌", "✅", "Limited", T], program: "replika" },
      { app: "Character AI", cells: ["Free", "✅", "❌", "✅", "❌", T] },
    ],
  },
  "free-alternatives": {
    en: ["App", "Free messages", "Free images", "Adult content", "Our score"],
    fr: ["Application", "Messages gratuits", "Images gratuites", "Contenu adulte", "Notre note"],
    rows: [
      { app: "Character AI", cells: ["Unlimited", "❌", "❌", T] },
      { app: "Replika (friend mode)", cells: ["Unlimited", "❌", "❌", T], program: "replika" },
      { app: "Candy AI", cells: [T, "❌", "❌", T], program: "candy-ai" },
      { app: T, cells: [T, T, T, T] },
    ],
  },
  "ai-girlfriend": {
    en: ["App", "Best for", "From /month", "Free plan", "Our score"],
    fr: ["Application", "Pour qui", "Dès /mois", "Gratuit", "Notre note"],
    rows: [
      { app: "Candy AI", cells: ["Images & customisation", "~$3.99 (annual)", "Limited", T], program: "candy-ai" },
      { app: "OurDream AI", cells: [T, T, T, T], program: "ourdream-ai" },
      { app: "Kupid AI", cells: [T, T, T, T], program: "kupid-ai" },
      { app: "Replika", cells: ["Friendship", "~$7.99 (Pro)", "✅", T], program: "replika" },
      { app: "Character AI", cells: ["Free role-play", "Free", "✅", T] },
    ],
  },
  "free-limits": {
    en: ["App", "Free messages", "Free images", "Sign-up", "Card needed", "Free score"],
    fr: ["Application", "Messages gratuits", "Images gratuites", "Inscription", "Carte", "Note gratuit"],
    rows: [
      { app: "Candy AI", cells: [T, "0", "Email", "No", T], program: "candy-ai" },
      { app: "Character AI", cells: ["Unlimited", "—", "Email", "No", T] },
      { app: "Replika", cells: ["Unlimited (friend)", "—", "Email", "No", T], program: "replika" },
      { app: T, cells: [T, T, T, T, T] },
    ],
  },
  "chat-quality": {
    en: ["App", "Natural replies", "Memory", "Personality", "Voice", "Score"],
    fr: ["Application", "Naturel", "Mémoire", "Caractère", "Français", "Note"],
    rows: [
      { app: "Candy AI", cells: [T, T, T, T, T], program: "candy-ai" },
      { app: "Replika", cells: [T, T, T, T, T], program: "replika" },
      { app: "Character AI", cells: [T, T, T, T, T] },
    ],
  },
  anime: {
    en: ["App", "Anime art", "Style consistency", "Role-play", "Price", "Score"],
    fr: ["Application", "Style anime", "Cohérence", "Jeu de rôle", "Prix", "Note"],
    rows: [
      { app: "Candy AI", cells: ["✅", T, T, "~$3.99 (annual)", T], program: "candy-ai" },
      { app: "Character AI", cells: ["❌", "—", T, "Free", T] },
    ],
  },
  "ai-companion": {
    en: ["App", "Purpose", "From /month", "Free plan", "Our score"],
    fr: ["Application", "Usage", "Dès /mois", "Gratuit", "Notre note"],
    rows: [
      { app: "Replika", cells: ["Friendship", "~$7.99 (Pro)", "✅", T], program: "replika" },
      { app: "Candy AI", cells: ["Romance & images", "~$3.99 (annual)", "Limited", T], program: "candy-ai" },
      { app: "Character AI", cells: ["Role-play", "Free", "✅", T] },
    ],
  },
};
