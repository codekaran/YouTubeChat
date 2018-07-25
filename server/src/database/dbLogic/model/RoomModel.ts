
import { IRoomModel } from './interfaces/RoomModel';

export class RoomModel {

    private roomModel: IRoomModel;

    constructor(roomModel: IRoomModel) {
        this.roomModel = roomModel;
    }

    get id(): String {
        return this.roomModel._id;
    }

    get userName(): string {
        return this.roomModel.userName;
    }

    get image(): string {
        return this.roomModel.image;
    }

    get message(): string {
        return this.roomModel.message;
    }

    get time(): number {
        return this.roomModel.time;
    }
 
}

Object.seal(RoomModel);



