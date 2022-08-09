import React, { useEffect, useState } from 'react'
import "./CreateEditDeck.css"
import MainTile from "../../components/MainTile/MainTile"
import ForesightHeader from '../../components/SiteHeader/ForesightHeader'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'
import { INVALID_ID, loadPkmnDeck, savePkmnDeck, useStore } from '../../state/store'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import { ExpandLess, ExpandMore, Search } from '@mui/icons-material'
import CardView from '../../components/CardView/CardView'
import { CardTemplate } from '../../types/CardTemplate'
import CardList from '../../components/CardList/CardList'
import InvalidDeck from '../../components/InvalidDeck/InvalidDeck'
import Button from '@mui/material/Button'
import CardSearch from '../../components/CardSearch/CardSearch'
import { Card as TCGCard } from '../../types/Card'
import Card from '@mui/material/Card'
import { css } from '@emotion/css'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { loadingContainerStyle } from '../../components/CardSearchResultTable/CardSearchResultTable'
import CircularProgress from '@mui/material/CircularProgress'
import MediaPlayer from '../../components/MediaPlayer/MediaPlayer'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { DeckFormat } from '../../types/Format'

const editDeckDetailsForm = css`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`

const fadeSaveTextIn = css`
opacity:1;
/*transition: width 0.5s, height 0.5s, opacity 0.5s 0.5s;*/
`

const fadeSaveTextOut = css`
opacity:0;
transition: width 0.5s 0.5s, height 0.5s 0.5s, opacity 0.5s;
`

const CreateEditDeck = () => {

  // storage vars
  const { user } = useStore(state => ({ user: state.user }))
  const stateDeck = useStore(state => state.stateDeck)
  const updateDeckModified = useStore(state => state.updateDeckModified)
  // store methods for saving deck names and formats
  const updateDeckNameFormat = useStore(state => state.updateDeckNameFormat)

  const [saveDeckLoad, setSaveDeckLoad] = useState(false)

  const [showSaveText, setShowSaveText] = useState(false)
  const [saveTimer, setSaveTimer] = useState(0);
  const [saveTextClass, setSaveTextClass] = useState(fadeSaveTextIn)
  const [showDeckInfo, setShowDeckInfo] = useState(true)
  const [deckDetailsEdit, setDeckDetailsEdit] = useState(false)
  const [stateDeckName, setStateDeckName] = useState(stateDeck.name)
  const [stateDeckFormat, setStateDeckFormat] = useState(stateDeck.format)

  const [displayCard, setDisplayCard] = useState({
    id: 'foresight_card_filler_cardback',
    name: 'no card selected',
    supertype: 'Trainer',
    legalities: {
      unlimited: "Legal"
    },
    images: {
      large: '/pub_img/card/cardback.jpg'
    },
    set: {
      name: "Pokémon TCG",
      images: {
        symbol: "https://images.pokemontcg.io/base1/symbol.png"
      }
    }
  } as TCGCard)

  useEffect(() => {
    if (saveTimer === 0) {
      setSaveTextClass(fadeSaveTextOut)
      setShowSaveText(false)
      setSaveTimer(3)
    }

    // exit early when we reach 0
    if (!saveTimer) return;

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setSaveTimer(saveTimer - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add saveTimer as a dependency to re-rerun the effect
    // when we update it
  }, [saveTimer]);

  const handleSaveDeck = () => {
    if (deckDetailsEdit) {
      updateDeckNameFormat(stateDeckName, stateDeckFormat)
      setDeckDetailsEdit(false)
    }
    setSaveTextClass(fadeSaveTextIn)
    updateDeckModified(new Date().toLocaleString())
    savePkmnDeck()
  }

  const handleChangeStateDeckFormat = (event: SelectChangeEvent) => {
    setStateDeckFormat(event.target.value as DeckFormat);
  };

  return (
    <div className="main-view">
      <ForesightHeader userInfo={user} />
      {stateDeck.deckId === INVALID_ID ?
        <InvalidDeck /> :

        <div className="create-content-container">
          <div className="normal-search-container">
            <Box sx={{ m: 2 }}>
              <Card sx={{ backgroundColor: '#c4c4c4', borderRadius: '25px' }}>
                <CardContent>
                  <CardSearch onSelect={(card: TCGCard) => {
                    setDisplayCard(card)
                  }} />
                </CardContent>
              </Card>
            </Box>
          </div>
          <div className={"card-view-deck-container"}>
            <Box sx={{ m: 2 }}>
              <Card sx={{ backgroundColor: '#c4c4c4', borderRadius: '25px' }}>
                <CardContent>
                  <CardView card={displayCard} />
                </CardContent>
              </Card>
            </Box>

            <div className="card-search-deck-view-1800-1200">
              <Box sx={{ m: 2 }}>
                <Card sx={{ backgroundColor: '#c4c4c4', borderRadius: '25px' }}>
                  <CardContent>
                    <CardSearch onSelect={(card: TCGCard) => {
                      setDisplayCard(card)
                    }} />
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ m: 2 }}>
                <Card sx={{ backgroundColor: '#c4c4c4', borderRadius: '25px' }}>
                  <CardContent>
                    <Paper>
                      {saveDeckLoad
                        ? <div className={loadingContainerStyle}>
                          <CircularProgress />
                        </div>
                        : <Box>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                              {!deckDetailsEdit &&
                                <span className="customHeader">{stateDeck.name}</span>
                              }
                              {showDeckInfo && !deckDetailsEdit &&
                                <Tooltip title="Edit Deck Details" placement={'right'}>
                                  <IconButton onClick={() => setDeckDetailsEdit(true)}>
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                              }
                              {deckDetailsEdit &&
                                <div className={editDeckDetailsForm} style={{ marginTop: "16px" }}>
                                  <FormControl sx={{ ml: 2, mb: 1 }}>
                                    <TextField label="Deck Name" defaultValue={stateDeck.name} variant="outlined" onChange={(e) => setStateDeckName(e.target.value)} />
                                  </FormControl>
                                  <FormControl sx={{ ml: 1, mb: 1, minWidth: 120 }}>
                                    <InputLabel>Legality</InputLabel>
                                    <Select
                                      value={stateDeckFormat}
                                      label="Legality"
                                      onChange={handleChangeStateDeckFormat}
                                    >
                                      <MenuItem value={DeckFormat.Standard}>Standard</MenuItem>
                                      <MenuItem value={DeckFormat.Expanded}>Expanded</MenuItem>
                                      <MenuItem value={DeckFormat.Unlimited}>Unlimited</MenuItem>
                                    </Select>
                                  </FormControl>
                                </div>
                              }
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                              <span style={{ padding: "0px" }} className='customCaption'>Last saved: {stateDeck.modified}</span>
                              <div style={{ padding: "8px" }}>
                                <Tooltip title={showDeckInfo ? "Hide Deck Info" : "Show Deck Info"} placement={'top'}>
                                  <IconButton onClick={() => { setShowDeckInfo(!showDeckInfo); setDeckDetailsEdit(false) }}>
                                    {showDeckInfo ?
                                      <ExpandLess />
                                      : <ExpandMore />
                                    }
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </div>
                          </div>

                          <Box sx={{ mb: 2 }}>
                            {showDeckInfo &&
                              <CardList deckList={stateDeck.decklist} cardCount={stateDeck.cardCount} onSelect={(card: TCGCard) => { setDisplayCard(card) }} />
                            }
                          </Box>
                        </Box>
                      }
                      {/*
                      
                  */}
                    </Paper>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <Button variant="contained" style={{ backgroundColor: '#1C18E8', marginRight: "16px" }} onClick={handleSaveDeck} size={"medium"}>
                        Save Deck
                      </Button>
                      {/*
<Button variant="contained" style={{ marginRight: "16px" }} onClick={handleSaveDeck} size={"medium"}>
                        Draw Simulator
                      </Button>
                */}

                      <p className={saveTextClass + " customCaption"} style={{ padding: 0, margin: 0, userSelect: "none", color: "#1C18E8" }}><strong>{stateDeck.name} saved!</strong></p>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </div>
            <div className="normal-deck-container">
              <Box sx={{ m: 2 }}>
                <Card sx={{ backgroundColor: '#c4c4c4', borderRadius: '25px' }}>
                  <CardContent>
                    <Paper>
                      {saveDeckLoad
                        ? <div className={loadingContainerStyle}>
                          <CircularProgress />
                        </div>
                        : <Box>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                              {!deckDetailsEdit &&
                                <span className="customHeader">{stateDeck.name}</span>
                              }
                              {showDeckInfo && !deckDetailsEdit &&
                                <Tooltip title="Edit Deck Details" placement={'right'}>
                                  <IconButton onClick={() => setDeckDetailsEdit(true)}>
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                              }
                              {deckDetailsEdit &&
                                <div className={editDeckDetailsForm} style={{ marginTop: "16px" }}>
                                  <FormControl sx={{ ml: 2, mb: 1 }}>
                                    <TextField label="Deck Name" defaultValue={stateDeck.name} variant="outlined" onChange={(e) => setStateDeckName(e.target.value)} />
                                  </FormControl>
                                  <FormControl sx={{ ml: 1, mb: 1, minWidth: 120 }}>
                                    <InputLabel>Legality</InputLabel>
                                    <Select
                                      value={stateDeckFormat}
                                      label="Legality"
                                      onChange={handleChangeStateDeckFormat}
                                    >
                                      <MenuItem value={DeckFormat.Standard}>Standard</MenuItem>
                                      <MenuItem value={DeckFormat.Expanded}>Expanded</MenuItem>
                                      <MenuItem value={DeckFormat.Unlimited}>Unlimited</MenuItem>
                                    </Select>
                                  </FormControl>
                                </div>
                              }
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                              <span style={{ padding: "0px" }} className='customCaption'>Last saved: {stateDeck.modified}</span>
                              <div style={{ padding: "8px" }}>
                                <Tooltip title={showDeckInfo ? "Hide Deck Info" : "Show Deck Info"} placement={'top'}>
                                  <IconButton onClick={() => { setShowDeckInfo(!showDeckInfo); setDeckDetailsEdit(false) }}>
                                    {showDeckInfo ?
                                      <ExpandLess />
                                      : <ExpandMore />
                                    }
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                          <Box sx={{ mb: 2 }}>
                            {showDeckInfo &&
                              <CardList deckList={stateDeck.decklist} cardCount={stateDeck.cardCount} onSelect={(card: TCGCard) => { setDisplayCard(card) }} />
                            }
                          </Box>
                        </Box>
                      }
                      {/*
                      
                  */}
                    </Paper>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <Button variant="contained" style={{ backgroundColor: '#1C18E8', marginRight: "16px" }} onClick={handleSaveDeck} size={"medium"}>
                        Save Deck
                      </Button>
                      {/*
<Button variant="contained" style={{ marginRight: "16px" }} onClick={handleSaveDeck} size={"medium"}>
                        Draw Simulator
                      </Button>
                */}
                      <p className={saveTextClass + " customCaption"} style={{ padding: 0, margin: 0, userSelect: "none", color: "#1C18E8" }}><strong>{stateDeck.name} saved!</strong></p>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </div>

          </div>
        </div>
      }
    </div>
  )
}

export default CreateEditDeck