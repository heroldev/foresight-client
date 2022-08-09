import randomWords from "random-words";
import { Deck } from "../../types/Deck";
import { DeckFormat } from "../../types/Format";
import { generateId } from "../../util/generateId";

export const testEmptyDeck: Deck = {
  name: randomWords(),
  size: 0,
  format: DeckFormat.Unlimited,
  modified: new Date().toLocaleString(),
  creator: 'newUser',
  decklist: [],
  deckId: generateId(),
  cardCount: new Map()
}