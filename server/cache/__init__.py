from typing import Callable

class Cache:
    """Interface implemented by caches to be used with SpotifyClient"""

    def get(self, type: str, key: any):
        """Get a value from the cache."""
        pass

    def insert(self, type: str, key: any, value: any):
        """Insert a value into the cache."""
        pass

    def get_or_insert(self, type: str, key: any, init: Callable[[], any]):
        """Get a value from the cache, or insert a value into the cache if it does not exist."""
        pass

class CacheStore(Cache):
    def __init__(self):
        self.cache = {}

    def get(self, type: str, key: any):
        group = self.cache.get(type)
        if group is None:
            return None
        return group.get(key)
    
    def insert(self, type: str, key: any, value: any):
        if self.cache.get(type) is None:
            self.cache[type] = {}
        
        self.cache[type][key] = value
    
    def get_or_insert(self, type: str, key: any, init: Callable[[], any]):
        group = self.cache.get(type)
        if group is None:
            self.cache[type] = {}
            group = self.cache.get(type)
        
        if group.get(key) is None:
            group[key] = init()
        
        return group.get(key)