import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import EnhancedTable from '../DeckTable/DeckTable';
import DeckTable from '../DeckTable/DeckTable';

export default function DeckViewCard() {
  return (
    <Card sx={{backgroundColor: '#c4c4c4', borderRadius: '25px'}}>
        <CardContent>
          <DeckTable />
        </CardContent>
    </Card>
  );
}