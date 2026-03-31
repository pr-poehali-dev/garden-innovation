export type ResourceType =
  | "rough_logs" | "logs" | "ash_logs" | "pine_logs" | "cedar_logs" | "bloodoak_logs" | "ashenbark_logs" | "whitewood_logs"
  | "rough_stone" | "limestone" | "sandstone" | "travertine" | "granite" | "slate" | "basalt"
  | "copper_ore" | "tin_ore" | "iron_ore" | "titanium_ore" | "runite_ore" | "meteorite_ore" | "admanite_ore"
  | "raw_hide" | "thin_hide" | "medium_hide" | "thick_hide" | "rugged_hide" | "thick_leather" | "resilient_hide"
  | "cotton" | "flax" | "hemp" | "skyflower" | "fiber" | "thorn_root" | "silkthread"
  | "silver"

export type Tier = "T3" | "T4" | "T5" | "T6" | "T7" | "T8"

export type Category =
  | "sword" | "axe" | "mace" | "hammer" | "spear" | "quarterstaff"
  | "dagger" | "bow" | "crossbow" | "warbow"
  | "fire_staff" | "frost_staff" | "arcane_staff" | "holy_staff" | "nature_staff" | "cursed_staff"
  | "helmet" | "armor" | "boots"
  | "plate_helmet" | "plate_armor" | "plate_boots"
  | "leather_helmet" | "leather_armor" | "leather_boots"
  | "cloth_helmet" | "cloth_armor" | "cloth_boots"
  | "shield" | "torch" | "off_hand_tome"

export type ItemType = "weapon" | "armor"

export interface ResourceRequirement {
  resource: ResourceType
  amount: number
}

export interface Recipe {
  id: string
  name: string
  category: Category
  type: ItemType
  tier: Tier
  resources: ResourceRequirement[]
  silver?: number
}

const TIER_MULTIPLIER: Record<Tier, number> = {
  T3: 1,
  T4: 2,
  T5: 4,
  T6: 8,
  T7: 16,
  T8: 32,
}

const WEAPON_WOOD: Record<Tier, ResourceType> = {
  T3: "rough_logs", T4: "logs", T5: "ash_logs", T6: "pine_logs", T7: "cedar_logs", T8: "bloodoak_logs",
}
const WEAPON_ORE: Record<Tier, ResourceType> = {
  T3: "copper_ore", T4: "iron_ore", T5: "titanium_ore", T6: "runite_ore", T7: "meteorite_ore", T8: "admanite_ore",
}
const ARMOR_HIDE: Record<Tier, ResourceType> = {
  T3: "raw_hide", T4: "thin_hide", T5: "medium_hide", T6: "thick_hide", T7: "rugged_hide", T8: "resilient_hide",
}
const ARMOR_FIBER: Record<Tier, ResourceType> = {
  T3: "cotton", T4: "flax", T5: "hemp", T6: "skyflower", T7: "fiber", T8: "thorn_root",
}
const ARMOR_STONE: Record<Tier, ResourceType> = {
  T3: "rough_stone", T4: "limestone", T5: "sandstone", T6: "travertine", T7: "granite", T8: "slate",
}

function makeWeaponOneHand(id: string, name: string, category: Category, tier: Tier): Recipe {
  const m = TIER_MULTIPLIER[tier]
  return {
    id: `${id}_${tier}`,
    name: `${name} (${tier})`,
    category,
    type: "weapon",
    tier,
    resources: [
      { resource: WEAPON_ORE[tier], amount: 8 * m },
      { resource: WEAPON_WOOD[tier], amount: 4 * m },
    ],
  }
}

function makeWeaponTwoHand(id: string, name: string, category: Category, tier: Tier): Recipe {
  const m = TIER_MULTIPLIER[tier]
  return {
    id: `${id}_${tier}`,
    name: `${name} (${tier})`,
    category,
    type: "weapon",
    tier,
    resources: [
      { resource: WEAPON_ORE[tier], amount: 12 * m },
      { resource: WEAPON_WOOD[tier], amount: 8 * m },
    ],
  }
}

function makeWeaponBow(id: string, name: string, category: Category, tier: Tier): Recipe {
  const m = TIER_MULTIPLIER[tier]
  return {
    id: `${id}_${tier}`,
    name: `${name} (${tier})`,
    category,
    type: "weapon",
    tier,
    resources: [
      { resource: WEAPON_WOOD[tier], amount: 16 * m },
      { resource: ARMOR_HIDE[tier], amount: 4 * m },
    ],
  }
}

function makeWeaponStaff(id: string, name: string, category: Category, tier: Tier): Recipe {
  const m = TIER_MULTIPLIER[tier]
  return {
    id: `${id}_${tier}`,
    name: `${name} (${tier})`,
    category,
    type: "weapon",
    tier,
    resources: [
      { resource: WEAPON_WOOD[tier], amount: 16 * m },
      { resource: ARMOR_FIBER[tier], amount: 4 * m },
    ],
  }
}

function makeWeaponDagger(id: string, name: string, category: Category, tier: Tier): Recipe {
  const m = TIER_MULTIPLIER[tier]
  return {
    id: `${id}_${tier}`,
    name: `${name} (${tier})`,
    category,
    type: "weapon",
    tier,
    resources: [
      { resource: WEAPON_ORE[tier], amount: 8 * m },
      { resource: ARMOR_HIDE[tier], amount: 4 * m },
    ],
  }
}

function makePlateArmor(id: string, name: string, category: Category, tier: Tier, slot: "head" | "chest" | "feet"): Recipe {
  const m = TIER_MULTIPLIER[tier]
  const base = slot === "chest" ? 16 : 8
  return {
    id: `${id}_${tier}`,
    name: `${name} (${tier})`,
    category,
    type: "armor",
    tier,
    resources: [
      { resource: ARMOR_STONE[tier], amount: base * m },
      { resource: WEAPON_ORE[tier], amount: (base / 2) * m },
    ],
  }
}

function makeLeatherArmor(id: string, name: string, category: Category, tier: Tier, slot: "head" | "chest" | "feet"): Recipe {
  const m = TIER_MULTIPLIER[tier]
  const base = slot === "chest" ? 16 : 8
  return {
    id: `${id}_${tier}`,
    name: `${name} (${tier})`,
    category,
    type: "armor",
    tier,
    resources: [
      { resource: ARMOR_HIDE[tier], amount: base * m },
      { resource: WEAPON_WOOD[tier], amount: (base / 2) * m },
    ],
  }
}

function makeClothArmor(id: string, name: string, category: Category, tier: Tier, slot: "head" | "chest" | "feet"): Recipe {
  const m = TIER_MULTIPLIER[tier]
  const base = slot === "chest" ? 16 : 8
  return {
    id: `${id}_${tier}`,
    name: `${name} (${tier})`,
    category,
    type: "armor",
    tier,
    resources: [
      { resource: ARMOR_FIBER[tier], amount: base * m },
      { resource: WEAPON_WOOD[tier], amount: (base / 4) * m },
    ],
  }
}

const TIERS: Tier[] = ["T3", "T4", "T5", "T6", "T7", "T8"]

export const ALL_RECIPES: Recipe[] = [
  // ── МЕЧИ ──────────────────────────────────────────────────────────────────
  ...TIERS.map(t => makeWeaponOneHand("sword", "Меч", "sword", t)),
  ...TIERS.map(t => makeWeaponTwoHand("claymore", "Клеймор", "sword", t)),

  // ── ТОПОРЫ ────────────────────────────────────────────────────────────────
  ...TIERS.map(t => makeWeaponOneHand("axe", "Топор", "axe", t)),
  ...TIERS.map(t => makeWeaponTwoHand("battle_axe", "Боевой топор", "axe", t)),

  // ── БУЛАВЫ ────────────────────────────────────────────────────────────────
  ...TIERS.map(t => makeWeaponOneHand("mace", "Булава", "mace", t)),
  ...TIERS.map(t => makeWeaponTwoHand("heavy_mace", "Тяжёлая булава", "mace", t)),

  // ── МОЛОТЫ ────────────────────────────────────────────────────────────────
  ...TIERS.map(t => makeWeaponTwoHand("hammer", "Молот", "hammer", t)),
  ...TIERS.map(t => makeWeaponTwoHand("great_hammer", "Великий молот", "hammer", t)),

  // ── КОПЬЯ ─────────────────────────────────────────────────────────────────
  ...TIERS.map(t => makeWeaponTwoHand("spear", "Копьё", "spear", t)),
  ...TIERS.map(t => makeWeaponTwoHand("glaive", "Глефа", "spear", t)),

  // ── ПОСОХИ БЛИЖНЕГО БОЯ ───────────────────────────────────────────────────
  ...TIERS.map(t => makeWeaponTwoHand("quarterstaff", "Боевой посох", "quarterstaff", t)),
  ...TIERS.map(t => makeWeaponTwoHand("iron_clad_staff", "Закованный посох", "quarterstaff", t)),

  // ── КИНЖАЛЫ ───────────────────────────────────────────────────────────────
  ...TIERS.map(t => makeWeaponDagger("dagger", "Кинжал", "dagger", t)),
  ...TIERS.map(t => makeWeaponDagger("dagger_pair", "Парные кинжалы", "dagger", t)),

  // ── ЛУКИ ──────────────────────────────────────────────────────────────────
  ...TIERS.map(t => makeWeaponBow("bow", "Лук", "bow", t)),
  ...TIERS.map(t => makeWeaponBow("warbow", "Боевой лук", "warbow", t)),

  // ── АРБАЛЕТЫ ──────────────────────────────────────────────────────────────
  ...TIERS.map(t => ({
    ...makeWeaponBow("crossbow", "Арбалет", "crossbow", t),
    resources: [
      { resource: WEAPON_ORE[t], amount: 8 * TIER_MULTIPLIER[t] },
      { resource: WEAPON_WOOD[t], amount: 8 * TIER_MULTIPLIER[t] },
    ],
  } as Recipe)),
  ...TIERS.map(t => ({
    ...makeWeaponBow("heavy_crossbow", "Тяжёлый арбалет", "crossbow", t),
    resources: [
      { resource: WEAPON_ORE[t], amount: 12 * TIER_MULTIPLIER[t] },
      { resource: WEAPON_WOOD[t], amount: 12 * TIER_MULTIPLIER[t] },
    ],
  } as Recipe)),

  // ── ПОСОХИ ОГНЯ ───────────────────────────────────────────────────────────
  ...TIERS.map(t => makeWeaponStaff("fire_staff", "Посох огня", "fire_staff", t)),
  ...TIERS.map(t => makeWeaponStaff("great_fire_staff", "Великий посох огня", "fire_staff", t)),

  // ── ПОСОХИ ЛЬДА ───────────────────────────────────────────────────────────
  ...TIERS.map(t => makeWeaponStaff("frost_staff", "Посох льда", "frost_staff", t)),
  ...TIERS.map(t => makeWeaponStaff("great_frost_staff", "Великий посох льда", "frost_staff", t)),

  // ── ТАЙНЫЕ ПОСОХИ ─────────────────────────────────────────────────────────
  ...TIERS.map(t => makeWeaponStaff("arcane_staff", "Тайный посох", "arcane_staff", t)),
  ...TIERS.map(t => makeWeaponStaff("great_arcane_staff", "Великий тайный посох", "arcane_staff", t)),

  // ── СВЯТЫЕ ПОСОХИ ─────────────────────────────────────────────────────────
  ...TIERS.map(t => makeWeaponStaff("holy_staff", "Святой посох", "holy_staff", t)),
  ...TIERS.map(t => makeWeaponStaff("great_holy_staff", "Великий святой посох", "holy_staff", t)),

  // ── ПОСОХИ ПРИРОДЫ ────────────────────────────────────────────────────────
  ...TIERS.map(t => makeWeaponStaff("nature_staff", "Посох природы", "nature_staff", t)),
  ...TIERS.map(t => makeWeaponStaff("great_nature_staff", "Великий посох природы", "nature_staff", t)),

  // ── ПРОКЛЯТЫЕ ПОСОХИ ──────────────────────────────────────────────────────
  ...TIERS.map(t => makeWeaponStaff("cursed_staff", "Проклятый посох", "cursed_staff", t)),
  ...TIERS.map(t => makeWeaponStaff("great_cursed_staff", "Великий проклятый посох", "cursed_staff", t)),

  // ── ЩИТЫ ──────────────────────────────────────────────────────────────────
  ...TIERS.map(t => ({
    id: `shield_${t}`,
    name: `Щит (${t})`,
    category: "shield" as Category,
    type: "weapon" as ItemType,
    tier: t,
    resources: [
      { resource: WEAPON_ORE[t], amount: 8 * TIER_MULTIPLIER[t] },
      { resource: WEAPON_WOOD[t], amount: 4 * TIER_MULTIPLIER[t] },
    ],
  } as Recipe)),

  // ── ФАКЕЛЫ ────────────────────────────────────────────────────────────────
  ...TIERS.map(t => ({
    id: `torch_${t}`,
    name: `Факел (${t})`,
    category: "torch" as Category,
    type: "weapon" as ItemType,
    tier: t,
    resources: [
      { resource: WEAPON_WOOD[t], amount: 8 * TIER_MULTIPLIER[t] },
      { resource: ARMOR_FIBER[t], amount: 4 * TIER_MULTIPLIER[t] },
    ],
  } as Recipe)),

  // ── КНИГИ (OFF-HAND) ──────────────────────────────────────────────────────
  ...TIERS.map(t => ({
    id: `tome_${t}`,
    name: `Фолиант (${t})`,
    category: "off_hand_tome" as Category,
    type: "weapon" as ItemType,
    tier: t,
    resources: [
      { resource: ARMOR_FIBER[t], amount: 8 * TIER_MULTIPLIER[t] },
      { resource: WEAPON_WOOD[t], amount: 4 * TIER_MULTIPLIER[t] },
    ],
  } as Recipe)),

  // ── ПЛАСТИНЧАТЫЕ ДОСПЕХИ ──────────────────────────────────────────────────
  ...TIERS.map(t => makePlateArmor("plate_helmet", "Пластинчатый шлем", "plate_helmet", t, "head")),
  ...TIERS.map(t => makePlateArmor("plate_armor", "Пластинчатый доспех", "plate_armor", t, "chest")),
  ...TIERS.map(t => makePlateArmor("plate_boots", "Пластинчатые сапоги", "plate_boots", t, "feet")),

  // ── КОЖАНЫЕ ДОСПЕХИ ───────────────────────────────────────────────────────
  ...TIERS.map(t => makeLeatherArmor("leather_helmet", "Кожаный шлем", "leather_helmet", t, "head")),
  ...TIERS.map(t => makeLeatherArmor("leather_armor", "Кожаный доспех", "leather_armor", t, "chest")),
  ...TIERS.map(t => makeLeatherArmor("leather_boots", "Кожаные сапоги", "leather_boots", t, "feet")),

  // ── ТКАНЕВЫЕ ДОСПЕХИ ──────────────────────────────────────────────────────
  ...TIERS.map(t => makeClothArmor("cloth_helmet", "Тканевый капюшон", "cloth_helmet", t, "head")),
  ...TIERS.map(t => makeClothArmor("cloth_armor", "Тканевый халат", "cloth_armor", t, "chest")),
  ...TIERS.map(t => makeClothArmor("cloth_boots", "Тканевые туфли", "cloth_boots", t, "feet")),
]

export const RESOURCE_NAMES: Record<ResourceType, string> = {
  rough_logs: "Необр. брёвна",
  logs: "Брёвна",
  ash_logs: "Ясеневые брёвна",
  pine_logs: "Сосновые брёвна",
  cedar_logs: "Кедровые брёвна",
  bloodoak_logs: "Кровавый дуб",
  ashenbark_logs: "Пепельная кора",
  whitewood_logs: "Белое дерево",
  rough_stone: "Необр. камень",
  limestone: "Известняк",
  sandstone: "Песчаник",
  travertine: "Травертин",
  granite: "Гранит",
  slate: "Сланец",
  basalt: "Базальт",
  copper_ore: "Медная руда",
  tin_ore: "Оловянная руда",
  iron_ore: "Железная руда",
  titanium_ore: "Титановая руда",
  runite_ore: "Рунитовая руда",
  meteorite_ore: "Метеоритная руда",
  admanite_ore: "Адманитовая руда",
  raw_hide: "Сырая шкура",
  thin_hide: "Тонкая шкура",
  medium_hide: "Шкура",
  thick_hide: "Толстая шкура",
  rugged_hide: "Грубая шкура",
  thick_leather: "Плотная кожа",
  resilient_hide: "Крепкая шкура",
  raw_hide: "Сырая шкура",
  cotton: "Хлопок",
  flax: "Лён",
  hemp: "Пенька",
  skyflower: "Небесный цветок",
  fiber: "Волокно",
  thorn_root: "Шипокорень",
  silkthread: "Шёлковая нить",
  silver: "Серебро",
}

export const CATEGORY_LABELS: Record<Category, string> = {
  sword: "Меч",
  axe: "Топор",
  mace: "Булава",
  hammer: "Молот",
  spear: "Копьё",
  quarterstaff: "Посох ближ. боя",
  dagger: "Кинжал",
  bow: "Лук",
  crossbow: "Арбалет",
  warbow: "Боевой лук",
  fire_staff: "Посох огня",
  frost_staff: "Посох льда",
  arcane_staff: "Тайный посох",
  holy_staff: "Святой посох",
  nature_staff: "Посох природы",
  cursed_staff: "Проклятый посох",
  helmet: "Шлем",
  armor: "Доспех",
  boots: "Сапоги",
  plate_helmet: "Шлем (пластина)",
  plate_armor: "Доспех (пластина)",
  plate_boots: "Сапоги (пластина)",
  leather_helmet: "Шлем (кожа)",
  leather_armor: "Доспех (кожа)",
  leather_boots: "Сапоги (кожа)",
  cloth_helmet: "Капюшон (ткань)",
  cloth_armor: "Халат (ткань)",
  cloth_boots: "Туфли (ткань)",
  shield: "Щит",
  torch: "Факел",
  off_hand_tome: "Фолиант",
}

export const RESOURCE_EMOJI: Partial<Record<ResourceType, string>> = {
  copper_ore: "🟤", iron_ore: "⚫", titanium_ore: "🔵", runite_ore: "🟣", meteorite_ore: "🔴", admanite_ore: "🟡",
  rough_logs: "🌲", logs: "🌲", ash_logs: "🌲", pine_logs: "🌲", cedar_logs: "🌲", bloodoak_logs: "🌲",
  rough_stone: "🪨", limestone: "🪨", sandstone: "🪨", travertine: "🪨", granite: "🪨", slate: "🪨",
  raw_hide: "🦌", thin_hide: "🦌", medium_hide: "🦌", thick_hide: "🦌", rugged_hide: "🦌", resilient_hide: "🦌",
  cotton: "🌿", flax: "🌿", hemp: "🌿", skyflower: "🌿", fiber: "🌿", thorn_root: "🌿",
  silver: "💰",
}
