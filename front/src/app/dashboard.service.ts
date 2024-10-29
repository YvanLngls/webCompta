import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  userName = "Yvan"
  private entries = new Subject<string[]>()
  private entriesSize = new Subject<number>()

  constructor(private wsSocket:WebsocketService){
    const initClient = {
      messageType:"initClient",
      username:this.userName,
    }
    this.wsSocket.sendMessage(JSON.stringify(initClient))
    this.wsSocket.onMessage((dataString:string)=>{
      const data = JSON.parse(dataString)
      switch(data.messageType){
        case "getEntriesServer":
          console.log(data.data)
          this.entries.next(data.data)
          break
        default:
          break
      }
    })
  }

  submitEntry(entry:any){
    const submitEntryClient = {messageType:"submitEntryClient",
      data:entry
    }
    this.wsSocket.sendMessage(JSON.stringify(submitEntryClient))
  }

  getEntries(){
    return this.entries.asObservable()
  }
}
