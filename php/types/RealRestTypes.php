<?php
declare(strict_types=1);

// Typed models for the RealRest SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
//
// These are documentation-grade value objects (PHP 8 typed properties),
// registered on the composer classmap autoload. The SDK boundary exchanges
// assoc-arrays; these classes name the shapes for tooling and typed callers.

/** Object entity data model. */
class Object
{
    public ?array $data = null;
    public string $id;
    public string $name;
}

/** Request payload for Object#load. */
class ObjectLoadMatch
{
    public string $id;
}

/** Match filter for Object#list (any subset of Object fields). */
class ObjectListMatch
{
    public ?array $data = null;
    public ?string $id = null;
    public ?string $name = null;
}

/** Match filter for Object#create (any subset of Object fields). */
class ObjectCreateData
{
    public ?array $data = null;
    public ?string $id = null;
    public ?string $name = null;
}

/** Request payload for Object#update. */
class ObjectUpdateData
{
    public string $id;
}

/** Request payload for Object#remove. */
class ObjectRemoveMatch
{
    public string $id;
}

