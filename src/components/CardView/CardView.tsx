import { AddCircle, ExpandLess, ExpandMore, RemoveCircle } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { Ability, Attack, Card, Resistance, SuperTypes, Weakness } from '../../types/Card'
import { ICardViewProps } from './types'
import "../../bootstrap/global.css"
import { css } from '@emotion/css'
import { useStore } from '../../state/store'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import { checkCardAmountInDeck } from '../../util/checkCardAmountInDeck'
import PulseDot from 'react-pulse-dot'
import CardActionArea from '@mui/material/CardActionArea'

const topCardControlsStyle = css`
display: flex;
align-content: center;
align-items: center;
flex-direction: row;
justify-content: flex-end;
`

const bottomCardControlsStyle = css`
display: flex;
align-content: center;
align-items: center;
flex-direction: row;
justify-content: flex-end;
`

const topCardControls = css`
display: flex;
justify-content: space-between;
align-content: center;
align-items: center;
`

const bottomCardHeaderControls = css`
display: flex;
align-content: center;
align-items: center;
justify-content: space-between;
`

const CardView = (props: ICardViewProps) => {

  const { card } = props

  const addCardToDeck = useStore(state => state.addCardToDeck)
  const removeCardFromDeck = useStore(state => state.removeCardFromDeck)
  const stateDeck = useStore(state => state.stateDeck)

  const [showCardView, setShowCardView] = useState(true)
  const [showRules, setShowRules] = useState(false)
  const [showAttacks, setShowAttacks] = useState(false)

  const hideCardRules = () => { setShowRules(false) }
  const showCardRules = () => { setShowRules(true) }

  const handleAddCard = (card: Card) => {
    addCardToDeck(card)
  }

  const handleRemoveCard = (card: Card) => {
    removeCardFromDeck(card)
  }

  const disableAddCard = (): boolean => {

    return checkCardAmountInDeck(card, stateDeck)

  }

  const disableRemoveCard = (): boolean => {
    if (stateDeck.cardCount.get(card.id)! <= 0 || stateDeck.cardCount.get(card.id) == undefined) {
      return true
    } else {
      return false
    }
  }

  const parseAbilities = (abilities: Ability[]) => {
    if (typeof (abilities) !== "undefined") {
      abilities.forEach((ability) => {
        return (
          <Box>
            <Typography gutterBottom variant="subtitle1" component="div">
              {ability.name}
            </Typography>
            <Typography gutterBottom variant="body1" component="div">
              {ability.text}
            </Typography>
          </Box>
        )
      })
    }
  }

  const handleShowCardView = () => {
    setShowCardView(!showCardView)
    setShowAttacks(!showAttacks)
  }

  const generateShownTypes = (card: Card) => {
    return
  }

  const parseAttacks = (attacks: Attack[]) => {

  }

  return (
    <Box sx={{}}>
      <Paper sx={{ width: '100%', borderRadius: '20px' }}>
        <Box sx={{ pl: 2, pr: 2 }}>
          <Box className={topCardControls}>
            <Typography
              sx={{ width: '350px', whiteSpace: "nowrap", overflow: 'hidden' }}
              variant="h6"
              textOverflow={'ellipsis'}
            >
              {card.name}
            </Typography>
            <Box className={topCardControlsStyle}>


              <Tooltip title={showCardView ? "Hide Card Preview" : "Show Card Preview"} placement={'top'}>
                <IconButton onClick={handleShowCardView}>
                  {showCardView ?
                    <ExpandLess />
                    : <ExpandMore />
                  }
                </IconButton>
              </Tooltip>

            </Box>
          </Box>
          {showCardView &&
            <CardMedia
              component="img"
              height="550"
              image={card.images.large}
              sx={{pb: 2}}
              alt={card.name}
            />
          }
        </Box>
      </Paper>


      <CardContent sx={{ pb: 0 }}>
        <Box className={bottomCardHeaderControls}>
          {/*
          <Typography
            sx={{ width: '275px', whiteSpace: "nowrap", overflow: 'hidden' }}
            variant="h6"
            textOverflow={'ellipsis'}
          >
            {card.name}
          </Typography>
*/}
          {card.supertype === SuperTypes.Pokemon ?
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", }}>
                <Typography variant="h6" component="div" sx={{ pr: 1 }}>
                  {"Retreat Cost: " + (card.retreatCost ? "" : "free")}
                </Typography>
                {card.retreatCost &&
                  card.retreatCost?.map((type, index) => {
                    return (
                      <img style={{ paddingRight: "8px" }} src={"/pub_img/card/types/colorless_tcg.png"} alt={"colorless"} height="24px" ></img>
                    )
                  })
                }
              </div>
            </div>
            : <div>
              <Typography variant="h6" component="div">
                {card.subtypes?.join(' · ')}
              </Typography>
            </div>

          }
          <Box className={bottomCardControlsStyle}>
            <Tooltip title={card.set?.name || ""} placement='bottom'>
              <img style={{ padding: "8px" }} src={card.set?.images.symbol} alt="Symbol" height="20" ></img>
            </Tooltip>
            <Tooltip title="Remove from Deck" placement='bottom'>
              <div>
                <IconButton sx={{ color: "#EF0000" }} disabled={disableRemoveCard()} onClick={() => handleRemoveCard(card)}>
                  <RemoveCircle />
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip title="Add to Deck" placement='bottom'>
              <div>
                <IconButton sx={{ color: "#00EF35" }} disabled={disableAddCard()} onClick={() => handleAddCard(card)}>
                  <AddCircle />
                </IconButton>
              </div>
            </Tooltip>
          </Box>
        </Box>
        {card.id !== 'foresight_card_filler_cardback' &&
          <Box>
            {card.supertype === SuperTypes.Pokemon ?
              <Box>
                {card.supertype === SuperTypes.Pokemon &&
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      {
                        card.types?.map((type, index) => {
                          return (
                            <Tooltip title={type} placement='top' key={index}>
                              <img style={{ paddingRight: "8px" }} src={"/pub_img/card/types/" + type.toLowerCase() + "_tcg.png"} alt={type} height="24px" ></img>
                            </Tooltip>
                          )
                        })
                      }
                      <Typography gutterBottom variant="body1" component="div" sx={{ pb: 1 }}>
                        {card.subtypes?.join(' · ') + ' · ' + card.hp + "HP"}
                      </Typography>
                    </div>
                  </div>
                }
                <Paper sx={{ maxWidth: "400px" }}>
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Typography
                      sx={{ p: 2, flex: '1 1 100%' }}
                      variant="h6"
                      component="div"
                    >
                      Abilities & Attacks
                    </Typography>

                    <div style={{ padding: "8px" }}>
                      <IconButton onClick={() => { setShowAttacks(!showAttacks); setShowCardView(!showCardView) }}>
                        {showAttacks ?
                          <ExpandLess />
                          : <ExpandMore />
                        }
                      </IconButton>
                    </div>

                  </div>
                  {showAttacks &&
                    <Box>
                      {
                        card.abilities?.map((ability: Ability, index) => {
                          return (
                            <div key={ability.name} >
                              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <Box sx={{ pl: 2, display: "flex" }}>
                                  <Tooltip title={ability.type} placement='top' key={index}>
                                    <img style={{ paddingRight: "8px" }} src={"/pub_img/card/ability.png"} alt={ability.type} height="24px" ></img>
                                  </Tooltip>
                                  <Typography variant="body1" style={{ fontWeight: 700, color: "#9f191d" }} component="div" sx={{ pl: 1, pr: 2, pb: 1 }}>
                                    {ability.name}
                                  </Typography>
                                </Box>
                              </div>
                              <div key={ability.text}>
                                <Typography variant="body1" component="div" maxWidth={"360px"} sx={{ pl: 2, pr: 2, pb: 2 }}>
                                  {ability.text}
                                </Typography>
                              </div>
                            </div>

                          )
                        })
                      }
                      {
                        card.attacks?.map((attack: Attack, index) => {
                          return (
                            <div key={attack.name} >
                              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <Box sx={{ pl: 2, display: "flex" }}>
                                  {
                                    attack.cost?.map((type, index) => {
                                      return (
                                        <Tooltip title={type} placement='top' key={index}>
                                          <img style={{ paddingRight: "8px" }} src={"/pub_img/card/types/" + type.toLowerCase() + "_tcg.png"} alt={type} height="24px" ></img>
                                        </Tooltip>
                                      )
                                    })
                                  }
                                  <Typography variant="body1" style={{ fontWeight: 700 }} component="div" sx={{ pl: 1, pr: 2, pb: 1 }}>
                                    {attack.name}
                                  </Typography>
                                </Box>

                                <Typography variant="body1" style={{ fontWeight: 700 }} component="div" sx={{ pl: 2, pr: 2, pb: 1 }}>
                                  {attack.damage}
                                </Typography>
                              </div>
                              <div key={attack.text}>
                                <Typography variant="body1" component="div" maxWidth={"360px"} sx={{ pl: 2, pr: 2, pb: 2 }}>
                                  {attack.text}
                                </Typography>
                              </div>
                            </div>

                          )
                        })
                      }
                    </Box>
                  }


                </Paper>
                {showAttacks &&
                  <div style={{ display: "flex", flexDirection: "row", paddingTop: "12px", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <Typography variant="body1" style={{ fontWeight: 700 }} component="div" sx={{ pr: 1 }}>
                        {"Weakness: "}
                      </Typography>
                      {
                        card.weaknesses?.map((weakness: Weakness, index) => {
                          return (
                            <div style={{ display: "flex", flexDirection: "row" }}>
                              <Tooltip title={weakness.type} placement='top' key={index}>
                                <img style={{ paddingRight: "8px" }} src={"/pub_img/card/types/" + weakness.type.toLowerCase() + "_tcg.png"} alt={weakness.type} height="24px" ></img>
                              </Tooltip>
                              <Typography gutterBottom variant="body1" component="div" sx={{ pb: 1 }}>
                                {weakness.value}
                              </Typography>
                            </div>

                          )
                        })
                      }
                    </div>
                    <div>
                      {card.resistances &&
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <Typography variant="body1" style={{ fontWeight: 700 }} component="div" sx={{ pr: 1 }}>
                            {"Resistance: "}
                          </Typography>
                          {
                            card.resistances?.map((resistance: Resistance, index) => {
                              return (
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                  <Tooltip title={resistance.type} placement='top' key={index}>
                                    <img style={{ paddingRight: "8px" }} src={"/pub_img/card/types/" + resistance.type.toLowerCase() + "_tcg.png"} alt={resistance.type} height="24px" ></img>
                                  </Tooltip>
                                  <Typography gutterBottom variant="body1" component="div" sx={{ pb: 1 }}>
                                    {resistance.value}
                                  </Typography>
                                </div>

                              )
                            })
                          }
                        </div>
                      }
                    </div>

                  </div>
                }
              </Box>
              : (card.subtypes?.includes("Special") || card.supertype === SuperTypes.Trainer) &&
              <Box sx={{ pt: 1 }}>
                <Paper sx={{ maxWidth: "400px" }}>
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Typography
                      sx={{ p: 2, flex: '1 1 100%' }}
                      variant="h6"
                      component="div"
                    >
                      Card Text
                    </Typography>

                    <div style={{ padding: "8px" }}>
                      <IconButton onClick={() => { setShowAttacks(!showAttacks); setShowCardView(!showCardView) }}>
                        {showAttacks ?
                          <ExpandLess />
                          : <ExpandMore />
                        }
                      </IconButton>
                    </div>

                  </div>
                  {showAttacks &&
                    <Box>
                      {
                        card.rules?.map((rule, index) => {
                          return (
                            <Typography variant="body1" component="div" maxWidth={"380px"} sx={{ pl: 2, pr: 2, pb: 2 }} key={index}>
                              {rule}
                            </Typography>
                          )
                        })
                      }
                    </Box>
                  }
                </Paper>
              </Box>
            }
            {/*
          <Box>
            {card.supertype === SuperTypes.Pokemon ?
              <div style={{ display: "flex", flexDirection: "row" }}>
                {
                  card.types?.map((type, index) => {
                    return (
                      <Tooltip title={type} placement='top' key={index}>
                        <img style={{ paddingRight: "8px" }} src={"/pub_img/card/types/" + type.toLowerCase() + "_tcg.png"} alt={type} height="24px" ></img>
                      </Tooltip>
                    )
                  })
                }
                <Typography gutterBottom variant="body1" component="div">
                  {card.subtypes?.join(' · ') + ' · ' + card.hp + "HP"}
                </Typography>
              </div>
              : card.supertype === SuperTypes.Energy &&
              <div>
                <Typography variant="body1" component="div">
                  {card.subtypes?.join(' · ')}
                </Typography>
              </div>
            }
            <Box>
              {
                card.rules?.map((rule, index) => {
                  return (
                    <Typography gutterBottom variant="body1" component="div" maxWidth={"380px"} key={index}>
                      {rule}
                    </Typography>
                  )
                })
              }
            </Box>
          </Box>
        */}
          </Box>
        }

      </CardContent>

    </Box>
  )

}

export default CardView