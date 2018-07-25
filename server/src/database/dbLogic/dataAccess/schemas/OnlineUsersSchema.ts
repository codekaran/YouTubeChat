import { Document, Schema, Model, model } from 'mongoose';
import * as mongoose from 'mongoose';
import { DataAccess } from './../../dataAccess/DataAccess';
import { IOnlineUserModel } from './../../model/interfaces/onlineUsersModel';

var mongooseConnection = DataAccess.mongooseConnection;
class OnlineUsersSchema {

    static get schema() {
        var schema: Schema = new mongoose.Schema({
            userName: {
                type: String,
                required: true,
                unique: true
            }
        });
        return schema;
    }

}

export var schema = mongooseConnection.model<IOnlineUserModel>("OnlineUsers", OnlineUsersSchema.schema);
