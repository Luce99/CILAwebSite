/**
 * Galeria de avatares para seleccion de perfil.
 * Usa DiceBear API (gratuita, open-source) para generar avatares SVG.
 * Cada avatar tiene un id unico, una URL, una categoria y una etiqueta.
 */

const DICEBEAR_BASE = "https://api.dicebear.com/7.x";

const AVATAR_STYLES = {
  AVATAAARS: "avataaars",
  LORELEI: "lorelei",
  NOTIONISTS: "notionists",
  BOTTTS: "bottts",
  PIXEL_ART: "pixel-art",
  ADVENTURER: "adventurer",
};

const CATEGORIES = {
  FEMININE: "Femenino",
  MASCULINE: "Masculino",
  NEUTRAL: "Otros",
};

function buildAvatarUrl(style, seed) {
  return `${DICEBEAR_BASE}/${style}/svg?seed=${seed}`;
}

export const AVATAR_GALLERY = [
  // --- Femeninos ---
  {
    id: "fem-1",
    url: buildAvatarUrl(AVATAR_STYLES.AVATAAARS, "Liliana"),
    category: CATEGORIES.FEMININE,
    label: "Liliana",
  },
  {
    id: "fem-2",
    url: buildAvatarUrl(AVATAR_STYLES.AVATAAARS, "Valentina"),
    category: CATEGORIES.FEMININE,
    label: "Valentina",
  },
  {
    id: "fem-3",
    url: buildAvatarUrl(AVATAR_STYLES.AVATAAARS, "Camila"),
    category: CATEGORIES.FEMININE,
    label: "Camila",
  },
  {
    id: "fem-4",
    url: buildAvatarUrl(AVATAR_STYLES.LORELEI, "Maria"),
    category: CATEGORIES.FEMININE,
    label: "Maria",
  },
  {
    id: "fem-5",
    url: buildAvatarUrl(AVATAR_STYLES.LORELEI, "Sofia"),
    category: CATEGORIES.FEMININE,
    label: "Sofia",
  },
  {
    id: "fem-6",
    url: buildAvatarUrl(AVATAR_STYLES.ADVENTURER, "Isabella"),
    category: CATEGORIES.FEMININE,
    label: "Isabella",
  },
  {
    id: "fem-7",
    url: buildAvatarUrl(AVATAR_STYLES.ADVENTURER, "Luciana"),
    category: CATEGORIES.FEMININE,
    label: "Luciana",
  },
  {
    id: "fem-8",
    url: buildAvatarUrl(AVATAR_STYLES.NOTIONISTS, "Daniela"),
    category: CATEGORIES.FEMININE,
    label: "Daniela",
  },

  // --- Masculinos ---
  {
    id: "masc-1",
    url: buildAvatarUrl(AVATAR_STYLES.AVATAAARS, "Andres"),
    category: CATEGORIES.MASCULINE,
    label: "Andres",
  },
  {
    id: "masc-2",
    url: buildAvatarUrl(AVATAR_STYLES.AVATAAARS, "Santiago"),
    category: CATEGORIES.MASCULINE,
    label: "Santiago",
  },
  {
    id: "masc-3",
    url: buildAvatarUrl(AVATAR_STYLES.AVATAAARS, "Mateo"),
    category: CATEGORIES.MASCULINE,
    label: "Mateo",
  },
  {
    id: "masc-4",
    url: buildAvatarUrl(AVATAR_STYLES.LORELEI, "Carlos"),
    category: CATEGORIES.MASCULINE,
    label: "Carlos",
  },
  {
    id: "masc-5",
    url: buildAvatarUrl(AVATAR_STYLES.LORELEI, "Diego"),
    category: CATEGORIES.MASCULINE,
    label: "Diego",
  },
  {
    id: "masc-6",
    url: buildAvatarUrl(AVATAR_STYLES.ADVENTURER, "Felipe"),
    category: CATEGORIES.MASCULINE,
    label: "Felipe",
  },
  {
    id: "masc-7",
    url: buildAvatarUrl(AVATAR_STYLES.ADVENTURER, "Julian"),
    category: CATEGORIES.MASCULINE,
    label: "Julian",
  },
  {
    id: "masc-8",
    url: buildAvatarUrl(AVATAR_STYLES.NOTIONISTS, "Miguel"),
    category: CATEGORIES.MASCULINE,
    label: "Miguel",
  },

  // --- Neutros / Divertidos ---
  {
    id: "neu-1",
    url: buildAvatarUrl(AVATAR_STYLES.BOTTTS, "Robot1"),
    category: CATEGORIES.NEUTRAL,
    label: "Robot Cool",
  },
  {
    id: "neu-2",
    url: buildAvatarUrl(AVATAR_STYLES.BOTTTS, "Robot2"),
    category: CATEGORIES.NEUTRAL,
    label: "Robot Fun",
  },
  {
    id: "neu-3",
    url: buildAvatarUrl(AVATAR_STYLES.PIXEL_ART, "Pixel1"),
    category: CATEGORIES.NEUTRAL,
    label: "Pixel Art 1",
  },
  {
    id: "neu-4",
    url: buildAvatarUrl(AVATAR_STYLES.PIXEL_ART, "Pixel2"),
    category: CATEGORIES.NEUTRAL,
    label: "Pixel Art 2",
  },
  {
    id: "neu-5",
    url: buildAvatarUrl(AVATAR_STYLES.NOTIONISTS, "Abstract1"),
    category: CATEGORIES.NEUTRAL,
    label: "Abstract 1",
  },
  {
    id: "neu-6",
    url: buildAvatarUrl(AVATAR_STYLES.NOTIONISTS, "Abstract2"),
    category: CATEGORIES.NEUTRAL,
    label: "Abstract 2",
  },
];

export const AVATAR_CATEGORIES = Object.values(CATEGORIES);

export const DEFAULT_AVATAR_ID = "fem-1";

/**
 * Busca un avatar por su ID. Retorna el avatar o el default.
 */
export function getAvatarById(avatarId) {
  const found = AVATAR_GALLERY.find((avatar) => avatar.id === avatarId);
  if (found) {
    return found;
  }
  return AVATAR_GALLERY.find((avatar) => avatar.id === DEFAULT_AVATAR_ID);
}

/**
 * Filtra avatares por categoria.
 */
export function getAvatarsByCategory(category) {
  return AVATAR_GALLERY.filter((avatar) => avatar.category === category);
}
