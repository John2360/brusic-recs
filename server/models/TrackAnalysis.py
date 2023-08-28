import json

class TrackAnalysis:
    def __init__(self, tempo=None, key=None, danceability=None, energy=None, loudness=None, speechiness=None, acousticness=None, instrumentalness=None, liveness=None):
        self.tempo = tempo
        self.key = key
        
        self.danceability = danceability
        self.energy = energy
        self.loudness = loudness
        self.speechiness = speechiness
        self.acousticness = acousticness
        self.instrumentalness = instrumentalness
        self.liveness = liveness
    
    def __str__(self):
        return f"Tempo: {self.tempo}, Key: {self.key}, Danceability: {self.danceability}, Energy: {self.energy}, Loudness: {self.loudness}, Speechiness: {self.speechiness}, Acousticness: {self.acousticness}, Instrumentalness: {self.instrumentalness}, Liveness: {self.liveness}"
    
    def to_json(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)