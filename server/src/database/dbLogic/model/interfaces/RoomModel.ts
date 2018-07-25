import * as mongoose from 'mongoose';

export interface IRoomModel extends mongoose.Document {
    userName: string;
    message: string;
    image: string;
    time: number;
    createdAt: Date;
    modifiedAt: Date;
}




