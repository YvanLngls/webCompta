import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: WebSocket;

  constructor() {
    this.socket = new WebSocket("ws://localhost:3003")
  }

  onMessage(callback: (data:any)=>void){
    this.socket.onmessage = (event) =>{
      callback(event.data);
    }
  }

  sendMessage(message: string) {
    if (this.socket.readyState != WebSocket.OPEN) {
      this.socket.addEventListener('open', () => {
        this.socket.send(message);
      });
    } else {
      this.socket.send(message);
    }
  }
}
