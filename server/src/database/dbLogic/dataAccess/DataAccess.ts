import * as Mongoose from "mongoose";
// import * as promise from 'bluebird';
// Mongoose.Promise = require('bluebird');

import Constants = require("./../../config/Constants");

export class DataAccess {
    // Mongoose.Promise = global.Promise; 
    static mongooseInstance: any;
    static mongooseConnection: Mongoose.Connection;
    static getCollections: string[];

    constructor() {
        // DataAccess.connect();
        // DataAccess.collections();
    };

    static connect(): Mongoose.Connection {
        let collectionArray: any = [];
        if (this.mongooseInstance) return this.mongooseInstance;
        this.mongooseConnection = Mongoose.connection;
        this.mongooseConnection.once("open", () => {
            console.log("Conected to mongodb.");
        });

        this.mongooseInstance = Mongoose.connect(Constants.DB_CONNECTION_STRING, {useMongoClient: true,});
        return this.mongooseInstance;
    }
}

DataAccess.connect();

