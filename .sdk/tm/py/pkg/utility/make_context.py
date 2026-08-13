# RealRest SDK utility: make_context

from projectname_sdk.core.context import RealRestContext


def make_context_util(ctxmap, basectx):
    return RealRestContext(ctxmap, basectx)
