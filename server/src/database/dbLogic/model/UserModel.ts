import { IUserModel } from './interfaces/UserModel';

export class UserModel {

    private userModel: IUserModel;

    constructor(userModel: IUserModel) {
        this.userModel = userModel;
    }

    get userEmail(): string  {
        return this.userModel.email;
    }
    
    get usersName(): string  {
        return this.userModel.userName;
    }

    get userImage(): string  {
        return this.userModel.image;
    }
   
    get userId(): string  {
        return this.userModel.userId;
    }

    // get userIdToken(): string  {
    //     return this.userModel.idToken;
    // }
    
    get provider(): string  {
        return this.userModel.provider;
    }

}

Object.seal(UserModel);
