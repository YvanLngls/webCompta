const { get, set } = require('../database');

async function initTable() {
    await set("infos.size", 2)
    await set("infos.0","glo")
    await set("infos.1","ban")

    await set("infos.lastTable", 0)

    await set("ban.infos.type",1)
    await set("ban.infos.size",0)
    await set("ban.infos.balance","0.00")
    await set("ban.infos.name","Banque")

    await set("glo.infos.type",0)
    await set("glo.infos.size",0)
    await set("glo.infos.balance","0.00")
    await set("glo.infos.name","Global")
}

async function getLastTable(){
    let lastTableId = Number(await get('infos.lastTable'));
    let table = await get(`infos.${lastTableId}`)
    return table;
}

async function changeLastTable(id) {
    await set(`infos.lastTable`, id)
}

async function getListTableName() {
    let tableNames = []
    let tableFullNames = []
    let infosSize = Number(await get("infos.size"))
    for(let i = 0; i<infosSize; i++){
        let cour = await get(`infos.${i}`)
        tableNames.push(cour)
        tableFullNames.push(await get(`${cour}.infos.name`))
    }
    return {tableName:tableNames, tableFullName:tableFullNames}
}

async function getListTableSize(){
    let listTableSize = []
    let infosSize = Number(await get(`infos.size`))
    for(let i = 0; i<infosSize; i++){
        let shortName = await get(`infos.${i}`)
        listTableSize.push(await get(`${shortName}.infos.size`))
    }
    return {listTableSize:listTableSize}
}

async function changeTableId(id, up) {
    if(up && id<=0) return
    if(up){
        let courA = await get(`infos.${(id-1)}`)
        let courB = await get(`infos.${id}`)
        await set(`infos.${id}`, courA)
        await set(`infos.${(id-1)}`, courB)
    }
    else {
        let tableSize = Number(await get('infos.size'))
        if((id+1)==tableSize) return
        let courA = await get(`infos.${(id+1)}`)
        let courB = await get(`infos.${id}`)
        await set(`infos.${id}`, courA)
        await set(`infos.${(id+1)}`, courB)
    }
}

async function addTable(fullName, shortName) {
    let tableSize = Number(await get("infos.size"))
    await set(`infos.${tableSize}`, shortName)
    tableSize++
    await set(`infos.size`, tableSize)
    await set(`${shortName}.infos.name`, fullName)
    await set(`${shortName}.infos.type`, 1)
    await set(`${shortName}.infos.size`, 0)
}

async function getEntries() {
    let table = await getLastTable()
    let entries = []
    let tableSize = Number(await get(`${table}.infos.size`))
    for(let i = 0; i<tableSize; i++){
        let entryData = {
            entryType: await get(`${table}.${i}.type`),
            entryDate: await get(`${table}.${i}.date`),
            entryValue: await get(`${table}.${i}.value`),
            entryNote: await get(`${table}.${i}.note`),
            entryCategory: await get(`${table}.${i}.category`),
        }
        entries.push(entryData);
    }
    return entries
}

async function getTableType() {
    let table = await getLastTable()
    let tableType = Number(await get(`${table}.infos.type`))
    return tableType
}

async function getTableFullName() {
    let table = await getLastTable()
    let tableFullName = await get(`${table}.infos.name`)
    return tableFullName
}

async function getTableBalance() {
    let table = await getLastTable()
    let tableBalance = Number(await get(`${table}.infos.balance`))
    return tableBalance
}

async function addEntry(data) {
    let table = await getLastTable()
    let tableSize = Number(await get(`${table}.infos.size`))
    await set(`${table}.${tableSize}.type`, data.entryType.toString())
    await set(`${table}.${tableSize}.date`, data.entryDate.toString())
    await set(`${table}.${tableSize}.value`, data.entryValue.toString())
    await set(`${table}.${tableSize}.note`, data.entryNote.toString())
    await set(`${table}.${tableSize}.category`, data.entryCategory.toString())
    await set(`${table}.infos.size`, (tableSize+1))
}

// Compute and get the total of incomes and expenses
async function getTotal() {
    let table = await getLastTable()
    let tableSize = Number(await get(`${table}.infos.size`))
    let totalIncome = 0, totalExpense = 0
    for(let i = 0; i<tableSize; i++){
        let type = await get(`${table}.${i}.type`)
        let value = await get(`${table}.${i}.value`)
        if(type==='false') totalIncome+=value
        else totalExpense+=value
    }
    return {totalIncome:totalIncome, totalExpense:totalExpense}
}

module.exports = {
    initTable,
    getLastTable,
    changeLastTable,
    getListTableName,
    getListTableSize,
    changeTableId,
    addTable,
    getEntries,
    getTableType,
    getTableFullName,
    getTotal,
    getTableBalance,
    addEntry
}