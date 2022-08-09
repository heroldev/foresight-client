import { useStore } from "../state/store";
import { Card } from "../types/Card";
import { Deck } from "../types/Deck";

export const checkCardAmountInDeck = (card: Card, stateDeck: Deck): boolean => {

  //TODO: code in limits for Shiny Star (card ID pop5-17) and other oddball restrictions, fix undefined issue inherent with maps

  if (card.supertype === "Energy") {
    return false
  }

  if (card.id === "foresight_card_filler_cardback") {
    return true
  } else if (stateDeck.cardCount.get(card.id) >= 4 && card.supertype !== "Energy" ) {
    return true
  } else if (stateDeck.cardCount.get(card.id) >= 4 ) {
    // Special Energy rule: cannot have more than 4
    return true
  } else {
    return false
  }

}