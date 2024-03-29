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

    public toUserJson(): UserJson 
    {
        return {
            id:        this.id,
            username:  this.username,
            pfp:       this.pfp,
            email:     this.email,
            description:this.description,
            friends:   [],
            enemies:   []
        }
    }
}

export interface UserJson
{
    id:         Number;
    username:   String;
    pfp:        String;
    email:      String;
    description:String;

    friends:UserJson[];
    enemies:UserJson[];
}
