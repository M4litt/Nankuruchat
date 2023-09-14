export class Message {
    id: Number;
    id_sender: Number;
    content: String;
    content_type: String;

    constructor(
        id:Number,
        id_sender:Number,
        content:String,
        content_type:String
    ) {
        this.id = id;
        this.id_sender = id_sender;
        this.content = content;
        this.content_type = content_type;
    }
}