import React, { useEffect, useState } from 'react'

import { getPlaylistInfo, getPlaylistRecommendations } from '../services/spotify';
import { Box, Chip, Skeleton } from '@mui/material';
import SongTile from '../components/SongTile';
import PlaylistsDialog from '../components/PlaylistsDialog';

function Dashboard() {
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistInfo, setPlaylistInfo] = useState(null);
  const [recommendationInfoList, setRecommendationInfoList] = useState([]);
  const [listPos, setListPos] = useState(0);

  const skipSong = () => setListPos((val) => val + 1);

  const clearSelected = () => setSelectedPlaylist(null);

  const hasSelection = () => recommendationInfoList.length > 0 && listPos < recommendationInfoList.length;

  const fetch = async () => {
    try {
      const playlistInfo = await getPlaylistInfo(selectedPlaylist);
      setPlaylistInfo(playlistInfo);
      const recommendationInfo = await getPlaylistRecommendations(selectedPlaylist);
      if (recommendationInfoList.length === 0) {
        setRecommendationInfoList(recommendationInfo);
      } else {
        for (const rec of recommendationInfo.values()) {
          recommendationInfoList.push(rec);
        }
        setRecommendationInfoList(recommendationInfoList)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // TODO: pre-fetch so data is ready immediately when user skips past the
  // end of the current list
  useEffect(() => {
    if (listPos == recommendationInfoList.length - 2) {
      fetch();
    }
  }, [listPos]);

  useEffect(() => {
    if (selectedPlaylist) {
      setRecommendationInfoList([]);
      setShowPlaylists(false);

      fetch();
    } else {
      setRecommendationInfoList([]);
      setPlaylistInfo(null);
      setShowPlaylists(true);
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
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'left',
            flexDirection: 'row',
            gap: '.5rem',
          }}
          >
            <Chip label={playlistInfo?.name} variant="outlined" onClick={clearSelected} />
          </Box>
          {hasSelection() ? <SongTile song={recommendationInfoList[listPos]} playlistId={selectedPlaylist} skipSong={skipSong} /> :
            <>
              <Skeleton variant="rectangular" sx={{ m: 1 }} width={600} height={300} />
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'right',
                flexDirection: 'row',
                width: 600,
              }} >
                <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: 150 }} />
              </Box>
            </>}
        </Box>
      </Box>
    </>
  );
}

export default Dashboard
