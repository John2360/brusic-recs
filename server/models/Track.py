import json
from .TrackAnalysis import TrackAnalysis

class Track:
    def __init__(self, sid, name, artist, genres, cover_art, duration, track_analysis=TrackAnalysis(), recommendations=[]):
        self.sid = sid
        self.name = name
        self.artist = artist
        self.genres = genres
        self.cover_art = cover_art
        self.duration = duration
        self.track_analysis = track_analysis
        self.recommendations = recommendations
    
    def __str__(self):
        return f"Sid: {self.sid}, Name: {self.name}, Artists: {self.artist}, Genres: {self.genres}, Cover Art: {self.cover_art}, Duration: {self.duration} Track Analysis: {self.track_analysis}, Recommendations: {self.recommendations}"
        
    def to_json(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)