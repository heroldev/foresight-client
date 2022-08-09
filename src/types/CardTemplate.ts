import { Ability, Attack, Card, Images, Legality, Resistance, setImages, TCGSet, Weakness } from "./Card"

export const CardTemplate = {
  id: "swshp-SWSH018",
  name: "Zacian V",
  supertype: "Pokémon",
  subtypes: ["Basic", "V"],
  hp: "220",
  types: ["Metal"],
  rules: ["V rule: When your Pokémon V is Knocked Out, your opponent takes 2 Prize cards."],
  abilities: [
    {
      name: "Intrepid Sword",
      text: "Once during your turn, you may look at the top 3 cards of your deck and attach any number of Metal Energy cards you find there to this Pokémon. Put the other cards into your hand. If you use this Ability, your turn ends.",
      type: "Ability"
    } as Ability
  ],
  attacks: [

    {
      name: "Brave Blade",
      cost: ["Metal", "Metal", "Metal"],
      convertedEnergyCost: 3,
      damage: "230",
      text: "During your next turn, this Pokémon can't attack."
    } as Attack

  ],
  weaknesses: [

    {
      type: "Fire",
      value: "×2"
    } as Weakness

  ],
  resistances: [

    {
      type: "Grass",
      value: "-30"
    } as Resistance

  ],
  retreatCost: ["Colorless", "Colorless"],
  convertedRetreatCost: 2,
  number: "SWSH018",
  artist: "5ban Graphics",
  rarity: "Promo",
  natDexNumber: [888],
  legalities: {
    unlimited: "Legal",
    standard: "Legal",
    expanded: "Legal"
  } as Legality,
  regulationMark: "D",
  images: {
    small: "https://images.pokemontcg.io/swshp/SWSH018.png",
    large: "https://images.pokemontcg.io/swshp/SWSH018_hires.png"
  } as Images,
  set: {
    id: "swshp",
    name: "SWSH Black Star Promos",
    series: "Sword & Shield",
    printedTotal: 184,
    total: 181,
    legalities: {
      standard: "Legal",
      unlimited: "Legal",
      expanded: "Legal"
    } as Legality,
    ptcgoCode: "PR-SW",
    releaseDate: "2019/11/15",
    updatedAt: "2021/12/15 14:46:00",
    images: {
      logo: "https://images.pokemontcg.io/swshp/logo.png",
      symbol: "https://images.pokemontcg.io/swshp/symbol.png",
    } as setImages
  } as TCGSet
} as Card