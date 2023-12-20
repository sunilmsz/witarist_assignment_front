import { io } from "socket.io-client"

export class MySocket {
     socket;
     static instance = new MySocket();
 
     constructor() {
        if(MySocket.instance) return MySocket.instance;
        else { this.socket = io("http://localhost:7000")}
      
    }


 }

