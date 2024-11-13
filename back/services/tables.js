const { get, set } = require('../database');

async function getLastTable(){
    let lastTableId = Number(await get('infos.lastTable'));
    let table = await get(`infos.${lastTableId}`)
    return table;
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
    let tableType = await get(`${table}.infos.type`)
    return tableType
}

async function getTableFullName() {
    let table = await getLastTable()
    let tableFullName = await get(`${table}.infos.name`)
    return tableFullName
}

async function getTableBalance() {
    let table = await getLastTable()
    let tableBalance = Number(await get())
    return tableBalance
}

module.exports = {
    getLastTable,
    getEntries,
    getTableType,
    getTableFullName,
    getTableBalance,
}