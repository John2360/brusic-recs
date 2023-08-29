import unittest
from tests.cache_test import TestCacheStore

if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTests(TestCacheStore().build())

    runner = unittest.TextTestRunner()
    suite = suite()
    runner.run(suite)