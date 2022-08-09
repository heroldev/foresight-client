import { css } from '@emotion/css'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import ForesightHeader from '../../components/SiteHeader/ForesightHeader'
import { getDeckBox, getUser, select, useStore } from '../../state/store'
import { Card as TCGCard } from '../../types/Card'
import { Deck } from '../../types/Deck'
import { DeckFormat } from '../../types/Format'
import { generateId } from '../../util/generateId'
import { ICreateNewDeckProps } from './types'
import "../../bootstrap/global.css"
import { Link } from 'react-router-dom'

const newDeckForm = css`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`

const newDeckFormContainer = css`
  background-color: #e5e5e5;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: flex-end;
`

const CreateNewDeck = (props: ICreateNewDeckProps) => {

  // storage vars
  const { user } = useStore(state => ({ user: state.user }))
  const { deckBox } = useStore(state => ({ deckBox: state.deckBox }))

  const createNewDeck = useStore(state => state.createNewDeck)

  const [initialDeckName, setInitialDeckName] = useState("Deck #" + (deckBox.length + 1).toString())
  const [deckName, setDeckName] = useState('')
  const [deckFormat, setDeckFormat] = useState(DeckFormat.Standard)

  const disableDeckCreation = () => {

    if (deckName === '') {
      return true
    } else {
      return false
    }

  }

  const getFormatInfo = (): string => {
    switch (deckFormat) {
      case DeckFormat.Standard:
        return "Sword & Shield onwards."
      case DeckFormat.Expanded:
        return "Black & White onwards."
      case DeckFormat.Unlimited:
        return "All Play! Pokémon cards allowed."
    }
  }

  const handleChangeLegality = (event: SelectChangeEvent) => {
    setDeckFormat(event.target.value as DeckFormat);
  };

  const handleCreateDeck = () => {
    let cardsInDeck: TCGCard[] = []

    const user = select(getUser)

    const newDeck: Deck = {
      name: deckName,
      size: cardsInDeck.length,
      format: deckFormat,
      modified: new Date().toLocaleString(),
      creator: user.screenName,
      decklist: cardsInDeck,
      deckId: generateId(),
      cardCount: new Map()
    }

    //adds deck to store
    createNewDeck(newDeck)
    window.location.href = "/main"
  }

  return (
    <div className="main-view">
      <ForesightHeader userInfo={user} />
      <div className={newDeckFormContainer}>
        <Box sx={{ m: 2 }}>
          <Card sx={{ backgroundColor: '#c4c4c4', borderRadius: '25px' }}>
            <CardContent>
              <Box>
                <Paper sx={{ mb: 2, minWidth: 600, /*maxWidth: 630*/ }}>
                  <Box>
                    <Typography
                      sx={{ p: 2, flex: '1 1 100%' }}
                      variant="h6"
                      component="div"
                    >
                      New Deck Creation
                    </Typography>
                    <div className={newDeckForm}>
                      <FormControl sx={{ ml: 2, mb: 1 }}>
                        <TextField label={(initialDeckName === "Deck #1") ? "Deck Name" : initialDeckName} variant="outlined" onChange={(e) => setDeckName(e.target.value)} />
                      </FormControl>
                      <FormControl sx={{ ml: 1, mb: 1, minWidth: 120 }}>
                        <InputLabel>Format</InputLabel>
                        <Select
                          value={deckFormat}
                          label="Format"
                          onChange={handleChangeLegality}
                        >
                          <MenuItem value={DeckFormat.Standard}>Standard</MenuItem>
                          <MenuItem value={DeckFormat.Expanded}>Expanded</MenuItem>
                          <MenuItem value={DeckFormat.Unlimited}>Unlimited</MenuItem>
                        </Select>
                      </FormControl>
                      <span className="customCaption" style={{ marginBottom: "8px" }}>{getFormatInfo()}</span>
                    </div>
                  </Box>
                </Paper>
                <Button variant="contained" style={{ backgroundColor: '#1C18E8', marginRight: "16px" }} disabled={disableDeckCreation()} onClick={handleCreateDeck} size={"medium"}>
                  Create New Deck
                </Button>
                <Button variant="contained" style={{ marginRight: "16px" }} component={Link} to={"/main"} size={"medium"}>
                  Go Back
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </div>



    </div>
  )

}

export default CreateNewDeck