# RealRest SDK utility: feature_add
module RealRestUtilities
  FeatureAdd = ->(ctx, f) {
    ctx.client.features << f
  }
end
