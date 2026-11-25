// Tableaux comparatifs référencés dans le MDX par <ComparisonTable rows="..."/>.
// "TODO" s'affiche comme une donnée à compléter après test.
type Row = { app: string; cells: string[]; program?: string };
type Table = { en: string[]; fr: string[]; rows: Row[] };
const T = "—"; // donnée pas encore sourcée

export const TABLES: Record<string, Table> = {
  "home-top3": {
    en: ["App", "From /month", "Adult content", "Images", "Our score"],
    fr: ["Application", "Dès /mois", "Contenu adulte", "Images", "Notre note"],
    rows: [
      { app: "Candy AI", cells: ["$3.99 (yearly)", "✅", "✅ tokens", "7.4/10"], program: "candy-ai" },
      { app: "OurDream AI", cells: [T, "✅", "✅", T], program: "ourdream-ai" },
      { app: "Replika", cells: ["~$7.99 (Pro)", "Limited", "❌", T], program: "replika" },
    ],
  },
  "candy-features": {
    en: ["Feature", "Free", "Premium"],
    fr: ["Fonction", "Gratuit", "Premium"],
    rows: [
      { app: "Chat", cells: ["5 messages in total", "Unlimited"] },
      { app: "Images", cells: ["1 image", "~4 tokens"] },
      { app: "Voice calls", cells: ["❌", "~3 tokens/min"] },
      { app: "Live Action video", cells: ["❌", "~15–20 tokens"] },
      { app: "Monthly tokens", cells: ["0", "100"] },
    ],
  },
  alternatives: {
    en: ["App", "From /month", "Free plan", "Images", "Voice", "Adult content", "Our score"],
    fr: ["Application", "Dès /mois", "Gratuit", "Images", "Voix", "Contenu adulte", "Notre note"],
    rows: [
      { app: "Candy AI", cells: ["$3.99 (yearly)", "Limited", "✅ tokens", "✅ tokens", "✅", "7.4/10"], program: "candy-ai" },
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
      { app: "Candy AI", cells: ["5 in total", "1", "❌", "7.4/10"], program: "candy-ai" },
      { app: T, cells: [T, T, T, T] },
    ],
  },
  "ai-girlfriend": {
    en: ["App", "Best for", "From /month", "Free plan", "Our score"],
    fr: ["Application", "Pour qui", "Dès /mois", "Gratuit", "Notre note"],
    rows: [
      { app: "Candy AI", cells: ["Images & customisation", "$3.99 (yearly)", "Limited", "7.4/10"], program: "candy-ai" },
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
      { app: "Candy AI", cells: ["5 in total", "1", "Email", "No", "7.4/10"], program: "candy-ai" },
      { app: "Character AI", cells: ["Unlimited", "—", "Email", "No", T] },
      { app: "Replika", cells: ["Unlimited (friend)", "—", "Email", "No", T], program: "replika" },
      { app: T, cells: [T, T, T, T, T] },
    ],
  },
  "chat-quality": {
    en: ["App", "Natural replies", "Memory", "Personality", "Voice", "Score"],
    fr: ["Application", "Naturel", "Mémoire", "Caractère", "Français", "Note"],
    rows: [
      { app: "Candy AI", cells: ["Fluid, warm", "Slips after ~50 msgs", "Stable", "✅ tokens", "7.4/10"], program: "candy-ai" },
      { app: "Replika", cells: [T, T, T, T, T], program: "replika" },
      { app: "Character AI", cells: [T, T, T, T, T] },
    ],
  },
  anime: {
    en: ["App", "Anime art", "Style consistency", "Role-play", "Price", "Score"],
    fr: ["Application", "Style anime", "Cohérence", "Jeu de rôle", "Prix", "Note"],
    rows: [
      { app: "Candy AI", cells: ["✅", "Good", "—", "$3.99 (yearly)", "7.4/10"], program: "candy-ai" },
      { app: "Character AI", cells: ["❌", "—", T, "Free", T] },
    ],
  },
  "ai-companion": {
    en: ["App", "Purpose", "From /month", "Free plan", "Our score"],
    fr: ["Application", "Usage", "Dès /mois", "Gratuit", "Notre note"],
    rows: [
      { app: "Replika", cells: ["Friendship", "~$7.99 (Pro)", "✅", T], program: "replika" },
      { app: "Candy AI", cells: ["Romance & images", "$3.99 (yearly)", "Limited", "7.4/10"], program: "candy-ai" },
      { app: "Character AI", cells: ["Role-play", "Free", "✅", T] },
    ],
  },
  hub: {
    en: ["App", "Best for", "From /month", "Free plan", "Our score"],
    fr: ["Application", "Pour qui", "Dès /mois", "Gratuit", "Notre note"],
    rows: [
      { app: "Candy AI", cells: ["Images & customisation", "$3.99 (yearly)", "Limited", "7.4/10"], program: "candy-ai" },
      { app: "OurDream AI", cells: ["Visual role-play", T, T, T], program: "ourdream-ai" },
      { app: "CrushOn AI", cells: ["Unfiltered role-play", T, T, T], program: "crushon-ai" },
      { app: "Nomi AI", cells: ["Memory & long chats", T, T, T], program: "nomi-ai" },
      { app: "Kupid AI", cells: [T, T, T, T], program: "kupid-ai" },
      { app: "Replika", cells: ["Friendship", "~$7.99 (Pro)", "✅", T], program: "replika" },
    ],
  },
  roleplay: {
    en: ["Platform", "Character library", "Free messages", "Content filter", "Memory", "Our score"],
    fr: ["Plateforme", "Personnages", "Messages gratuits", "Filtre", "Mémoire", "Notre note"],
    rows: [
      { app: "CrushOn AI", cells: ["Large, user-made", T, "Optional (18+)", T, T], program: "crushon-ai" },
      { app: "Joi AI", cells: [T, T, "Optional (18+)", T, T], program: "joi-ai" },
      { app: "OurDream AI", cells: [T, T, "Optional (18+)", T, T], program: "ourdream-ai" },
      { app: "Candy AI", cells: ["Curated + custom", "5 in total", "Optional (18+)", "Slips after ~50 msgs", "7.4/10"], program: "candy-ai" },
      { app: "Character AI", cells: ["Huge, user-made", "Unlimited", "Strict", T, T] },
      { app: "Janitor AI", cells: ["Large, user-made", T, "Optional", T, T] },
      { app: "Talkie", cells: [T, T, "Strict", T, T] },
      { app: "PolyBuzz", cells: [T, T, T, T, T] },
    ],
  },
  "roleplay-alts": {
    en: ["App", "Why switch", "Free plan", "Content filter", "Our score"],
    fr: ["Application", "Pourquoi changer", "Gratuit", "Filtre", "Notre note"],
    rows: [
      { app: "CrushOn AI", cells: ["Fewer filters, big library", T, "Optional (18+)", T], program: "crushon-ai" },
      { app: "Nomi AI", cells: ["Long-term memory", T, "Optional (18+)", T], program: "nomi-ai" },
      { app: "OurDream AI", cells: ["Images inside the story", T, "Optional (18+)", T], program: "ourdream-ai" },
      { app: "Joi AI", cells: [T, T, "Optional (18+)", T], program: "joi-ai" },
      { app: "Candy AI", cells: ["Custom characters + images", "Limited", "Optional (18+)", "7.4/10"], program: "candy-ai" },
      { app: "Replika", cells: ["One companion, no role-play", "✅", "Strict", T], program: "replika" },
    ],
  },
  boyfriend: {
    en: ["App", "Male characters", "Free plan", "Voice", "Our score"],
    fr: ["Application", "Personnages masculins", "Gratuit", "Voix", "Notre note"],
    rows: [
      { app: "CrushOn AI", cells: [T, T, T, T], program: "crushon-ai" },
      { app: "Candy AI", cells: ["✅ (boyfriend mode)", "Limited", "✅ tokens", "7.4/10"], program: "candy-ai" },
      { app: "Nomi AI", cells: ["✅ (any gender)", T, T, T], program: "nomi-ai" },
      { app: "Replika", cells: ["✅ (any gender)", "✅", "✅", T], program: "replika" },
      { app: "Character AI", cells: ["✅ user-made", "✅", "✅", T] },
    ],
  },
  "free-chat": {
    en: ["App", "Free messages", "Login needed", "Main limit", "Our score"],
    fr: ["Application", "Messages gratuits", "Compte requis", "Limite principale", "Notre note"],
    rows: [
      { app: "Character AI", cells: ["Unlimited", "✅", "Strict filter", T] },
      { app: "CrushOn AI", cells: [T, T, T, T], program: "crushon-ai" },
      { app: "Nomi AI", cells: [T, "✅", T, T], program: "nomi-ai" },
      { app: "Candy AI", cells: ["5 in total", "✅", "Very short trial", "7.4/10"], program: "candy-ai" },
      { app: "Replika", cells: ["Unlimited (friend)", "✅", "No romance", T], program: "replika" },
    ],
  },
  ourdream: {
    en: ["Feature", "Free", "Paid"],
    fr: ["Fonction", "Gratuit", "Payant"],
    rows: [
      { app: "Text chat", cells: [T, T] },
      { app: "Images", cells: [T, T] },
      { app: "Voice", cells: [T, T] },
      { app: "Video", cells: [T, T] },
      { app: "Monthly credits", cells: [T, T] },
    ],
  },
};
