# RealRest SDK exists test

require "minitest/autorun"
require_relative "../RealRest_sdk"

class ExistsTest < Minitest::Test
  def test_create_test_sdk
    testsdk = RealRestSDK.test(nil, nil)
    assert !testsdk.nil?
  end
end
