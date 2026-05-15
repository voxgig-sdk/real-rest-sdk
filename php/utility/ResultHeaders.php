<?php
declare(strict_types=1);

// RealRest SDK utility: result_headers

class RealRestResultHeaders
{
    public static function call(RealRestContext $ctx): ?RealRestResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result) {
            if ($response && is_array($response->headers)) {
                $result->headers = $response->headers;
            } else {
                $result->headers = [];
            }
        }
        return $result;
    }
}
