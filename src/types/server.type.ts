export class Server {
    id:          Number;
    name:        String;
    description: String;
    picture:     String;

    constructor(
        id:Number,
        name:String,
        description:String,
        picture:String
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.picture = picture;
    }
}
