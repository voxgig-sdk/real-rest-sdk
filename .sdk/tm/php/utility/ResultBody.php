<?php
declare(strict_types=1);

// RealRest SDK utility: result_body

class RealRestResultBody
{
    public static function call(RealRestContext $ctx): ?RealRestResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result && $response && $response->json_func && $response->body) {
            $result->body = ($response->json_func)();
        }
        return $result;
    }
}
