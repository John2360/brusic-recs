import unittest
# from cache import CacheStore
from cache import CacheStore

class TestCacheStore(unittest.TestCase):
    def build(self):
        test_suite = unittest.TestLoader().loadTestsFromTestCase(self)
        return test_suite

    def setUp(self):
        self.cache_store = CacheStore()

    def test_get(self):
        self.cache_store.insert("test", "test", "test")
        self.assertEqual(self.cache_store.get("test", "test"), "test")

    def test_get_multi(self):
        self.cache_store.insert("test", "test1", "test1")
        self.cache_store.insert("test", "test2", "test2")
        self.cache_store.insert("test", "test3", "test3")

        self.assertEqual(self.cache_store.get("test", "test1"), "test1")
        self.assertEqual(self.cache_store.get("test", "test2"), "test2")
        self.assertEqual(self.cache_store.get("test", "test3"), "test3")
        
    def test_get_miss(self):
        self.assertIsNone(self.cache_store.get("test", "test"))
    
    def test_insert(self):
        self.cache_store.insert("test", "test", "test")
        self.assertEqual(self.cache_store.get("test", "test"), "test")

    def test_insert_update(self):
        self.cache_store.insert("test", "test", "test")
        self.cache_store.insert("test", "test", "updated")
        self.assertEqual(self.cache_store.get("test", "test"), "updated")

    def test_get_or_insert(self):
        # should insert "data"
        self.assertEqual(self.cache_store.get_or_insert("test", "test", lambda: "data"), "data")
        # should contain "data"
        self.assertEqual(self.cache_store.get("test", "test"), "data")

    def test_get_or_insert_hit(self):
        self.cache_store.insert("test", "test", "data")
        # should already contain the data, return "data" and not insert "data2"
        self.assertEqual(self.cache_store.get_or_insert("test", "test", lambda: "data2"), "data")

if __name__ == '__main__':
    unittest.main()