import React, { useEffect, useState } from 'react'

import { addToSpotifyPlaylist, playSpotifyTrack } from '../services/spotify';
import { Box, Paper, Chip, Typography, Button, Slider } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

function SongTile(props) {
  const [counter, setCounter] = useState(0);
  const playlistId = props.playlistId;
  const from = props.song.from;
  const song = props.song.recommendation;
  const skipSong = props.skipSong;

  const msToPercent = (ms) => {
    return (ms / song.duration) * 100;
  }

  const percentToMs = (percent) => {
    return Math.round((percent / 100) * song.duration);
  }

  const handleScrubber = (event, value) => {
    setCounter(percentToMs(value));
    playSpotifyTrack(song.sid, counter);
  }

  useEffect(() => {
    playSpotifyTrack(song.sid, 0);

    const interval = setInterval(() => {
      setCounter(prevCounter => prevCounter + 250);
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, [song]);

  return (
    <>
    <Paper elevation={3} >
      <Box sx={{ 
        p: 2, 
        m: 1, 
        width: 600, 
        height: 'auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}
      >
        <Box sx={{
          width: '50%',
          alignContent: 'center',
        }}>
          <img src={song.cover_art} alt="Album Art" />
        </Box>
        <Box sx={{
          width: '50%',
          justifyContent: 'flex-start',
          alignItems: 'start',
        }}>
          <Box sx={{
            padding: '1rem',
          }}>
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'row',
              gap: '.5rem',
            }}>
              <Chip
                label={Math.round(song.track_analysis.tempo)}
                icon={<SpeedIcon />}
              />
              <Chip
                label={song.track_analysis.key}
                icon={<MonitorHeartIcon />}
              />
            </Box>
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'column',
              marginTop: '1rem',
            }}>
              <Typography variant='h3' sx={{fontWeight: 'bold'}}>{song.name}</Typography>
              <Typography variant='h6' sx={{fontWeight: 'light'}}>{song.artist.map((artist) => artist.name).join(', ')}</Typography>
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
                gap: '.5rem',
                justifySelf: 'flex-end',
                marginTop: '1.5rem',
              }}>
                <Button variant="contained" sx={{width: '45%', backgroundColor: '#8e8c8c', "&:hover": {backgroundColor: '#c1bfbf'}}} onClick={skipSong}>
                  Skip
                </Button>
                <Button variant="contained" sx={{width: '45%'}} onClick={() => {addToSpotifyPlaylist(playlistId, song.sid)}}>
                  Add
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
        <Slider
          size="small"
          defaultValue={0}
          value={msToPercent(counter)}
          onChange={handleScrubber}
        />
      </Box>
    </Paper>
    <Box  sx={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'right',
      flexDirection: 'row',
      gap: '.5rem',
    }}
    >
      <Typography variant='body2' sx={{fontWeight: 'light'}}>Recommended from <span style={{fontWeight: 'bold'}}>{from}</span></Typography>
    </Box>
    </>
  )
}

export default SongTile