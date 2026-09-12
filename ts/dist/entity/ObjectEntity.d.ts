import { RealRestEntityBase } from '../RealRestEntityBase';
import type { RealRestSDK } from '../RealRestSDK';
import type { Control } from '../types';
import type { ObjectType, ObjectLoadMatch, ObjectListMatch, ObjectCreateData, ObjectUpdateData, ObjectRemoveMatch } from '../RealRestTypes';
declare class ObjectEntity extends RealRestEntityBase<ObjectType> {
    constructor(client: RealRestSDK, entopts: any);
    make(this: ObjectEntity): ObjectEntity;
    load(this: any, reqmatch?: ObjectLoadMatch, ctrl?: Control): Promise<ObjectEntity>;
    list(this: any, reqmatch?: ObjectListMatch, ctrl?: Control): Promise<ObjectEntity[]>;
    create(this: any, reqdata?: ObjectCreateData, ctrl?: Control): Promise<ObjectEntity>;
    update(this: any, reqdata?: ObjectUpdateData, ctrl?: Control): Promise<ObjectEntity>;
    remove(this: any, reqmatch?: ObjectRemoveMatch, ctrl?: Control): Promise<ObjectEntity>;
}
export { ObjectEntity };
