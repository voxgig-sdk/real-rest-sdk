# RealRest SDK utility: prepare_body
require_relative 'media'
module RealRestUtilities
  PrepareBody = ->(ctx) {
    return nil unless ctx.op.input == "data"
    return RealRestUtilities.raw_body(ctx.reqdata) if RealRestUtilities.raw_request?(ctx.point)
    ctx.utility.transform_request.call(ctx)
  }
end
