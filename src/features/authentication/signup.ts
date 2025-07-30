import { FirebaseClient } from "../../core/firebase/firebase-client";
import { UserResponse, UserSignup } from "../../core/interfaces/users.interface";


const collection = new FirebaseClient('users');

// function encryptUserPassword(user:User){

// }

export async function registerUser(user: UserSignup): Promise<UserResponse> {
    // check username exist
    const userInDb = await collection.getOneByField('username', user.username);
    if (userInDb) {
        return {
            user: null,
            errorMessage: `The username ${user.username} is already taken`
        }
    } else {
        const createUser = await collection.create(user);
        return {
            user: createUser,
        }
    }


    // create user
}