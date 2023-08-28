import { Button, Box } from '@mui/material'
import { getLoginAuthLink, handleCallback } from '../services/spotify'
import React from 'react'

function Login() {
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI
  const authLink = getLoginAuthLink(CLIENT_ID, REDIRECT_URI);
  handleCallback();
  
  return (
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
      <Button variant="contained" href={authLink}>Login with Spotify</Button>
    </Box>
  )
}

export default Login