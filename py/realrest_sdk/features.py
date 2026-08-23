# RealRest SDK feature factory

from realrest_sdk.feature.base_feature import RealRestBaseFeature
from realrest_sdk.feature.test_feature import RealRestTestFeature


_FEATURES = {
    "base": lambda: RealRestBaseFeature(),
    "test": lambda: RealRestTestFeature(),
}


def _make_feature(name):
    factory = _FEATURES.get(name)
    if factory is not None:
        return factory()
    return _FEATURES["base"]()


# True when this SDK was generated with the named feature class - the
# constructor's tolerance for extend-carried features reads this (an
# active name with no generated class must not become a BaseFeature
# stray when an extend instance carries it).
def _has_feature(name):
    return name in _FEATURES
