import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  userName = "Yvan"
  private entriesType = new Subject<string[]>()
  private entriesDate = new Subject<string[]>()
  private entriesValue = new Subject<string[]>()
  private entriesNote = new Subject<string[]>()
  private tableChoice = new Subject<string[]>()

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
          // console.log(JSON.stringify(data.data))
          let types: string[] = [], dates: string[] = [], values: string[] = [], notes: string[] = []
          data.data.forEach((e: { entryType: string; entryDate: string; entryValue: string; entryNote: string; }) => {
            types.push(e.entryType)
            dates.push(e.entryDate)
            values.push(e.entryValue)
            notes.push(e.entryNote)
          })
          this.entriesType.next(types)
          this.entriesDate.next(dates)
          this.entriesValue.next(values)
          this.entriesNote.next(notes)
          break
        case "getTableChoiceServer":
          let choice: string[] = []
          data.data.forEach((e: string)=>{
            choice.push(e)
          })
          this.tableChoice.next(choice)
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

  getEntriesType(){
    return this.entriesType.asObservable()
  }
  getEntriesDate(){
    return this.entriesDate.asObservable()
  }
  getEntriesValue(){
    return this.entriesValue.asObservable()
  }
  getEntriesNote(){
    return this.entriesNote.asObservable()
  }

  getTableChoice(){
    return this.tableChoice.asObservable()
  }
}
