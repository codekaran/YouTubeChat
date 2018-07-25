
import { OnlineUserModel } from './../model/OnlineUsersModel';
import { IOnlineUserModel } from './../model/interfaces/onlineUsersModel';
import { schema } from './../dataAccess/schemas/OnlineUsersSchema';
import { RepositoryBase } from './base/RepositoryBase';

export class OnlineUsersRepository extends RepositoryBase<IOnlineUserModel> {

    constructor() {
        super(schema);
        
    }
}
Object.seal(OnlineUsersRepository);