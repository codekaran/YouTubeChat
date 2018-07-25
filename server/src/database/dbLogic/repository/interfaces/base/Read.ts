import * as mongoose from 'mongoose';

export interface IRead<T> {
    retrieve: (skipValue: number, limitValue: number, callback: (error: any, result: any) => void) => void;
    findById: (id: string, callback: (error: any, result: T) => void) => void;
}

// export = IRead;