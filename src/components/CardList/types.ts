import { Card } from "../../types/Card";

export interface ICardListProps {
  deckList: Card[]
  cardCount: Map<string, number>
  onSelect: (value: Card) => void
}

export enum LegalityEnumStrings {
  NONE = "No reason!",
  DECK_LEGAL = "Deck fully legal!",
  NO_BASIC = "Missing Basic Pokemon!",
  ILLEGAL_IN_FORMAT = "Some of your cards are illegal in your deck's selected format!",
}