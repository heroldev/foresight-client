import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Card, SuperTypes } from '../../types/Card';
import { CardTemplate } from '../../types/CardTemplate';
import { useStore } from '../../state/store';
import { ICardListProps, LegalityEnumStrings } from './types';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { AddCircle, HighlightOff, RemoveCircle } from '@mui/icons-material';
import { css } from '@emotion/css';
import TableFooter from '@mui/material/TableFooter';
import { checkCardAmountInDeck } from '../../util/checkCardAmountInDeck';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Icon from '@mui/material/Icon';
import { DeckFormat } from '../../types/Format';

const cardListActionsStyle = css`
display: flex;
align-content: center;
align-items: center;
width: 100%;
flex-direction: row;
justify-content: flex-end;
`

export default function CardList(props: ICardListProps) {

  const { deckList, cardCount, onSelect } = props;

  const addCardToDeck = useStore(state => state.addCardToDeck)
  const removeCardFromDeck = useStore(state => state.removeCardFromDeck)
  const stateDeck = useStore(state => state.stateDeck)

  const [legalityReason, setLegalityReason] = useState(LegalityEnumStrings.NONE)

  const handleAddCard = (card: Card) => {
    addCardToDeck(card)
  }

  const handleRemoveCard = (card: Card) => {
    removeCardFromDeck(card)
  }

  const disableAddCard = (card: Card): boolean => {

    return checkCardAmountInDeck(card, stateDeck)

  }

  let cardSuperTypeCount = {
    energy: 0,
    pokemon: 0,
    trainer: 0
  }

  const rows = deckList as Card[];

  interface tableObject {
    name: string,
    type: string,
    symbol: string,
    amount: number | undefined,
    id: string,
    card: Card
  }

  const generateTableData = (): tableObject[] => {

    //itertate for dupes lmao, set no worky
    let cardsIterated: string[] = []
    let uniqueCardsInDeck: Card[] = []

    let pokemonCount = 0
    let energyCount = 0
    let trainerCount = 0

    deckList.forEach(card => {
      if (cardsIterated.indexOf(card.id) === -1) {
        uniqueCardsInDeck.push(card)
        cardsIterated.push(card.id)
      }

      switch (card.supertype) {
        case SuperTypes.Pokemon:
          pokemonCount += 1
          break;
        case SuperTypes.Energy:
          energyCount += 1
          break;
        case SuperTypes.Trainer:
          trainerCount += 1
          break;
        default:
          //this should never happen
          break;
      }

    })

    cardSuperTypeCount = {
      pokemon: pokemonCount,
      energy: energyCount,
      trainer: trainerCount,
    }

    let tableItems: tableObject[] = []

    uniqueCardsInDeck.forEach(card => tableItems.push({
      name: card.name,
      type: card.supertype,
      symbol: card.set?.images.symbol,
      amount: cardCount.get(card.id),
      id: card.id,
      card: card
    } as tableObject
    ))

    return tableItems
  }

  const handleCardClick = (card: Card) => {
    onSelect(card)
  }

  const checkDeckLegality = (): boolean => {
    // comment out this first condition
    /*
    if (stateDeck.decklist.length !== 60) {
      return false
    }
    */

    //  check if deck has at least a singular basic pokemon
    let deckHasBasicPokemon = false
    let checkForBasics = stateDeck.decklist.filter(card =>
      card.subtypes?.includes("Basic")
    )

    if (checkForBasics.length >= 1) {
      deckHasBasicPokemon = true
    }

    if (deckHasBasicPokemon) {
      switch (stateDeck.format) {
        case DeckFormat.Unlimited:
          // all cards legal in unlimited
          
          return true
        case DeckFormat.Expanded:
          let expandedLegal = stateDeck.decklist.filter((card) => {
            if (card.legalities.expanded)
              return card
          })
          if (expandedLegal.length !== stateDeck.decklist.length) {
            
            return false
          } else {
            
            return true
          }
        case DeckFormat.Standard:
          let standardLegal = stateDeck.decklist.filter((card) => {
            if (card.legalities.standard)
              return card
          })
          if (standardLegal.length !== stateDeck.decklist.length) {
            
            return false
          } else {
            
            return true
          }
        default:
          return false

      }
    } else {
      return false
    }
  }

  return (
    <Box>
      <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 600, overflowX: "hidden" }}>
        <Table stickyHeader sx={{ minWidth: 650 }} size="small">

          <TableHead>
            <TableRow>
              <TableCell>Card Name</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">Set</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {generateTableData().map((object, index) => (
              <TableRow
                hover
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                onClick={() => handleCardClick(object.card)}
              >
                <TableCell component="th" scope="row">
                  {object.name}
                </TableCell>
                <TableCell align="right">{object.type}</TableCell>
                <TableCell align="right">
                  <Tooltip title={object.card.set?.name || ''} placement='right'>
                    <img src={object.symbol} alt="Symbol" height="20" ></img>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">{object.amount}</TableCell>
                <TableCell align="right">
                  <Box className={cardListActionsStyle} sx={{}}>
                    <Tooltip title="Remove from Deck" placement='top'>
                      <div>
                        <IconButton id="deck-remove" sx={{ color: "#EF0000", p: 0 }} onClick={() => handleRemoveCard(object.card)}>
                          <RemoveCircle />
                        </IconButton>
                      </div>
                    </Tooltip>
                    <Box sx={{ pl: 1 }}>

                    </Box>
                    <Tooltip title="Add to Deck" placement='top'>
                      <div>
                        <IconButton id="deck-add" sx={{ color: "#00EF35", p: 0 }} disabled={disableAddCard(object.card)} onClick={() => handleAddCard(object.card)}>
                          <AddCircle />
                        </IconButton>
                      </div>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {deckList.length === 0 ?
          <span className="customCaption">No cards in deck.</span>
          : deckList.length === 1 ?
            <span className="customCaption">{deckList.length + " card in deck. It is a(n) " + deckList[0].supertype + " card."}</span>
            : <span className="customCaption">{deckList.length + " cards in deck. Of those, " + cardSuperTypeCount.pokemon + " are Pokémon, " + cardSuperTypeCount.trainer + " are Trainer cards, and " + cardSuperTypeCount.energy + " are Energy cards."}</span>
        }
        {checkDeckLegality() ?
          <Tooltip title={"Legal in " + stateDeck.format + "!"} placement='left'>
            <div>
              <Icon id="deck-verified" sx={{ color: "#00EF35", p: 1, pr: 2 }}>
                <CheckCircleIcon />
              </Icon>
            </div>
          </Tooltip>
          :
          <Tooltip title={"Not legal in " + stateDeck.format + "!"} placement='bottom'>
            <div>
              <Icon id="deck-verified" sx={{ color: "#EF0000", p: 1, pr: 2 }}>
                <HighlightOff />
              </Icon>
            </div>
          </Tooltip>
        }
      </div>
    </Box>
  );
}