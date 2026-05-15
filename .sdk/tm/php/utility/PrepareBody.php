<?php
declare(strict_types=1);

// RealRest SDK utility: prepare_body

class RealRestPrepareBody
{
    public static function call(RealRestContext $ctx): mixed
    {
        if ($ctx->op->input === 'data') {
            return ($ctx->utility->transform_request)($ctx);
        }
        return null;
    }
}
