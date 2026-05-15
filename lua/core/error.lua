-- RealRest SDK error

local RealRestError = {}
RealRestError.__index = RealRestError


function RealRestError.new(code, msg, ctx)
  local self = setmetatable({}, RealRestError)
  self.is_sdk_error = true
  self.sdk = "RealRest"
  self.code = code or ""
  self.msg = msg or ""
  self.ctx = ctx
  self.result = nil
  self.spec = nil
  return self
end


function RealRestError:error()
  return self.msg
end


function RealRestError:__tostring()
  return self.msg
end


return RealRestError
