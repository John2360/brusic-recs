import spotipy
from models.Track import Track
from models.Artist import Artist
from models.TrackAnalysis import TrackAnalysis

class SpotifyClient(spotipy.Spotify):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def get_track_audio_features(self, track_id):
        """Get audio features for a specific track."""
        endpoint = f'audio-features/{track_id}'
        response = self._get(endpoint)
        return TrackAnalysis(tempo=response['tempo'], key=response['key'], danceability=response['danceability'], energy=response['energy'], loudness=response['loudness'], speechiness=response['speechiness'], acousticness=response['acousticness'], instrumentalness=response['instrumentalness'], liveness=response['liveness'])
    
    def playlist_tracks(self, playlist_id, fields=None, market=None, track_anyalysis=False, recommendations=False):
        tracks = super().playlist_tracks(playlist_id, fields, market)
        tracks = tracks['items']
        results = []

        for track in tracks:
            results.append(self._build_track(track, track_anyalysis=track_anyalysis, recommendations=recommendations))

        return results
    
    def _get_artists(self, artist_ids):
        artists = []
        for artist_id in artist_ids:
            artist = self.artist(artist_id)
            artists.append(Artist.Artist(sid=artist_id, name=artist['name'], genres=artist['genres']))
        return artists
    
    def _build_recommendation(self, recommendation):
        if recommendation['type'] != 'track':
            raise Exception('Recommendation is not a track.')
        
        recommendation['track'] = {}
        recommendation['track']['id'] = recommendation['id']
        recommendation['track']['name'] = recommendation['name']
        recommendation['track']['album'] = recommendation['album']
        recommendation['track']['artists'] = recommendation['artists']
        recommendation['track']['duration_ms'] = recommendation['duration_ms']

        
        return self._build_track(recommendation, track_anyalysis=True)

    
    def _build_track(self, track, track_anyalysis=False, recommendations=False):
        sid = track['track']['id']
        name = track['track']['name']
        artist_ids = [artist['id'] for artist in track['track']['artists']]
        genres = track['track']['album'].get('genres', [])

        artists = self._get_artists(artist_ids)

        for artist in artists:
            genres.extend(artist.genres)
        genres = list(set(genres))

        cover_art = track['track']['album']['images'][0]['url']

        duration = track['track']['duration_ms']

        anyalysis = TrackAnalysis()
        if track_anyalysis:
            anyalysis = self.get_track_audio_features(track['track']['id'])

        recommend = []
        if track_anyalysis and recommendations:
            # TODO: Add genres, BPM, and key filters to recommendations
            recommend = [self._build_recommendation(track) for track in self.recommendations(seed_tracks=[track['track']['id']], limit=5)['tracks']]

        return Track(sid=sid, name=name, artist=artists, genres=genres, cover_art=cover_art, duration=duration, track_analysis=anyalysis, recommendations=recommend)