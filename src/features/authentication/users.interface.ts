export interface User {
    id: string,
    firstName: string,
    lastName: string,
    username: string,
}

export interface UserSignup {
    firstName: string,
    lastName: string,
    username: string,
    password: string
}

export interface UserResponse {
    user: User | null,
    errorMessage?: string,
}
