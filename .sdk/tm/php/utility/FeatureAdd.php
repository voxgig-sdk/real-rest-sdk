<?php
declare(strict_types=1);

// RealRest SDK utility: feature_add

class RealRestFeatureAdd
{
    public static function call(RealRestContext $ctx, mixed $f): void
    {
        $ctx->client->features[] = $f;
    }
}
