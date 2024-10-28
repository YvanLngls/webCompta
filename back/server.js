const express = require('express')
const { Server } = require('ws')

const app = express()
const port = 3003

app.use(express.static('public'))

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

const wss = new Server({ server })
let clients = []
let usernames = []
let entries = []

wss.on('connection', (ws) => {
  console.log('Client connected')
  clients.push(ws)
  let id = clients.length-1
  ws.on('message', (message) => {
    console.log(message.toString())
    inMsg = message.toString().split(",")
    establishConnection(inMsg, clients, id)

    getEntries(inMsg, clients, id)

    addEntry(inMsg)

    
  })

  ws.on('close', () => {
    console.log('Client disconnected')
    clients = clients.filter(client => client!==ws)
  })
})

function getEntries(inMsg, clients, id){
  let getEntriesFragmentId = searchFragmentId(inMsg, "getEntries")
  if(getEntriesFragmentId<0) return
  if(inMsg[getEntriesFragmentId].split(":")[1]==="1"){
    let size = entries.length
    let entriesString = ""
    for(let i = 0; i<size; i++){
      let entriesStringCour = ",entryType"+i+":"+entries[4*i]
      +",entryDate"+i+":"+entries[4*i+1]
      +",entryValue"+i+":"+entries[4*i+2]
        +",entryNote"+i+":"+entries[4*i+3]
        entriesString+=entriesStringCour
    }
    clients.at(id).send("getEntries:1,size:"+size+entriesString)
  }
}

function addEntry(inMsg){
  let entryFragmentId = searchFragmentId(inMsg, "entry")
  if(entryFragmentId<0) return
  
  if(inMsg[entryFragmentId].split(":")[1]==="1"){
    //On veut bien ajouter une entrée ! =>  
    let entryTypeFragmentId = searchFragmentId(inMsg, "entryType")
    let entryDateFragmentId = searchFragmentId(inMsg, "entryDate")
    let entryValueFragmentId = searchFragmentId(inMsg, "entryValue")
    let entryNoteFragmentId = searchFragmentId(inMsg, "entryNote")
    if(entryTypeFragmentId<0 || entryDateFragmentId<0 || entryValueFragmentId<0 || entryNoteFragmentId<0) return
    let entry = []
    entry.push(inMsg[entryTypeFragmentId].split(":")[1])
    entry.push(inMsg[entryDateFragmentId].split(":")[1])
    entry.push(inMsg[entryValueFragmentId].split(":")[1])
    entry.push(inMsg[entryNoteFragmentId].split(":")[1])
    entries.push(entry)
    console.log("new entry "+entries.length)

    let size = entries.length
    let entriesString = ""
    for(let i = 0; i<size; i++){
      let entriesStringCour = ",entryType"+i+":"+entries[4*i]
      +",entryDate"+i+":"+entries[4*i+1]
      +",entryValue"+i+":"+entries[4*i+2]
        +",entryNote"+i+":"+entries[4*i+3]
        entriesString+=entriesStringCour
    }
    console.log("getEntries")
    broadcast("getEntries:1,size:"+size+entriesString)
    // clients.at(id).send("getEntries:1,size:"+size+entriesString)
  }
}

function establishConnection(inMsg, clients, id){
  let connectFragmentId = searchFragmentId(inMsg, "connect")
  if(connectFragmentId<0) return

  if(inMsg[connectFragmentId].split(":")[1]==="1"){
      //On veut bien faire une connection ! =>
      let usernameFragmentId = searchFragmentId(inMsg, "username")
      if(usernameFragmentId<0) return

      usernames.push(inMsg[usernameFragmentId].split(":")[1])

      clients.at(id).send("id."+id)
  }
}


function searchFragmentId(inMsg, fragmentId){
    for(let i = 0; i<inMsg.length; i++){
        if(inMsg[i].split(":")[0] === fragmentId){
            return i;
        }
    }
    return -1;
}





function broadcast(message){
  clients.forEach(client =>{
    client.send(message)
  })
}
