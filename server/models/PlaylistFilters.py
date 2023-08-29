import json

class PlaylistFilters:
    def __init__(self, tracks_start=0, tracks_stop=5, genres=[], bpm=[], key=[], limit=0):
        self.tracks_start = tracks_start
        self.tracks_stop = tracks_stop
        self.genres = genres
        self.bpm = bpm
        self.key = key
        self.limit = limit
    
    def __str__(self):
        return f"Tracks Start: {self.tracks_start}, Tracks Stop: {self.tracks_stop}, Genres: {self.genres}, BPM: {self.bpm}, Key: {self.key}, Limit: {self.limit}"
        
    def to_json(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)