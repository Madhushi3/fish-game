/**
 * EnvironmentManager.ts
 * Manages the playable swimming environments:
 * 1. Swimming Pool (Figma Default - Real Asset Rendered)
 * 2. Tropical Coral Reef
 * 3. Deep Ocean
 * 4. Sunken Treasure Zone
 */

export type EnvironmentId = 'swimming_pool' | 'tropical_coral_reef' | 'deep_ocean' | 'sunken_treasure_zone'

export interface FishDefinition {
  id: string
  name: string
  species: 'clownfish' | 'blue_tang' | 'angelfish' | 'lanternfish' | 'golden_snapper'
  points: number
  color: string
}

export interface TreasureDefinition {
  id: string
  name: string
  type: 'pearl_shell' | 'gold_chest' | 'starfish_gem' | 'glowing_pearl' | 'magic_potion' | 'coin_sack'
  points: number
  grantsGhostMode?: boolean
}

export interface ObstacleDefinition {
  id: string
  name: string
  type: 'reef_rock' | 'spiky_urchin' | 'abyss_rock' | 'deep_mine' | 'ship_log' | 'rusted_anchor' | 'seaweed'
  width: number
  height: number
}

export interface EnvironmentConfig {
  id: EnvironmentId
  name: string
  subtitle: string
  icon: string
  waterGradient: string
  ambientParticlesColor: string
  shoreType: 'poolside_tiles' | 'coral_shores' | 'abyss_rocks' | 'shipwreck_timbers'
  deckBorderClass: string
  backgroundImage: string
  fishes: FishDefinition[]
  treasures: TreasureDefinition[]
  obstacles: ObstacleDefinition[]
  hasShark: boolean
  hasJellyfish: boolean
}

export const ENVIRONMENTS: Record<EnvironmentId, EnvironmentConfig> = {
  swimming_pool: {
    id: 'swimming_pool',
    name: 'Swimming Pool',
    subtitle: 'Crystal clear water & poolside greenery',
    icon: '🏊',
    waterGradient: 'from-[#38bdf8] via-[#0284c7] to-[#0369a1]',
    ambientParticlesColor: '#bae6fd',
    shoreType: 'poolside_tiles',
    deckBorderClass: 'from-[#fef3c7] via-[#fde68a] to-[#d97706]',
    backgroundImage: '/game-assets/swimming-pool-full-bg.png',
    fishes: [
      { id: 'f_clown', name: 'Clownfish', species: 'clownfish', points: 50, color: '#f97316' },
      { id: 'f_green', name: 'Tropical Green Fish', species: 'angelfish', points: 75, color: '#84cc16' },
      { id: 'f_tang', name: 'Blue Tang', species: 'blue_tang', points: 100, color: '#2563eb' },
    ],
    treasures: [
      { id: 't_chest', name: 'Golden Treasure Chest', type: 'gold_chest', points: 150 },
      { id: 't_potion', name: 'Ghost Power Elixir', type: 'magic_potion', points: 120, grantsGhostMode: true },
    ],
    obstacles: [
      { id: 'obs_rock', name: 'Pool Slate Rock', type: 'reef_rock', width: 68, height: 56 },
      { id: 'obs_log', name: 'Floating Timber Log', type: 'ship_log', width: 95, height: 45 },
      { id: 'obs_seaweed', name: 'Aquatic Seaweed', type: 'seaweed', width: 56, height: 72 },
    ],
    hasShark: false,
    hasJellyfish: false,
  },

  tropical_coral_reef: {
    id: 'tropical_coral_reef',
    name: 'Tropical Coral Reef',
    subtitle: 'Warm azure water & vibrant coral gardens',
    icon: '🪸',
    waterGradient: 'from-[#0ea5e9] via-[#0284c7] to-[#0369a1]',
    ambientParticlesColor: '#67e8f9',
    shoreType: 'coral_shores',
    deckBorderClass: 'from-[#fef3c7] via-[#fde68a] to-[#d97706]',
    backgroundImage: '/game-assets/swimming-pool-full-bg.png',
    fishes: [
      { id: 'f_clown', name: 'Clownfish', species: 'clownfish', points: 50, color: '#f97316' },
      { id: 'f_tang', name: 'Blue Tang', species: 'blue_tang', points: 75, color: '#2563eb' },
      { id: 'f_angel', name: 'Golden Angelfish', species: 'angelfish', points: 100, color: '#facc15' },
    ],
    treasures: [
      { id: 't_shell', name: 'Pearl Oyster Shell', type: 'pearl_shell', points: 100 },
      { id: 't_chest', name: 'Reef Golden Chest', type: 'gold_chest', points: 150 },
      { id: 't_potion', name: 'Ghost Elixir Potion', type: 'magic_potion', points: 120, grantsGhostMode: true },
    ],
    obstacles: [
      { id: 'obs_rock', name: 'Coral Rock', type: 'reef_rock', width: 68, height: 56 },
      { id: 'obs_urchin', name: 'Spiky Sea Urchin', type: 'spiky_urchin', width: 56, height: 56 },
      { id: 'obs_seaweed', name: 'Kelp Cluster', type: 'seaweed', width: 64, height: 72 },
    ],
    hasShark: false,
    hasJellyfish: false,
  },

  deep_ocean: {
    id: 'deep_ocean',
    name: 'Arctic Ice Lagoon',
    subtitle: 'Crystal glacial waters & frosty icebergs',
    icon: '❄️',
    waterGradient: 'from-[#e0f2fe] via-[#38bdf8] to-[#0284c7]',
    ambientParticlesColor: '#ffffff',
    shoreType: 'abyss_rocks',
    deckBorderClass: 'from-[#f0f9ff] via-[#bae6fd] to-[#0284c7]',
    backgroundImage: '/game-assets/arctic-snow-bg.jpg',
    fishes: [
      { id: 'f_lantern', name: 'Polar Crystal Fish', species: 'lanternfish', points: 60, color: '#38bdf8' },
      { id: 'f_tang', name: 'Arctic Blue Tang', species: 'blue_tang', points: 80, color: '#60a5fa' },
      { id: 'f_angel', name: 'Glacier Angelfish', species: 'angelfish', points: 120, color: '#e0f2fe' },
    ],
    treasures: [
      { id: 't_glow_pearl', name: 'Frozen Crystal Pearl', type: 'glowing_pearl', points: 120 },
      { id: 't_potion', name: 'Ghost Frost Elixir', type: 'magic_potion', points: 150, grantsGhostMode: true },
      { id: 't_chest', name: 'Glacier Treasure Chest', type: 'gold_chest', points: 160 },
    ],
    obstacles: [
      { id: 'obs_abyss', name: 'Floating Iceberg Block', type: 'abyss_rock', width: 72, height: 60 },
      { id: 'obs_mine', name: 'Glacial Ice Spike', type: 'deep_mine', width: 60, height: 60 },
      { id: 'obs_seaweed', name: 'Frost Kelp Frond', type: 'seaweed', width: 60, height: 70 },
    ],
    hasShark: false,
    hasJellyfish: false,
  },

  sunken_treasure_zone: {
    id: 'sunken_treasure_zone',
    name: 'Sunken Treasure Zone',
    subtitle: 'Pirate galleon ruins & lost cursed gold',
    icon: '🏴‍☠️',
    waterGradient: 'from-[#0369a1] via-[#024e7a] to-[#012f4d]',
    ambientParticlesColor: '#fde047',
    shoreType: 'shipwreck_timbers',
    deckBorderClass: 'from-[#b45309] via-[#78350f] to-[#451a03]',
    backgroundImage: '/game-assets/swimming-pool-full-bg.png',
    fishes: [
      { id: 'f_snapper', name: 'Golden Snapper', species: 'golden_snapper', points: 50, color: '#f59e0b' },
      { id: 'f_clown', name: 'Pirate Clownfish', species: 'clownfish', points: 70, color: '#fb923c' },
      { id: 'f_angel', name: 'Royal Angelfish', species: 'angelfish', points: 110, color: '#eab308' },
    ],
    treasures: [
      { id: 't_chest', name: 'Pirate Treasure Chest', type: 'gold_chest', points: 150 },
      { id: 't_coins', name: 'Spanish Gold Doubloons', type: 'coin_sack', points: 100 },
      { id: 't_potion', name: 'Ghost Potion', type: 'magic_potion', points: 130, grantsGhostMode: true },
    ],
    obstacles: [
      { id: 'obs_log', name: 'Ship Mast Timber', type: 'ship_log', width: 110, height: 50 },
      { id: 'obs_anchor', name: 'Rusted Iron Anchor', type: 'rusted_anchor', width: 64, height: 64 },
      { id: 'obs_rock', name: 'Sunken Reef Boulder', type: 'reef_rock', width: 68, height: 56 },
    ],
    hasShark: false,
    hasJellyfish: false,
  },
}

/** 3 Distinct Playable Environments */
export const PLAYABLE_ENVIRONMENTS: EnvironmentId[] = [
  'swimming_pool',
  'deep_ocean',
  'sunken_treasure_zone',
]

/**
 * Returns default environment as Tropical Beach Shore
 */
export function getDefaultEnvironment(): EnvironmentConfig {
  return ENVIRONMENTS.swimming_pool
}

/**
 * Returns a random environment out of the 3 playable environments.
 * If excludeId is provided, picks one of the other 2 so consecutive rounds feel fresh!
 */
export function getRandomEnvironment(excludeId?: EnvironmentId): EnvironmentConfig {
  const pool = excludeId
    ? PLAYABLE_ENVIRONMENTS.filter((id) => id !== excludeId)
    : PLAYABLE_ENVIRONMENTS
  const randomId = pool[Math.floor(Math.random() * pool.length)]
  return ENVIRONMENTS[randomId] ?? ENVIRONMENTS.swimming_pool
}
