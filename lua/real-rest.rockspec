package = "voxgig-sdk-real-rest"
version = "0.0-1"
source = {
  url = "git://github.com/voxgig-sdk/real-rest-sdk.git"
}
description = {
  summary = "RealRest SDK for Lua",
  license = "MIT"
}
dependencies = {
  "lua >= 5.3",
  "dkjson >= 2.5",
  "dkjson >= 2.5",
}
build = {
  type = "builtin",
  modules = {
    ["real-rest_sdk"] = "real-rest_sdk.lua",
    ["config"] = "config.lua",
    ["features"] = "features.lua",
  }
}
