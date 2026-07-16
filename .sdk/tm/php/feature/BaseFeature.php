<?php
declare(strict_types=1);

// RealRest SDK base feature

class RealRestBaseFeature
{
    public string $version;
    public string $name;
    public bool $active;

    // Positions this feature when added via the client `extend` option:
    // "__before__" / "__after__" / "__replace__" name an already-added
    // feature (mirrors the ts feature `_options`). Declared so setting it
    // on an extension instance avoids the dynamic-property deprecation.
    public ?array $_options = null;

    public function __construct()
    {
        $this->version = '0.0.1';
        $this->name = 'base';
        $this->active = true;
    }

    public function get_version(): string { return $this->version; }
    public function get_name(): string { return $this->name; }
    public function get_active(): bool { return $this->active; }

    public function init(RealRestContext $ctx, array $options): void {}
    public function PostConstruct(RealRestContext $ctx): void {}
    public function PostConstructEntity(RealRestContext $ctx): void {}
    public function SetData(RealRestContext $ctx): void {}
    public function GetData(RealRestContext $ctx): void {}
    public function GetMatch(RealRestContext $ctx): void {}
    public function SetMatch(RealRestContext $ctx): void {}
    public function PrePoint(RealRestContext $ctx): void {}
    public function PreSpec(RealRestContext $ctx): void {}
    public function PreRequest(RealRestContext $ctx): void {}
    public function PreResponse(RealRestContext $ctx): void {}
    public function PreResult(RealRestContext $ctx): void {}
    public function PreDone(RealRestContext $ctx): void {}
    public function PreUnexpected(RealRestContext $ctx): void {}
}
