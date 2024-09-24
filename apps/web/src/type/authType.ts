export interface IRegisterUser {
    username : string
    email : string
    password : string
    role : "buyer" | "seller"
    referralBy? : string
}

export interface ILoginUser {
    email : string
    password : string
}

export interface IDecodedToken {
    id : number
    username : string
    email : string
    role : string
    iat : number
    exp : number
}