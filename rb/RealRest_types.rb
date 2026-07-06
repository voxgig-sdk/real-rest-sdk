# frozen_string_literal: true

# Typed models for the RealRest SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
# params (op.<name>.points[].args.params[]). Member types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Ruby types are unenforced; these YARD
# annotations document the shapes. Do not edit by hand.

# Object entity data model.
#
# @!attribute [rw] data
#   @return [Hash, nil]
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] name
#   @return [String]
Object = Struct.new(
  :data,
  :id,
  :name,
  keyword_init: true
)

# Request payload for Object#load.
#
# @!attribute [rw] id
#   @return [String]
ObjectLoadMatch = Struct.new(
  :id,
  keyword_init: true
)

# Request payload for Object#list.
#
# @!attribute [rw] data
#   @return [Hash, nil]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] name
#   @return [String, nil]
ObjectListMatch = Struct.new(
  :data,
  :id,
  :name,
  keyword_init: true
)

# Request payload for Object#create.
#
# @!attribute [rw] data
#   @return [Hash, nil]
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] name
#   @return [String]
ObjectCreateData = Struct.new(
  :data,
  :id,
  :name,
  keyword_init: true
)

# Request payload for Object#update.
#
# @!attribute [rw] id
#   @return [String]
ObjectUpdateData = Struct.new(
  :id,
  keyword_init: true
)

# Request payload for Object#remove.
#
# @!attribute [rw] id
#   @return [String]
ObjectRemoveMatch = Struct.new(
  :id,
  keyword_init: true
)

