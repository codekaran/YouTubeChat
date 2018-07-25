import * as mongoose from 'mongoose';

export interface IOnlineUserModel extends mongoose.Document {
    userName: string;
}
