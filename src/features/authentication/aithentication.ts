import { FirebaseClient } from "../../core/firebase/firebase-client";
import { User, UserResponse, UserSignup } from "./users.interface";


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

export async function login(payload: { username: string, password: string }) {
    const user = await collection.getOneByField('username', payload.username);
    if (user && user?.password === payload.password && payload.password) {
        return { user }
    } else {
        return {
            user: null,
            errorMessage: `Wrong email or password`
        }
    }

}