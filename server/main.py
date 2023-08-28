from flask import Flask, request
from flask_cors import CORS, cross_origin
from spotify.client import SpotifyClient

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
spotify = SpotifyClient()

@app.route('/recommendations/<playlist_id>', methods=['POST'])
@cross_origin()
def playlist_recommendations(playlist_id):
    spotify_token = request.get_json().get('spotify_token')
    
    if spotify_token == None:
        return {'success': False, 'error': 'No token provided'}, 400
    
    results = []
    spotify.set_auth(spotify_token)
    playlist = spotify.playlist_tracks(playlist_id, track_anyalysis=True, recommendations=True)

    for track in playlist:
        results.extend(list(map(lambda x: {'from': track.name, 'recommendation': x.to_json()}, track.recommendations)))

    return {'success': True, 'recommendations': results}

if __name__ == '__main__':
    app.run(debug=True)