# RealRest SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/test_feature'


module RealRestFeatures
  def self.make_feature(name)
    case name
    when "base"
      RealRestBaseFeature.new
    when "test"
      RealRestTestFeature.new
    else
      RealRestBaseFeature.new
    end
  end
end
