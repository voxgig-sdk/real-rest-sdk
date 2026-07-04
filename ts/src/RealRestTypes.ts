// Typed models for the RealRest SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Object {
  data?: Record<string, any>
  id: string
  name: string
}

export interface ObjectLoadMatch {
  id: string
}

export type ObjectListMatch = Partial<Object>

export type ObjectCreateData = Partial<Object>

export interface ObjectUpdateData {
  id: string
}

export interface ObjectRemoveMatch {
  id: string
}

