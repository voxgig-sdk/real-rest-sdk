export interface ObjectType {
    data?: Record<string, any>;
    id?: string;
    name?: string;
}
export interface ObjectLoadMatch {
    id: string;
}
export interface ObjectListMatch {
    id: string;
}
export interface ObjectCreateData {
    data?: Record<string, any>;
    id?: string;
    name?: string;
}
export interface ObjectUpdateData {
    id: string;
    data?: Record<string, any>;
    name?: string;
}
export interface ObjectRemoveMatch {
    id: string;
}
