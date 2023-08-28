import React, {useState} from 'react'

import { isLoggedIn } from './services/spotify';
import { Box, Chip, Typography } from '@mui/material';
import Dashboard from './screens/Dashboard';

import './App.css';
import Login from './screens/Login';

function App() {

  return (
    isLoggedIn() ? <Dashboard /> : <Login />
  );
}

export default App;
