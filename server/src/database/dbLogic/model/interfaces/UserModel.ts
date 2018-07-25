import * as mongoose from 'mongoose';

export interface IUserModel extends mongoose.Document {
    email: string;
    userName: string;
    image: string;
    userId: string;
    provider: string;
}