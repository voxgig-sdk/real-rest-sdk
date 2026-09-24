"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealRestError = void 0;
class RealRestError extends Error {
    isRealRestError = true;
    sdk = 'RealRest';
    code;
    ctx;
    status = -1;
    // `err.notFound` rather than a magic number at every call site.
    get notFound() { return 404 === this.status; }
    constructor(code, msg, ctx) {
        super(msg);
        this.code = code;
        this.ctx = ctx;
    }
}
exports.RealRestError = RealRestError;
//# sourceMappingURL=RealRestError.js.map