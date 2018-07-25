import * as mongoose from 'mongoose';
import { IOnlineUserModel } from './interfaces/onlineUsersModel';

export class OnlineUserModel {

    private onlineUsersModel: IOnlineUserModel;

    constructor(onlineUsersModel: IOnlineUserModel) {
        this.onlineUsersModel = onlineUsersModel;
    }
    
    get userName(): string {
        return this.onlineUsersModel.userName;
    }

}

Object.seal(OnlineUserModel);



