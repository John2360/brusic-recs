import spotipy
from models.Track import Track
from models.Artist import Artist
from models.TrackAnalysis import TrackAnalysis
from models.PlaylistFilters import PlaylistFilters

from cache import Cache


class SpotifyClient(spotipy.Spotify):
    def __init__(self, cache: Cache = None, *args, **kwargs):
        self.cache = cache
        super().__init__(*args, **kwargs)

    def get_track_audio_features(self, track_id):
        """Get audio features for a specific track."""
        if self._has_cache():
            return self.cache.get_or_insert(
                "analysis",
                track_id,
                lambda: self._get_audio_features(track_id)
            )
        return self._get_audio_features(track_id)

    def playlist_tracks(
        self,
        playlist_id,
        fields=None,
        market=None,
        playlist_filter=PlaylistFilters(),
        track_anyalysis=False,
        recommendations=False,
        recommendations_filter=None
    ):
        tracks = super().playlist_tracks(playlist_id, fields, market)
        tracks = tracks['items']
        results = []

        if recommendations and recommendations_filter is None:
            # TODO: we should probably use a default here instead of erroring
            # to handle the use case where one does not need a filter
            raise Exception(
                'Recommendations filter is required when recommendations is True.'
            )

        for track in tracks[
            playlist_filter.tracks_start:playlist_filter.tracks_stop
        ]:
            results.append(
                self._build_track(
                    track,
                    track_anyalysis=track_anyalysis,
                    recs=recommendations,
                    recommendations_filter=recommendations_filter
                )
            )

        return results

    def artist(self, artist_id):
        if self._has_cache():
            return self.cache.get_or_insert(
                "artist",
                artist_id,
                lambda: super(SpotifyClient, self).artist(artist_id)
            )
        return super().artist(artist_id)

    def _has_cache(self):
        return self.cache is not None

    def _get_artists(self, artist_ids):
        artists = []
        for artist_id in artist_ids:
            artist = self.artist(artist_id)
            artists.append(Artist(artist_id, artist['name'], artist['genres']))
        return artists

    def _get_audio_features(self, track_id):
        endpoint = f'audio-features/{track_id}'
        response = self._get(endpoint)
        return TrackAnalysis(
            tempo=response['tempo'],
            key=response['key'],
            danceability=response['danceability'],
            energy=response['energy'],
            loudness=response['loudness'],
            speechiness=response['speechiness'],
            acousticness=response['acousticness'],
            instrumentalness=response['instrumentalness'],
            liveness=response['liveness']
        )

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

    def _build_track(
        self,
        track,
        track_anyalysis=False,
        recs=False,
        recommendations_filter=None
    ):
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
        if track_anyalysis and recs:
            # TODO: Add genres, BPM, and key filters to recommendations
            limit = recommendations_filter.limit
            recommend = list(map(
                self._build_recommendation,
                self.recommendations(
                    seed_tracks=[track['track']['id']], limit=limit
                )['tracks']
            ))

        return Track(
            sid=sid,
            name=name,
            artist=artists,
            genres=genres,
            cover_art=cover_art,
            duration=duration,
            track_analysis=anyalysis,
            recommendations=recommend
        )
