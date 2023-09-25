export class User {
    id:         Number;
    username:   String;
    pfp:        String;
    email:      String;
    password:   String;
    description:String;

    constructor(
        id:Number, 
        username:String,
        pfp:String,
        email:String,
        password:String,
        description:String
    ) {
        this.id = id;
        this.username = username;
        this.pfp = pfp;
        this.email = email;
        this.password = password;
        this.description = description;
    }
}