
import { Context } from './Context'


class RealRestError extends Error {

  isRealRestError = true

  sdk = 'RealRest'

  code: string
  ctx: Context

  constructor(code: string, msg: string, ctx: Context) {
    super(msg)
    this.code = code
    this.ctx = ctx
  }

}

export {
  RealRestError
}

