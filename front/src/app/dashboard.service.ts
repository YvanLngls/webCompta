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
    this.wsSocket.sendMessage("connect:1,username:yvan,getEntries:1")
    this.wsSocket.onMessage((data:string)=>{
      let inMsg = data.split(",")
      this.getEntriesSocket(inMsg)
      console.log(data);
      //this.entries.next("hey")
      //this.wsSocket.sendMessage("message")
    })
  }

  private getEntriesSocket(inMsg:string[]){
    let getEntriesFragmentId = this.searchFragmentId(inMsg, "getEntries")
    if(getEntriesFragmentId<0) return
    if(inMsg[getEntriesFragmentId].split(":")[1]==="1"){
      // On veut bien getEntries

      let sizeFragmentId = this.searchFragmentId(inMsg, "size")
      if(sizeFragmentId<0) return
      let size = Number(inMsg[sizeFragmentId].split(":")[1])
      this.entriesSize.next(size);
      for(let i = 0; i<size; i++){
        let array = []
        let entryTypeCourFragmentId = this.searchFragmentId(inMsg, "entryType"+i)
        let entryDateCourFragmentId = this.searchFragmentId(inMsg, "entryDate"+i)
        let entryValueCourFragmentId = this.searchFragmentId(inMsg, "entryValue"+i)
        let entryNoteCourFragmentId = this.searchFragmentId(inMsg, "entryNote"+i)
        array.push(inMsg[entryTypeCourFragmentId].split(":")[1])
        array.push(inMsg[entryDateCourFragmentId].split(":")[1])
        array.push(inMsg[entryValueCourFragmentId].split(":")[1])
        array.push(inMsg[entryNoteCourFragmentId].split(":")[1])
        this.entries.next(array)
      }
    }

  }

  private searchFragmentId(inMsg:string[], fragmentId:string){
    for(let i = 0; i<inMsg.length; i++){
      if(inMsg[i].split(":")[0]===fragmentId) return i
    }
    return -1
  }

  submitEntry(entry:string){
    this.wsSocket.sendMessage("connect:0,entry:1,"+entry)
  }

  getEntries(){
    return this.entries.asObservable()
  }
}
