import React from 'react'

import './MainTile.css';
import { useStore } from '../../state/store';
import EnhancedTable from '../DeckTable/DeckTable';
import DeckViewCard from '../DeckViewCard/DeckViewCard';
import Box from '@mui/material/Box';

const MainPage = () => {

  const user  = useStore(state => state.user)

  return (
    <div className="main-page-container">
      <Box sx={{m: 2}}>
        <DeckViewCard />
      </Box>
    </div>
  )

}

export default MainPage