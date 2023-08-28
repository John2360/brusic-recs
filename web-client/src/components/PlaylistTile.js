import { Box, Typography, Paper } from '@mui/material'
import React from 'react'

function PlaylistTile(props) {
  const {id, name, image, setSelectedPlaylist} = props;

  return (
    <Paper elevation={3} sx={{"&:hover": {cursor: 'pointer'}}} key={id} onClick={() => {setSelectedPlaylist(id)}}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        width: 250,
        height: 100,
      }} >
        <img src={image} style={{width: 100, height: 100, borderTopLeftRadius: 4, borderBottomLeftRadius: 4}} />
        <Typography variant='h5' sx={{fontWeight: 'bolder', width: 140, maxHeight: 100, overflowY: 'scroll', margin: 1}} >{name}</Typography>
      </Box>
    </Paper>
  )
}

export default PlaylistTile