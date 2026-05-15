package voxgigrealrestsdk

import (
	"github.com/voxgig-sdk/real-rest-sdk/core"
	"github.com/voxgig-sdk/real-rest-sdk/entity"
	"github.com/voxgig-sdk/real-rest-sdk/feature"
	_ "github.com/voxgig-sdk/real-rest-sdk/utility"
)

// Type aliases preserve external API.
type RealRestSDK = core.RealRestSDK
type Context = core.Context
type Utility = core.Utility
type Feature = core.Feature
type Entity = core.Entity
type RealRestEntity = core.RealRestEntity
type FetcherFunc = core.FetcherFunc
type Spec = core.Spec
type Result = core.Result
type Response = core.Response
type Operation = core.Operation
type Control = core.Control
type RealRestError = core.RealRestError

// BaseFeature from feature package.
type BaseFeature = feature.BaseFeature

func init() {
	core.NewBaseFeatureFunc = func() core.Feature {
		return feature.NewBaseFeature()
	}
	core.NewTestFeatureFunc = func() core.Feature {
		return feature.NewTestFeature()
	}
	core.NewObjectEntityFunc = func(client *core.RealRestSDK, entopts map[string]any) core.RealRestEntity {
		return entity.NewObjectEntity(client, entopts)
	}
}

// Constructor re-exports.
var NewRealRestSDK = core.NewRealRestSDK
var TestSDK = core.TestSDK
var NewContext = core.NewContext
var NewSpec = core.NewSpec
var NewResult = core.NewResult
var NewResponse = core.NewResponse
var NewOperation = core.NewOperation
var MakeConfig = core.MakeConfig
var NewBaseFeature = feature.NewBaseFeature
var NewTestFeature = feature.NewTestFeature
