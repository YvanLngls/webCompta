import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  userName = "Yvan"
  private tableType = new Subject<number>()
  private tableFullName = new Subject<string>()
  private tableBalance = new Subject<number>()
  private entriesType = new Subject<string[]>()
  private entriesDate = new Subject<string[]>()
  private entriesValue = new Subject<string[]>()
  private entriesNote = new Subject<string[]>()
  private tableChoice = new Subject<string[]>()
  private total = new Subject<string[]>()
  private listTableSize = new Subject<string[]>()

  constructor(private wsSocket:WebsocketService){
    const initClient = {
      messageType:"initClient",
      username:this.userName,
    }
    this.wsSocket.sendMessage(JSON.stringify(initClient))
    this.wsSocket.onMessage((dataString:string)=>{
      const data = JSON.parse(dataString)
      console.log(data)
      switch(data.messageType){
        case "getEntriesServer":
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
          this.tableType.next(data.tableType)
          this.tableFullName.next(data.tableFullName)
          this.tableBalance.next(data.tableBalance)
          break
        case "getTableChoiceServer":
          let choice: string[] = []
          data.data.forEach((e: string)=>{
            choice.push(e)
          })
          this.tableChoice.next(choice)
          break
        case "getTotalServer":
          let array = [data.totIncome, data.totExpense]
          this.total.next(array)
          break
        case "getTableInfosServer":
          this.listTableSize.next(data.listTableSize)
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

  changeTable(choice:number){
    const changeTableClient = {messageType:"changeTableClient", tableId:choice}
    this.wsSocket.sendMessage(JSON.stringify(changeTableClient))
  }
  changeTableId(up:boolean, id:number){
    const changeTableId = {messageType:"changeTableIdClient", up:up, tableId:id}
    this.wsSocket.sendMessage(JSON.stringify(changeTableId))
  }
  addTable(fullName:string, shortName:string){
    const addTable = {messageType:"addTableClient", fullName:fullName, shortName:shortName}
    this.wsSocket.sendMessage(JSON.stringify(addTable))
  }

  getTableType(){
    return this.tableType.asObservable()
  }
  getTableFullname(){
    return this.tableFullName.asObservable()
  }
  getTableBalance(){
    return this.tableBalance.asObservable()
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
  getTotal(){
    return this.total.asObservable()
  }
  getListTableSize(){
    return this.listTableSize.asObservable()
  }
}
