# RealRest SDK utility registration
require_relative '../core/utility_type'
require_relative 'clean'
require_relative 'done'
require_relative 'make_error'
require_relative 'feature_add'
require_relative 'feature_hook'
require_relative 'feature_init'
require_relative 'fetcher'
require_relative 'make_fetch_def'
require_relative 'make_context'
require_relative 'make_options'
require_relative 'make_request'
require_relative 'make_response'
require_relative 'make_result'
require_relative 'make_point'
require_relative 'make_spec'
require_relative 'make_url'
require_relative 'param'
require_relative 'prepare_auth'
require_relative 'prepare_body'
require_relative 'prepare_headers'
require_relative 'prepare_method'
require_relative 'prepare_params'
require_relative 'prepare_path'
require_relative 'prepare_query'
require_relative 'result_basic'
require_relative 'result_body'
require_relative 'result_headers'
require_relative 'transform_request'
require_relative 'transform_response'

RealRestUtility.registrar = ->(u) {
  u.clean = RealRestUtilities::Clean
  u.done = RealRestUtilities::Done
  u.make_error = RealRestUtilities::MakeError
  u.feature_add = RealRestUtilities::FeatureAdd
  u.feature_hook = RealRestUtilities::FeatureHook
  u.feature_init = RealRestUtilities::FeatureInit
  u.fetcher = RealRestUtilities::Fetcher
  u.make_fetch_def = RealRestUtilities::MakeFetchDef
  u.make_context = RealRestUtilities::MakeContext
  u.make_options = RealRestUtilities::MakeOptions
  u.make_request = RealRestUtilities::MakeRequest
  u.make_response = RealRestUtilities::MakeResponse
  u.make_result = RealRestUtilities::MakeResult
  u.make_point = RealRestUtilities::MakePoint
  u.make_spec = RealRestUtilities::MakeSpec
  u.make_url = RealRestUtilities::MakeUrl
  u.param = RealRestUtilities::Param
  u.prepare_auth = RealRestUtilities::PrepareAuth
  u.prepare_body = RealRestUtilities::PrepareBody
  u.prepare_headers = RealRestUtilities::PrepareHeaders
  u.prepare_method = RealRestUtilities::PrepareMethod
  u.prepare_params = RealRestUtilities::PrepareParams
  u.prepare_path = RealRestUtilities::PreparePath
  u.prepare_query = RealRestUtilities::PrepareQuery
  u.result_basic = RealRestUtilities::ResultBasic
  u.result_body = RealRestUtilities::ResultBody
  u.result_headers = RealRestUtilities::ResultHeaders
  u.transform_request = RealRestUtilities::TransformRequest
  u.transform_response = RealRestUtilities::TransformResponse
}
