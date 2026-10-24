export interface ObjectType {
    createdAt?: string;
    data?: Record<string, any>;
    id: string;
    name: string;
    updatedAt?: string;
}
export interface ObjectLoadMatch {
    id: string;
}
export interface ObjectListMatch {
    ids: string;
    id: string;
}
export interface ObjectCreateData {
    data?: Record<string, any>;
    name: string;
}
export interface ObjectUpdateData {
    id: string;
    data?: Record<string, any>;
    name?: string;
}
export interface ObjectPatchData {
    id: string;
    data?: Record<string, any>;
    name?: string;
}
export interface ObjectRemoveMatch {
    id: string;
}
