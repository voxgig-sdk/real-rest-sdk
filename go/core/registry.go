package core

var UtilityRegistrar func(u *Utility)

var NewBaseFeatureFunc func() Feature

var NewTestFeatureFunc func() Feature

var NewObjectEntityFunc func(client *RealRestSDK, entopts map[string]any) RealRestEntity

