import React, {useEffect, useState} from 'react'

import { getPlaylistSelected, getPlaylistInfo, hasPlaylistSelected, getPlaylistRecommendations } from '../services/spotify';
import { Box, Chip, Skeleton } from '@mui/material';
import SongTile from '../components/SongTile';
import PlaylistsDialog from '../components/PlaylistsDialog';

function Dashboard() {
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistInfo, setPlaylistInfo] = useState(null);
  const [recommendationInfoList, setRecommendationInfoList] = useState([]);

  const skipSong = () => {
    setRecommendationInfoList((val) => val.slice(1));
  }

  useEffect(() => {
    if (!hasPlaylistSelected()) {
      setShowPlaylists(true);
    }
    setSelectedPlaylist(getPlaylistSelected());
  }, []);

  useEffect(() => {
    if (selectedPlaylist) {
      setRecommendationInfoList([]);
      setShowPlaylists(false);

      const fetch = async () => {
        try {
          const playlistInfo = await getPlaylistInfo(selectedPlaylist);
          setPlaylistInfo(playlistInfo);
          const recommendationInfo = await getPlaylistRecommendations(selectedPlaylist);
          setRecommendationInfoList(recommendationInfo);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      fetch();
    }
  }, [selectedPlaylist]);

  return (
    <>
    {showPlaylists && <PlaylistsDialog setSelectedPlaylist={setSelectedPlaylist} />}
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '.5rem',
    }}
    >
      <Box>
        <Box  sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'left',
          flexDirection: 'row',
          gap: '.5rem',
        }}
        >
          <Chip label={playlistInfo?.name} variant="outlined" onClick={() => {setSelectedPlaylist(null); setShowPlaylists((val) => !val)}} />
        </Box>
        {recommendationInfoList.length > 0 ? <SongTile song={recommendationInfoList[0]} playlistId={selectedPlaylist} skipSong={skipSong} /> : 
        <>
          <Skeleton variant="rectangular" sx={{m: 1}} width={600} height={300} />
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'right',
              flexDirection: 'row',
              width: 600,
            }} >
              <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: 150 }}/>
            </Box>
          </>}
      </Box>
    </Box>
    </>
  );
}

export default Dashboard