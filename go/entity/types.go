// Typed models for the RealRest SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
package entity

import "encoding/json"

// Object is the typed data model for the object entity.
type Object struct {
	Data *map[string]any `json:"data,omitempty"`
	Id string `json:"id"`
	Name string `json:"name"`
}

// ObjectLoadMatch is the typed request payload for Object.LoadTyped.
type ObjectLoadMatch struct {
	Id string `json:"id"`
}

// ObjectListMatch is the typed request payload for Object.ListTyped.
type ObjectListMatch struct {
	Data *map[string]any `json:"data,omitempty"`
	Id *string `json:"id,omitempty"`
	Name *string `json:"name,omitempty"`
}

// ObjectCreateData is the typed request payload for Object.CreateTyped.
type ObjectCreateData struct {
	Data *map[string]any `json:"data,omitempty"`
	Id string `json:"id"`
	Name string `json:"name"`
}

// ObjectUpdateData is the typed request payload for Object.UpdateTyped.
type ObjectUpdateData struct {
	Id string `json:"id"`
}

// ObjectRemoveMatch is the typed request payload for Object.RemoveTyped.
type ObjectRemoveMatch struct {
	Id string `json:"id"`
}

// asMap turns a typed request/data struct into the map[string]any the
// runtime op pipeline consumes, honouring the json tags above.
func asMap(v any) map[string]any {
	out := map[string]any{}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// typedFrom decodes a runtime value (a map[string]any produced by the op
// pipeline) into a typed model T via a JSON round-trip. On any error it
// returns the zero value of T; the op's own (value, error) tuple carries the
// real error.
func typedFrom[T any](v any) T {
	var out T
	if v == nil {
		return out
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// typedSliceFrom decodes a runtime list value ([]any of maps) into a typed
// slice []T via a JSON round-trip, for list ops.
func typedSliceFrom[T any](v any) []T {
	var out []T
	if v == nil {
		return out
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}
