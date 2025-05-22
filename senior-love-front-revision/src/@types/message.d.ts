export default interface IMessage {
id:number,
sender_id: number,
receiver_id: number,
content: string,
createdAt: Date,
sender: {
    pseudo: string;
    profile_picture: string;
},
receiver: {
    pseudo: string;
    profile_picture: string;
}
}