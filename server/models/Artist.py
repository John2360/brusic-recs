import json

class Artist:
    def __init__(self, sid, name, genres):
        self.sid = sid
        self.name = name
        self.genres = genres
    
    def __str__(self):
        return f"Sid: {self.sid}, Name: {self.name}, Genres: {self.genres}"
        
    def to_json(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)