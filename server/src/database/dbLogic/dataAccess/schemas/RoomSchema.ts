import { Document, Schema, Model, model, Mongoose } from 'mongoose';
import * as mongoose from 'mongoose';
import { DataAccess } from './../../dataAccess/DataAccess';
import { IRoomModel } from './../../model/interfaces/RoomModel';

var mongooseConnection = DataAccess.mongooseConnection;
class RoomSchema {

    static get schema() {
        var schema: Schema = new mongoose.Schema({
            userName: {
                type: String,
                required: true,
                unique: false
            },
            message: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            time: {
                type: Number,
                required: true
            },
            createdAt: {
                type: Date,
                required: false
            },
            modifiedAt: {
                type: Date,
                required: false
            }
        });
        return schema;
    }

}

export var schemaFunc = function (options: string): mongoose.Model<mongoose.Document> {
    return mongooseConnection.model<IRoomModel>(options, RoomSchema.schema, options.toLowerCase());
}