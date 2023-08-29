from flask import Flask, request
from flask_cors import CORS, cross_origin
from spotify.client import SpotifyClient
from models.RecommendationsFilters import RecommendationsFilters
from models.PlaylistFilters import PlaylistFilters

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
spotify = SpotifyClient()


@app.route('/recommendations/<playlist_id>', methods=['POST'])
@cross_origin()
def playlist_recommendations(playlist_id):
    spotify_token = request.get_json().get('spotify_token')

    tracks_start = request.get_json().get('tracks_start')
    tracks_stop = request.get_json().get('tracks_stop')

    if spotify_token is None:
        return {'success': False, 'error': 'No token provided'}, 400

    results = []
    spotify.set_auth(spotify_token)

    playlist_filter = PlaylistFilters()
    if tracks_start != None and tracks_stop != None:
        playlist_filter.tracks_start = tracks_start
        playlist_filter.tracks_stop = tracks_stop

    recommendations_filter = RecommendationsFilters()
    playlist = spotify.playlist_tracks(playlist_id, track_anyalysis=True, playlist_filter=playlist_filter,
                                       recommendations=True, recommendations_filter=recommendations_filter)

    for track in playlist:
        results.extend(list(map(lambda x: {
            'from': track.name,
            'recommendation': x.to_json()
        }, track.recommendations)))

    return {'success': True, 'recommendations': results}


if __name__ == '__main__':
    app.run(debug=True)
