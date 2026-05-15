<?php
declare(strict_types=1);

// RealRest SDK utility: make_context

require_once __DIR__ . '/../core/Context.php';

class RealRestMakeContext
{
    public static function call(array $ctxmap, ?RealRestContext $basectx): RealRestContext
    {
        return new RealRestContext($ctxmap, $basectx);
    }
}
