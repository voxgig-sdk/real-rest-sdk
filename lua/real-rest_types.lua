-- Typed models for the RealRest SDK (LuaLS annotations).
--
-- GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
-- params (op.<name>.points[].args.params[]). Field/param types come from the
-- canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
-- @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
-- edit by hand.

---@class Object
---@field data? table
---@field id string
---@field name string

---@class ObjectLoadMatch
---@field id string

---@class ObjectListMatch
---@field data? table
---@field id? string
---@field name? string

---@class ObjectCreateData
---@field data? table
---@field id string
---@field name string

---@class ObjectUpdateData
---@field id string

---@class ObjectRemoveMatch
---@field id string

local M = {}

return M
