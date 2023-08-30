import queryString from 'query-string';
import axios from 'axios';

const token = localStorage.getItem('token');
const expiry = localStorage.getItem('token_expiry');
const playlist = localStorage.getItem('playlist');
const pitchClassToString = {
  0: 'C',
  1: 'C#/Db',
  2: 'D',
  3: 'D#/Eb',
  4: 'E',
  5: 'F',
  6: 'F#/Gb',
  7: 'G',
  8: 'G#/Ab',
  9: 'A',
  10: 'A#/Bb',
  11: 'B'
};

export const getLoginAuthLink = (CLIENT_ID, REDIRECT_URI) => {
  const scopes = [
  'user-read-currently-playing',
  'user-modify-playback-state',
  'user-read-playback-state',
  'user-library-read',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-private',
  'playlist-modify-public',
  ]

  const queryParams = queryString.stringify({
  client_id: CLIENT_ID,
  response_type: 'token',
  redirect_uri: REDIRECT_URI,
  scope: scopes.join(' '),
  });

  return `https://accounts.spotify.com/authorize?${queryParams}`;
};

export const handleCallback = () => {
  const hashParams = queryString.parse(window.location.hash);
  if (hashParams.access_token) {
    localStorage.setItem('token', hashParams.access_token);
    localStorage.setItem('token_expiry', Date.now() + hashParams.expires_in * 1000);
    window.location = '/';
  }
};

export const isLoggedIn = () => {
  return token && expiry && Date.now() < expiry;
};

export const handlePlaylistSelect = (id) => {
  localStorage.setItem('playlist', id);
};

export const hasPlaylistSelected = () => {
  return playlist !== null;
}

export const getPlaylistSelected = () => {
  return playlist;
}

export const getUserPlaylists = async () => {
  if (token) {
    const playlists = [];
    
    const getUserPlaylistsHelper = async (url) => {
      try {
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        playlists.push(...response.data.items);

        if (response.data.next) {
          await getUserPlaylistsHelper(response.data.next);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    await getUserPlaylistsHelper('https://api.spotify.com/v1/me/playlists');
    return playlists;
  }
};

export const getPlaylistInfo = async (id) => {
  if (token) {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching playlist data:', error);
    }
  }
}

export const getPlaylistRecommendations = async (id) => {
  if (token) {
    try {
      const data = {
        spotify_token: token,
      };

      const response = await axios.post(`http://127.0.0.1:5000/recommendations/${id}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      response.data.recommendations.forEach((song) => {
        song.recommendation = JSON.parse(song.recommendation);
        song.recommendation.track_analysis.key = pitchClassToString[song.recommendation.track_analysis.key];
      });
    
      return response.data.recommendations;
    } catch (error) {
      console.error('Error fetching recommendation data:', error);
      return [];
    }
  }
}

export const getCurrentlyPlaying = async () => {
  if (token) {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/me/player/currently-playing`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching currently playing data:', error);
    }
  }
}


export const playSpotifyTrack = async (uri, position) => {
  if (token) {
    try {
      const data = {
        uris: [`spotify:track:${uri}`],
        position_ms: position
      };
      const response = await axios.put(`https://api.spotify.com/v1/me/player/play`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
        console.error('Error playing song:', error);
      }
  }
}

export const pauseSpotifyTrack = async () => {
  if (token) {
    try {
      const response = await axios.put(`https://api.spotify.com/v1/me/player/pause`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
        console.error('Error pausing song:', error);
      }
    }
}

export const addToSpotifyPlaylist = async (id, uri) => {
  if (token) {
    try {
      const data = {
        uris: [`spotify:track:${uri}`],
      };
      const response = await axios.post(`https://api.spotify.com/v1/playlists/${id}/tracks`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
        console.error('Error adding to playlist song:', error);
      }
    }
}