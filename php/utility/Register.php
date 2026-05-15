<?php
declare(strict_types=1);

// RealRest SDK utility registration

require_once __DIR__ . '/../core/UtilityType.php';
require_once __DIR__ . '/Clean.php';
require_once __DIR__ . '/Done.php';
require_once __DIR__ . '/MakeError.php';
require_once __DIR__ . '/FeatureAdd.php';
require_once __DIR__ . '/FeatureHook.php';
require_once __DIR__ . '/FeatureInit.php';
require_once __DIR__ . '/Fetcher.php';
require_once __DIR__ . '/MakeFetchDef.php';
require_once __DIR__ . '/MakeContext.php';
require_once __DIR__ . '/MakeOptions.php';
require_once __DIR__ . '/MakeRequest.php';
require_once __DIR__ . '/MakeResponse.php';
require_once __DIR__ . '/MakeResult.php';
require_once __DIR__ . '/MakePoint.php';
require_once __DIR__ . '/MakeSpec.php';
require_once __DIR__ . '/MakeUrl.php';
require_once __DIR__ . '/Param.php';
require_once __DIR__ . '/PrepareAuth.php';
require_once __DIR__ . '/PrepareBody.php';
require_once __DIR__ . '/PrepareHeaders.php';
require_once __DIR__ . '/PrepareMethod.php';
require_once __DIR__ . '/PrepareParams.php';
require_once __DIR__ . '/PreparePath.php';
require_once __DIR__ . '/PrepareQuery.php';
require_once __DIR__ . '/ResultBasic.php';
require_once __DIR__ . '/ResultBody.php';
require_once __DIR__ . '/ResultHeaders.php';
require_once __DIR__ . '/TransformRequest.php';
require_once __DIR__ . '/TransformResponse.php';

RealRestUtility::setRegistrar(function (RealRestUtility $u): void {
    $u->clean = [RealRestClean::class, 'call'];
    $u->done = [RealRestDone::class, 'call'];
    $u->make_error = [RealRestMakeError::class, 'call'];
    $u->feature_add = [RealRestFeatureAdd::class, 'call'];
    $u->feature_hook = [RealRestFeatureHook::class, 'call'];
    $u->feature_init = [RealRestFeatureInit::class, 'call'];
    $u->fetcher = [RealRestFetcher::class, 'call'];
    $u->make_fetch_def = [RealRestMakeFetchDef::class, 'call'];
    $u->make_context = [RealRestMakeContext::class, 'call'];
    $u->make_options = [RealRestMakeOptions::class, 'call'];
    $u->make_request = [RealRestMakeRequest::class, 'call'];
    $u->make_response = [RealRestMakeResponse::class, 'call'];
    $u->make_result = [RealRestMakeResult::class, 'call'];
    $u->make_point = [RealRestMakePoint::class, 'call'];
    $u->make_spec = [RealRestMakeSpec::class, 'call'];
    $u->make_url = [RealRestMakeUrl::class, 'call'];
    $u->param = [RealRestParam::class, 'call'];
    $u->prepare_auth = [RealRestPrepareAuth::class, 'call'];
    $u->prepare_body = [RealRestPrepareBody::class, 'call'];
    $u->prepare_headers = [RealRestPrepareHeaders::class, 'call'];
    $u->prepare_method = [RealRestPrepareMethod::class, 'call'];
    $u->prepare_params = [RealRestPrepareParams::class, 'call'];
    $u->prepare_path = [RealRestPreparePath::class, 'call'];
    $u->prepare_query = [RealRestPrepareQuery::class, 'call'];
    $u->result_basic = [RealRestResultBasic::class, 'call'];
    $u->result_body = [RealRestResultBody::class, 'call'];
    $u->result_headers = [RealRestResultHeaders::class, 'call'];
    $u->transform_request = [RealRestTransformRequest::class, 'call'];
    $u->transform_response = [RealRestTransformResponse::class, 'call'];
});
