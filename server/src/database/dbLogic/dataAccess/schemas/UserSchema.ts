import { Document, Schema, Model, model } from 'mongoose';
import * as mongoose from 'mongoose';
import { DataAccess } from './../../dataAccess/DataAccess';
import { IUserModel } from './../../model/interfaces/UserModel';

var mongooseConnection = DataAccess.mongooseConnection;

class UserSchema {

    static get schema() {
        var schema: Schema = new mongoose.Schema({
            email: {
                type: String,
                required: true,
                unique: true,
            },
            userName: {
                type: String,
                required: true,
            },
            image: {
                type: String,
                required: true,
                unique: true
            },
            userId: {
                type: String,
                required: true,
                unique: true
            },
            provider: {
                type: String,
            },
        });
        return schema;
    }

}

export var schema = mongooseConnection.model<IUserModel>("User", UserSchema.schema);