export class User {
    id:       Number;
    username: String;
    pfp:      String;
    email:    String;
    password: String;

    constructor(
        id:Number, 
        username:String,
        pfp:String,
        email:String,
        password:String
    ) {
        this.id = id;
        this.username = username;
        this.pfp = pfp;
        this.email = email;
        this.password = password;
    }
}