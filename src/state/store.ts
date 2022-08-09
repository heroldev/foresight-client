import create from 'zustand'
import produce, { enableAllPlugins } from "immer";
import User from '../types/User'
import { replacer, reviver } from './persistence'
import { Deck } from '../types/Deck';
import { Card } from '../types/Card';
import { DeckFormat } from '../types/Format';
import { generateId } from '../util/generateId';

enableAllPlugins();

export const INVALID_ID = "INVALID_ID"

export interface Store {
  // user account data (foresight_settings)
  user: User;

  // deck persistence (foresight_data)
  lastId: string

  // user account methods
  setUserData: (user: User) => void;
  clearUserData: () => void;
  setToken: () => void;
  clearToken: () => void;

  // decklist data (foresight_data)
  deckBox: {
    name: string,
    deckId: string,
    format: DeckFormat,
    size: number
    modified: Date
  }[]

  // deck methods
  createNewDeck: (newDeck: Deck) => void
  deleteDeck: (deckId: string) => void
  editDeck: (deckId: string) => void
  copyDeck: (deckId: string, newDeckId: string) => void
  addCardToDeck: (card: Card) => void
  removeCardFromDeck: (card: Card) => void
  updateDeckModified: (newDate: string) => void
  updateDeckNameFormat: (newName: string, newFormat: DeckFormat) => void

  // stateent loaded deck data
  stateDeck: {
    name: string
    size: number
    format: DeckFormat
    modified: string
    creator: string
    decklist: Card[]
    deckId: string
    cardCount: Map<string, number>
  }

}

export const useStore = create<Store>((set) => ({
  user: {
    screenName: "",
    profileIcon: "",
    createdDate: new Date()
  },
  lastId: "",
  deckBox: [],

  stateDeck: {
    name: "",
    size: 0,
    format: DeckFormat.Unlimited,
    modified: "",
    creator: "",
    decklist: [],
    deckId: INVALID_ID,
    cardCount: new Map()
  },

  setUserData: (newUser: User) => {
    set(
      produce((draft) => {
        draft.user = {
          screenName: newUser.screenName,
          profileIcon: newUser.profileIcon,
          createdDate: newUser.createdDate
        }
      })
    )

    queueMicrotask(saveSettings)
    queueMicrotask(saveData)
  },

  clearUserData: () => {
    set(
      produce((draft) => {
        draft.user = {
          screenName: "",
          createdDate: ""
        }
        draft.deckBox = []
      })
    )

    queueMicrotask(saveSettings)
    queueMicrotask(saveData)
    queueMicrotask(clearToken)
  },

  setToken: () => {
    queueMicrotask(saveToken)
  },

  clearToken: () => {
    queueMicrotask(clearToken)
  },

  createNewDeck: (newDeck: Deck) => {
    set(
      produce((draft) => {
        draft.deckBox.push({
          name: newDeck.name,
          deckId: newDeck.deckId,
          size: newDeck.decklist.length,
          format: newDeck.format,
          modified: newDeck.modified
        })

        draft.stateDeck = {
          name: newDeck.name,
          size: newDeck.size,
          format: newDeck.format,
          modified: newDeck.modified,
          creator: newDeck.creator,
          decklist: newDeck.decklist,
          deckId: newDeck.deckId,
          cardCount: newDeck.cardCount
        }
      })
    )
    queueMicrotask(saveData)
    queueMicrotask(savePkmnDeck)
  },

  editDeck: (deckId: string) => {
    set(
      produce((draft) => {
        draft.lastId = deckId
      })
    )
    queueMicrotask(saveData)
  },

  copyDeck: (deckId: string, newDeckId: string) => {
    set(
      produce((draft) => {
        let deckToCopy = draft.deckBox.find((deckItem: Deck) => deckItem.deckId === deckId)
        let newDate = new Date()
        let deckToCopyName = deckToCopy.name + " - Copy"

        draft.deckBox.forEach((deckItem: Deck) => {
          if (deckItem.name === deckToCopyName) {
            deckToCopyName = deckToCopyName + " - Copy"
          }
        })

        draft.deckBox.push({
          name: deckToCopyName,
          deckId: newDeckId,
          format: deckToCopy.format,
          size: deckToCopy.size,
          modified: newDate.toLocaleString()
        })

        const deckJson = localStorage.getItem(`PkmnDeck-${deckId}`)
        if (deckJson) {
          let { stateDeck } = JSON.parse(
            deckJson,
            reviver
          ) as Store;
          draft.stateDeck = {
            name: stateDeck.name + " - Copy",
            size: stateDeck.size,
            format: stateDeck.format,
            modified: newDate.toLocaleString(),
            creator: stateDeck.creator,
            decklist: stateDeck.decklist,
            deckId: newDeckId,
            cardCount: stateDeck.cardCount
          }
        }
      })
    )
    queueMicrotask(saveData)
    queueMicrotask(savePkmnDeck)
  },

  deleteDeck: (deckId: string) => {
    set(
      produce((draft) => {
        let deletedDeckIndex = draft.deckBox.findIndex((deck: Deck) => deck.deckId === deckId)
        draft.deckBox.splice(deletedDeckIndex, 1)
      })
    )
    queueMicrotask(saveData)
  },

  addCardToDeck: (card: Card) => {
    set(
      produce((draft) => {

        draft.stateDeck.decklist.push(card)
        if (draft.stateDeck.cardCount.has(card.id)) {
          let update = draft.stateDeck.cardCount.get(card.id)
          draft.stateDeck.cardCount.set(card.id, update + 1)
        } else {
          draft.stateDeck.cardCount.set(card.id, 1)
        }

        draft.stateDeck.size = draft.stateDeck.decklist.length

      })
    )
    queueMicrotask(saveData)
  },

  removeCardFromDeck: (card: Card) => {
    set(
      produce((draft) => {
        let deletedCardIndex = draft.stateDeck.decklist.findIndex((deckCard: Card) => deckCard.id === card.id)
        draft.stateDeck.decklist.splice(deletedCardIndex, 1)

        if (draft.stateDeck.cardCount.has(card.id) && draft.stateDeck.cardCount.get(card.id) > 1) {
          let update = draft.stateDeck.cardCount.get(card.id)
          draft.stateDeck.cardCount.set(card.id, update - 1)
        } else if (draft.stateDeck.cardCount.has(card.id) && draft.stateDeck.cardCount.get(card.id) == 1) {
          draft.stateDeck.cardCount.delete(card.id)
        } else {
          draft.stateDeck.cardCount.delete(card.id)
        }

        draft.stateDeck.size = draft.stateDeck.decklist.length

      })
    )
    queueMicrotask(saveData)
  },

  updateDeckModified: (newDate: string) => {
    set(
      produce((draft) => {
        draft.stateDeck.modified = newDate

        let deckToModify = draft.deckBox.findIndex((deck: Deck) => deck.deckId === draft.stateDeck.deckId)
        draft.deckBox[deckToModify].modified = newDate
        draft.deckBox[deckToModify].size = draft.stateDeck.decklist.length
      })
    )
    queueMicrotask(saveData)
  },

  updateDeckNameFormat: (newName: string, newFormat: DeckFormat) => {
    set(
      produce((draft) => {
        draft.stateDeck.name = newName
        draft.stateDeck.format = newFormat

        let deckToModify = draft.deckBox.findIndex((deck: Deck) => deck.deckId === draft.stateDeck.deckId)
        draft.deckBox[deckToModify].name = draft.stateDeck.name
        draft.deckBox[deckToModify].format = draft.stateDeck.format
      })
    )
    queueMicrotask(saveData)
  }

}))

export const getUser = (store: Store) => store.user;
export const getDeckBox = (store: Store) => store.deckBox
export const getDeckBoxLength = (store: Store) => store.deckBox.length
export const getstateDeck = (store: Store) => store.stateDeck
export const getState = () => useStore.getState();
export const select = <T>(selector: (store: Store) => T) => selector(getState());

export function saveSettings() {
  const { user } = getState();

  const settingsJson = JSON.stringify(
    { user },
    replacer
  );
  localStorage.setItem("foresight_settings", settingsJson);
}

export function saveData() {
  const { deckBox, lastId } = getState();

  const deckBoxJson = JSON.stringify(
    { deckBox, lastId },
    replacer
  );
  localStorage.setItem("foresight_data", deckBoxJson);
}

export function saveToken() {
  localStorage.setItem("token", "08012025")
}

export function clearToken() {
  localStorage.removeItem("token")
}

export function load() {
  const settingsJson = localStorage.getItem("foresight_settings");
  const dataJson = localStorage.getItem("foresight_data");

  if (settingsJson && dataJson) {
    const { user } = JSON.parse(
      settingsJson,
      reviver
    ) as Store;
    const { deckBox, lastId } = JSON.parse(
      dataJson,
      reviver
    )
    useStore.setState({
      ...getState(),
      user,
      deckBox,
      lastId
    });
    loadPkmnDeck(lastId)
    queueMicrotask(saveSettings);
  }

}

export function savePkmnDeck() {
  const { stateDeck } = getState()

  const json = JSON.stringify(
    { stateDeck },
    replacer
  );

  localStorage.setItem(`PkmnDeck-${stateDeck.deckId}`, json);
  queueMicrotask(saveData);
}

export function deletePkmnDeck(deckId: string) {
  localStorage.removeItem(`PkmnDeck-${deckId}`)
}

export function loadPkmnDeck(deckId: string) {
  const deckJson = localStorage.getItem(`PkmnDeck-${deckId}`)
  if (deckJson) {
    const { stateDeck } = JSON.parse(
      deckJson,
      reviver
    ) as Store;
    useStore.setState({
      ...getState(),
      stateDeck
    });
    queueMicrotask(saveData);
  }
}

if (typeof window === "object") {
  (window as any).getState = () => useStore.getState();
  (window as any).load = load;
}

