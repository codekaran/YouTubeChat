import { BaseBusiness } from './interfaces/base/baseBusiness';
import { IUserModel } from './../model/interfaces/UserModel';
import { UserRepository } from './../repository/UserRepository';
import { RoomBusiness } from './RoomBusiness';
import { IRoomModel } from './../model/interfaces/RoomModel';


export class UserBusiness {
    addUserInDb = function(email: string, userName: string, image: string, userid: string, provider: string){
        let p = new Promise((resolve, reject) => {
            let repo = new UserRepository();
            let user = <IUserModel>{
                email: email,
                userName: userName,
                image: image,
                userId: userid,
                provider: provider
            };
            repo.create(user, (err, res) => {
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



    addOnlineUserInDb = function(userName: string){
        let p = new Promise((resolve, reject) => {
            let repo = new UserRepository();
            let onlineUser = <IUserModel>{
                userName: userName,
            };
            repo.create(onlineUser, (err, res) => {
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
}