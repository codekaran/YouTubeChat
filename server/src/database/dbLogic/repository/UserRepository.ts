
import { UserModel } from './../model/UserModel';
import { IUserModel } from './../model/interfaces/UserModel';
import { schema } from './../dataAccess/schemas/UserSchema';
import { RepositoryBase } from './base/RepositoryBase';

export class UserRepository extends RepositoryBase<IUserModel> {

    constructor() {
        super(schema);
    }
}
Object.seal(UserRepository);