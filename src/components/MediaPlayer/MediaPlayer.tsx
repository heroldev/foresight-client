import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Sound from 'react-sound'
import { useState } from 'react';
import { css } from '@emotion/css';
import CircularProgress from '@mui/material/CircularProgress';
import { bgSongData } from './types';
import { GetSongData } from './SongData';
import { getRandomInt } from '../../util/getRandomInt';
import { VolumeOff, VolumeUp } from '@mui/icons-material';

const songLoadingStyle = css`

`

const bgMusic: bgSongData[] = []

export default function MediaPlayer() {
  const theme = useTheme();

  const [loading, setLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true);

  const [currentSongPath, setCurrentSongPath] = useState('../../../snd/test_snd.mp3')
  const [currentSongIndex, setCurrentSongIndex] = useState(-1)
  const [playlist, setplayist] = useState(GetSongData())
  const [volume, setVolume] = useState(100)

  const handlePlaySong = () => {
    setCurrentSongPath(playlist[getRandomInt(playlist.length)].filepath)
  }

  const handleNextSong = () => {
    let nextSong = getRandomInt(playlist.length)

    if (currentSongIndex !== nextSong) {
      setCurrentSongIndex(nextSong)
      setCurrentSongPath(playlist[nextSong].filepath)
    } else {
      nextSong
    }
  }

  return (
    <Card sx={{ display: 'flex', borderRadius: 15 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Sound url={'https://radio.heroldev.net/radio/8000/radio.mp3'} playStatus={'PLAYING'} volume={volume} />

        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <CardMedia
            component="img"
            sx={{ width: 151 }}
            image="/pub_img/mus_icon/bank.png"
            alt="Foresight Radio"
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography component="div" variant="h5">
                Foresight Radio
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                Junichi Masuda, Hitomi Sato, Tsukasa Tawada
              </Typography>
            </CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
              <IconButton>
                {volume === 100 ? <VolumeUp onClick={() => { setVolume(0) }} />
                  : <VolumeOff onClick={() => { setVolume(100) }} />
                }
              </IconButton>
            </Box>
          </Box>

        </Box>

      </Box>
    </Card>
  );
}