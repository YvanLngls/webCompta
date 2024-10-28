import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  userName = "Yvan"
  private entries = new Subject<string>()

  constructor(private wsSocket:WebsocketService){
    this.wsSocket.sendMessage("connect:1,username:yvan,getEntries:1")
    this.wsSocket.onMessage((data:any)=>{
      console.log(data);
      this.entries.next("hey")
      this.wsSocket.sendMessage("message")
    })
  }

  submitEntry(entry:string){
    this.wsSocket.sendMessage("connect:0,entry:1,"+entry)
  }

  getEntries(){
    return this.entries.asObservable()
  }
}
