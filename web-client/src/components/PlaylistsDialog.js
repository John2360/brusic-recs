import React, {useEffect, useState} from 'react'
import { TextField, Dialog, Box, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { getUserPlaylists } from '../services/spotify';
import PlaylistTile from './PlaylistTile';

function PlaylistsDialog(props) {
  const {setSelectedPlaylist} = props;

  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await getUserPlaylists();
        setPlaylists(response);
        setFilteredPlaylists(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetch();
  }, [])

  useEffect(() => {
    if (search === '') {
      setFilteredPlaylists(playlists);
    } else {
      setFilteredPlaylists(playlists.filter((playlist) => playlist.name.toLowerCase().includes(search.toLowerCase())));
    }
  }, [search]);

  return (
    <Dialog
      open={true}
      onClose={false}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Select a playlist"}
      </DialogTitle>
      <DialogContent sx={{minWidth: '50vw', minHeight: '50vh', maxWidth: '50vw', maxHeight: '50vh'}}>
        <DialogContentText id="alert-dialog-description" sx={{paddingTop: 1}}>
          <TextField fullWidth label="Search" onChange={(val) => setSearch(val.target.value)} />
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            gap: '.5rem',
            paddingTop: 2,
          }}>
            {filteredPlaylists.length > 0 ? filteredPlaylists.map((playlist) => <PlaylistTile id={playlist.id} name={playlist.name} image={playlist.images[0]?.url} setSelectedPlaylist={setSelectedPlaylist} />) : "Loading..."}
          </Box>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}

export default PlaylistsDialog