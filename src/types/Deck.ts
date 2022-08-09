import { Card } from "./Card"
import { DeckFormat } from "./Format"

export interface Deck {
  name: string
  size: number
  format: DeckFormat
  modified: string
  creator: string
  decklist: Card[]
  deckId: string,
  cardCount: Map<string, number>
}