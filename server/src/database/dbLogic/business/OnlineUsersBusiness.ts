import * as mongoose from 'mongoose';
import { BaseBusiness } from './interfaces/base/baseBusiness';
import { IOnlineUserModel } from './../model/interfaces/onlineUsersModel';
import { OnlineUsersRepository } from './../repository/OnlineUsersRepository';

export class OnlineUsersBusiness {
    
    onlineUsersList = function (userName: string) {
        let p = new Promise((resolve, reject) => {
    
            let repo = new OnlineUsersRepository();
            let onlineUsers = <IOnlineUserModel>{
                userName: userName
            };
            
            repo.create(onlineUsers, (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
        return p;
    }

    findOnlineUsers(userName: string, skipValue: number, limitValue:number){
        let p = new Promise((resolve, reject) => {
            let repo = new OnlineUsersRepository();
            repo.retrieve(skipValue, limitValue, (err: any, res: IOnlineUserModel) => {
                if(err){
                    reject(err); 
                }
                else {
                    resolve(res);
                }
            }); 
        });
        return p;
    }

    offlineUsersList = function (userName: string) {
        let p = new Promise((resolve, reject) => {
            let repo = new OnlineUsersRepository();
            let onlineUsers = <IOnlineUserModel>{
                userName: userName
            };
            repo.findById(userName, (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    repo.delete(userName, (err, res) => {
                        resolve(res);
                        console.log("deleted userName " + userName);  
                    });
                }
            });
        });
        return p;
    }

}
