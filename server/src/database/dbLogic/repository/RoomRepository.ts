
import { RoomModel } from './../model/RoomModel';
import { IRoomModel } from './../model/interfaces/RoomModel';
import { schemaFunc } from './../dataAccess/schemas/RoomSchema';
import { RepositoryBase } from './base/RepositoryBase';

export class RoomRepository extends RepositoryBase<IRoomModel> {

    constructor(options: string) {
        super(schemaFunc(options));
    }
}
Object.seal(RoomRepository);
