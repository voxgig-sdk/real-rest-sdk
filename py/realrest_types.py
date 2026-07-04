# Typed models for the RealRest SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
# params (op.<name>.points[].args.params[]). Field/param types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Do not edit by hand.

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Any


@dataclass
class Object:
    id: str
    name: str
    data: Optional[dict] = None


@dataclass
class ObjectLoadMatch:
    id: str


@dataclass
class ObjectListMatch:
    data: Optional[dict] = None
    id: Optional[str] = None
    name: Optional[str] = None


@dataclass
class ObjectCreateData:
    data: Optional[dict] = None
    id: Optional[str] = None
    name: Optional[str] = None


@dataclass
class ObjectUpdateData:
    id: str


@dataclass
class ObjectRemoveMatch:
    id: str

