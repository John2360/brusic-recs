import React, { useEffect, useState } from 'react'

import { addToSpotifyPlaylist, playSpotifyTrack, pauseSpotifyTrack, getCurrentlyPlaying } from '../services/spotify';
import { Box, Paper, Chip, Typography, Button, Slider } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrow from '@mui/icons-material/PlayArrow';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

function SongTile(props) {
  const [clientState, setClientState] = useState({'isPlaying': false, 'counter': 0});
  const [spotifyState, setSpotifyState] = useState({'isPlaying': false, 'counter': 0});

  const resetStates = () => {
    setClientState({'isPlaying': false, 'counter': 0});
    setSpotifyState({'isPlaying': false, 'counter': 0});
  }

  const doSongPlay = () => {
    setClientState({...clientState, 'isPlaying': true});
    playSpotifyTrack(song.sid, 0);
  }

  const doSongResume = () => {
    setClientState({...clientState, 'isPlaying': true});
    playSpotifyTrack(song.sid, clientState.counter);
  }

  const doSongPause = () => {
    setClientState({...clientState, 'isPlaying': false});
    pauseSpotifyTrack();
  }
  
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
    setClientState({ ['isPlaying']: true, ['counter']: percentToMs(value) });
    playSpotifyTrack(song.sid, percentToMs(value));
  }

  useEffect(() => {
    resetStates();
    doSongPlay();
  }, [song]);

  useEffect(() => {
    let intervalId;

    if (clientState.isPlaying) {
      intervalId = setInterval(() => {
        setClientState(prevState => ({ ...prevState, ['counter']: prevState.counter + 100 }));
      }, 100);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [clientState.isPlaying]);

  useEffect(() => {
    const interval = setInterval(() => {
      const fetch = async () => {
        try {
          const currentlyPlaying = await getCurrentlyPlaying();
          setSpotifyState({'isPlaying': currentlyPlaying.is_playing, 'counter': currentlyPlaying.progress_ms});
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      fetch();
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (Math.abs(clientState.counter - spotifyState.counter) > 500) {
      setClientState({...clientState, 'counter': spotifyState.counter});
    }
  }, [clientState, spotifyState]);

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
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}  
        >
          <Box  sx={{width: '5%', "&:hover": {cursor: 'pointer'}}}>
            {clientState.isPlaying ? <PauseIcon onClick={doSongPause} />
            : <PlayArrow onClick={doSongResume}  />}
          </Box>
          <Slider
            size="small"
            defaultValue={0}
            value={msToPercent(clientState.counter)}
            onChange={handleScrubber}
            sx={{width: '95%'}}
          />
        </Box>
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