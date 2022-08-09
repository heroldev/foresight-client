export interface Card {
  id: string
  name: string
  supertype: string
  subtypes?: string[]
  level?: string
  hp?: string
  types?: string[]
  evolvesFrom?: string
  evolvesTo?: string
  rules?: string[]
  ancientTrait?: AncientTrait
  abilities?: Ability[]
  attacks?: Attack[]
  weaknesses?: Weakness[]
  resistances?: Resistance[]
  retreatCost?: string[]
  convertedRetreatCost?: number
  number?: string
  artist?: string
  rarity?: string
  flavorText?: string
  natDexNumber?: number[]
  legalities: Legality
  regulationMark?: string
  images: Images
  set?: TCGSet
}

export interface Ability {
  name: string
  text: string
  type: string
}

export interface AncientTrait {
  name: string
  text: string
}

export interface Attack {
  cost: string[]
  name: string
  text: string
  damage: string
  convertedEnergyCost: number
}

export interface Weakness {
  value: string
  type: string
}

export interface Resistance {
  value: string
  type: string
}

export interface Legality {
  standard?: string
  unlimited: string
  expanded?: string
}

export interface Images {
  small?: string
  large: string
}

export interface TCGSet {
  id: string
  name: string
  series: string
  printedTotal: number
  total: number
  legalities: Legality
  ptcgoCode: string
  releaseDate: string
  updatedAt: string
  images: setImages
}

export interface setImages {
  symbol: string
  logo: string
}

export enum SuperTypes {
  Pokemon = "Pokémon",
  Trainer = "Trainer",
  Energy = "Energy"
}