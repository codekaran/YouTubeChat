import * as mongoose from 'mongoose';
import { BaseBusiness } from './interfaces/base/baseBusiness';
import { IRoomModel } from './../model/interfaces/RoomModel';
import { RoomRepository } from './../repository/RoomRepository';

export class RoomBusiness {

    createRoom = function (roomId: string, userName: string, message:string, image:string, time: number) {
        let p = new Promise((resolve, reject) => {

            let repo = new RoomRepository(roomId);
            let room = <IRoomModel>{
                userName: userName,
                message: message,
                image: image,
                time: time
            };
            
            repo.create(room, (err, res) => {
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
    
    findRoom(roomId: string, skipValue: number, limitValue:number ) {
        let p = new Promise((resolve, reject) => {
            let repo = new RoomRepository(roomId);
            repo.retrieve(skipValue,limitValue, (err: any, res: IRoomModel) => {
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

}

