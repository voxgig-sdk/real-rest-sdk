# ProjectName SDK exists test

import pytest
from realrest_sdk import RealRestSDK


class TestExists:

    def test_should_create_test_sdk(self):
        testsdk = RealRestSDK.test(None, None)
        assert testsdk is not None
