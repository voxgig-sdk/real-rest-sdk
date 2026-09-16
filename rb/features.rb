# RealRest SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/ratelimit_feature'
require_relative 'feature/retry_feature'
require_relative 'feature/test_feature'
require_relative 'feature/timeout_feature'


module RealRestFeatures
  def self.make_feature(name)
    case name
    when "base"
      RealRestBaseFeature.new
    when "ratelimit"
      RealRestRatelimitFeature.new
    when "retry"
      RealRestRetryFeature.new
    when "test"
      RealRestTestFeature.new
    when "timeout"
      RealRestTimeoutFeature.new
    else
      RealRestBaseFeature.new
    end
  end
end
