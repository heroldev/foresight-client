import React, { useEffect, useRef, useState } from 'react'

import pokemon from 'pokemontcgsdk'
import { Card, TCGSet } from '../../types/Card'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import CardList from '../CardList/CardList'
import CardSearchResultTable from '../CardSearchResultTable/CardSearchResultTable'
import { ICardSearchProps } from './types'
import TextField from '@mui/material/TextField'
import { css } from '@emotion/css'
import "../../bootstrap/global.css"
import { useStore } from '../../state/store'
import { DeckFormat } from '../../types/Format'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { ExpandCircleDown, ExpandMore, ExpandLess } from '@mui/icons-material'
import Switch from '@mui/material/Switch'

const searchFormSimple = css`
  display: flex;
  align-items: center;
  margin-bottom: 8px;

`

const searchFormPower = css`
  display: flex;
  align-items: center;
  margin-bottom: 8px;

`

const CardSearch = (props: ICardSearchProps) => {

  const { onSelect } = props;

  const stateDeck = useStore(state => state.stateDeck)

  pokemon.configure({ apiKey: import.meta.env.VITE_TCG_API })

  let queryResult: Card[] = []

  const [loading, setLoading] = useState(false)
  const [legality, setLegality] = useState(stateDeck.format)
  const [selectedExpansion, setSelectedExpansion] = useState('')
  const [expansions, setExpansions] = useState<Array<TCGSet>>([])
  const [displayResult, setDisplayResult] = useState<Array<Card>>([])
  const [cardNameQuery, setCardNameQuery] = useState('')
  const [cardQueryResultText, setCardQueryResultText] = useState('A query has not been run.')
  const [showSearchWindow, setShowSearchWindow] = useState(true)

  // false == simple, true == power
  const [searchMode, setSearchMode] = useState(false)

  useEffect(() => {
    pokemon.set.all()
      .then((sets: TCGSet[]) => {
        setExpansions(sets)
      })
  }, []);

  const simpleCardNameInput = useRef({ value: '' })

  const handleChangeLegality = (event: SelectChangeEvent) => {
    setLegality(event.target.value as DeckFormat);
  };

  const handleChangeExpansion = (event: SelectChangeEvent) => {
    setSelectedExpansion(event.target.value);
  };

  const disableSimpleQuery = (): boolean => {
    if (cardNameQuery === '' || cardNameQuery === '*' || !showSearchWindow) {
      return true
    } else {
      return false
    }
  }

  const disablePowerQuery = (): boolean => {
    if (cardNameQuery === '' || cardNameQuery === '*' || selectedExpansion === '' || !showSearchWindow) {
      return true
    } else {
      return false
    }
  }

  const runSimpleQuery = () => {
    setDisplayResult([])
    pokemon.card.all({ q: 'name:' + "\"" + cardNameQuery + "*\" legalities." + legality.toLowerCase() + ":legal", orderBy: "-set.releaseDate" }).then(setLoading(true))
      .then((result: Card[]) => {

        let cardsFound = false;

        if (result === undefined || result.length === 0) {
          setCardQueryResultText("No cards found.")
        } else {
          cardsFound = true;
          result.forEach(card => queryResult.push(card))
        }

        return cardsFound

      }).then((cardsFound: boolean) => {
        if (cardsFound) {
          if (queryResult.length === 1) {
            setCardQueryResultText(queryResult.length + " card found.")
          } else {
            setCardQueryResultText(queryResult.length + " cards found.")
          }
          setDisplayResult(queryResult)
        }
        setLoading(false)

      })
  }

  const runPowerQuery = () => {
    setDisplayResult([])
    pokemon.card.all({ q: 'name:' + "\"" + cardNameQuery + "*\" legalities." + legality.toLowerCase() + ":legal" + " set.id:" + selectedExpansion, orderBy: "-set.releaseDate" }).then(setLoading(true))
      .then((result: Card[]) => {

        let cardsFound = false;

        if (result === undefined || result.length === 0) {
          setCardQueryResultText("No cards found.")
        } else {
          cardsFound = true;
          result.forEach(card => queryResult.push(card))
        }

        return cardsFound

      }).then((cardsFound: boolean) => {
        if (cardsFound) {
          if (queryResult.length === 1) {
            setCardQueryResultText(queryResult.length + " card found.")
          } else {
            setCardQueryResultText(queryResult.length + " cards found.")
          }
          setDisplayResult(queryResult)
        }
        setLoading(false)

      })
  }

  const clearQuery = () => {
    setCardNameQuery('')
    setCardQueryResultText("Query cleared.")
    setDisplayResult([])
    simpleCardNameInput.current.value = ''
  }

  return (
    <Box>
      <Paper sx={{ mb: 2, minWidth: 600, maxWidth: 650 }}>
        <Box>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <Typography
              sx={{ p: 2, flex: '1 1 100%' }}
              variant="h6"
              component="div"
            >
              Card Lookup
            </Typography>
            <Tooltip title={searchMode ? "Advanced Search" : "Simple Search"} placement={'left'}>
              <Switch onChange={() => { setSearchMode(!searchMode); clearQuery() }} />
            </Tooltip>
            <div style={{ padding: "8px" }}>
              <Tooltip title={showSearchWindow ? "Hide Card Lookup" : "Show Card Lookup"} placement={'top'}>
                <IconButton onClick={() => { setShowSearchWindow(!showSearchWindow) }}>
                  {showSearchWindow ?
                    <ExpandLess />
                    : <ExpandMore />
                  }
                </IconButton>
              </Tooltip>
            </div>
          </div>
          {showSearchWindow &&
            <div>
              <div className={searchFormSimple}>
                <FormControl sx={{ ml: 2, mb: 1 }}>
                  <TextField label="Card Name" inputRef={simpleCardNameInput} variant="outlined" onChange={(e) => setCardNameQuery(e.target.value)}
                    onKeyPress={(ev) => {
                      if (ev.key === 'Enter' && cardNameQuery !== '') {
                        runSimpleQuery()
                        ev.preventDefault();
                      }
                    }}
                  />
                </FormControl>
                <FormControl sx={{ ml: 1, mb: 1, minWidth: 120 }}>
                  <InputLabel>Legality</InputLabel>
                  <Select
                    value={legality}
                    label="Legality"
                    onChange={handleChangeLegality}
                  >
                    <MenuItem value={DeckFormat.Standard}>Standard</MenuItem>
                    <MenuItem value={DeckFormat.Expanded}>Expanded</MenuItem>
                    <MenuItem value={DeckFormat.Unlimited}>Unlimited</MenuItem>
                  </Select>
                </FormControl>
                <span className="customCaption" style={{ marginBottom: "8px" }}>{loading ? "Running query..." : cardQueryResultText}</span>
              </div>
              {searchMode &&
                <Box className={searchFormPower}>
                  <FormControl sx={{ ml: 2, mb: 1, minWidth: 120 }}>
                    <InputLabel>Expansion</InputLabel>
                    <Select
                      value={selectedExpansion}
                      label="Expansion"
                      onChange={handleChangeExpansion}
                    >
                      {expansions.map(expansion => {
                        return (
                          <MenuItem key={expansion.id} value={expansion.id}>{expansion.name}</MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                  <span className="customCaption" style={{ marginBottom: "8px" }}>{"More search fields coming soon!"}</span>
                </Box>
              }
            </div>
          }
          {showSearchWindow &&
            <CardSearchResultTable loading={loading} resultList={displayResult} onSelect={(card: Card) => onSelect(card)} />
          }
        </Box>
      </Paper>
      <Box>
        <Button variant="contained" style={{ backgroundColor: '#1C18E8', marginRight: "16px" }} disabled={searchMode ? disablePowerQuery() : disableSimpleQuery()} onClick={searchMode ? runPowerQuery : runSimpleQuery} size={"medium"}>
          Search
        </Button>
        <Button variant="contained" style={{ marginRight: "16px" }} onClick={clearQuery} size={"medium"}>
          Clear Search
        </Button>
      </Box>
    </Box>
  )
}

export default CardSearch