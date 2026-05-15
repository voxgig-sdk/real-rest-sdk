<?php
declare(strict_types=1);

// RealRest SDK feature factory

require_once __DIR__ . '/feature/BaseFeature.php';
require_once __DIR__ . '/feature/TestFeature.php';


class RealRestFeatures
{
    public static function make_feature(string $name)
    {
        switch ($name) {
            case "base":
                return new RealRestBaseFeature();
            case "test":
                return new RealRestTestFeature();
            default:
                return new RealRestBaseFeature();
        }
    }
}
