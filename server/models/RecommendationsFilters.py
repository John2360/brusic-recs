import json

class RecommendationsFilters:
    def __init__(self, genres=[], bpm=[], key=[], limit=1):
        self.genres = genres
        self.bpm = bpm
        self.key = key
        self.limit = limit
    
    def __str__(self):
        return f"Genres: {self.genres}, BPM: {self.bpm}, Key: {self.key}, Limit: {self.limit}"
        
    def to_json(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)