import { Context } from './Context';
declare class RealRestError extends Error {
    isRealRestError: boolean;
    sdk: string;
    code: string;
    ctx: Context;
    status: number;
    get notFound(): boolean;
    constructor(code: string, msg: string, ctx: Context);
}
export { RealRestError };
