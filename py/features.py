# RealRest SDK feature factory

from feature.base_feature import RealRestBaseFeature
from feature.test_feature import RealRestTestFeature


def _make_feature(name):
    features = {
        "base": lambda: RealRestBaseFeature(),
        "test": lambda: RealRestTestFeature(),
    }
    factory = features.get(name)
    if factory is not None:
        return factory()
    return features["base"]()
