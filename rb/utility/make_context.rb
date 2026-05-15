# RealRest SDK utility: make_context
require_relative '../core/context'
module RealRestUtilities
  MakeContext = ->(ctxmap, basectx) {
    RealRestContext.new(ctxmap, basectx)
  }
end
