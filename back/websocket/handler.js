const { getCategoryList, changeCategoryId, addCategory } = require('../services/categories');
const { getGeneralInfos, initInfos } = require('../services/infos');
const { getEntries, getTableFullName, getTableBalance, addEntry,
    addTable, changeTableId, changeLastTable, getListTableSize,
    getListTableName, getTableType, getTotal } = require('../services/tables');

async function handleMessage(message, ws) {
    const data = JSON.parse(message);
    console.log(data);
  
    switch(data.messageType) {

        // Initialisation
        case 'initClient':
            // TODO
            break;
        case 'initDbClient':
            await initInfos()
            await getGeneralInfosServer(ws)
            await getTableInfosServer(ws)
            await getListTableNameServer(ws)
            await getCategoryListServer(ws);
            break;

        // Général
        case 'getGeneralInfosClient':
            await getGeneralInfosServer(ws)
            break;

        // Tables
        case 'getTableInfosClient':
            await getTableInfosServer(ws)
            break;
        case 'getTableChoiceClient':
            await getListTableNameServer(ws)
            break;
        case 'changeTableClient':
            await changeLastTable(data.tableId)
            await getEntriesServer(ws)
            break;
        case 'changeTableIdClient':
            await changeTableId(data.tableId, data.up)
            await getListTableNameServer(ws)
            break;
        case 'addTableClient':
            await addTable(data.fullName, data.shortName)
            await getListTableNameServer(ws)
            break;

        // Entrées
        case 'getEntriesClient':
            await getEntriesServer(ws)
            break;
        case 'submitEntryClient':
            await addEntry(data.data)
            await getEntriesServer(ws)
            break;
        case 'getTotalClient':
            await getTotalServer(ws);
            break;

        // Catégories
        case 'getCategoryListClient':
            await getCategoryListServer(ws);
            break;
        case 'changeCategoryIdClient':
            await changeCategoryId(data.up, data.categoryId);
            await getCategoryListServer(ws);
            break;
        case 'addCategoryClient':
            await addCategory(data.categoryName);
            await getCategoryListServer(ws);
            break;

        // Défaut
        default:
            console.warn(`Unknown message: ${data.messageType}`);
            break;

    }
}

function handleClose(ws, clients) {
    clients.splice(clients.indexOf(ws), 1);
    console.log('Client removed from client list');
}

module.exports = {
handleMessage,
handleClose
};


async function getCategoryListServer(ws) {
    const categories = await getCategoryList()
    ws.send(JSON.stringify({ messageType: 'getCategoryListServer', data: categories }))
}

async function getEntriesServer(ws) {
    const tableType = await getTableType()
    const entries = await getEntries()
    const tableFullName = await getTableFullName()
    const tableBalance = await getTableBalance()
    ws.send(JSON.stringify({ 
        messageType:'getEntriesServer',
        tableType:tableType,
        tableFullName: tableFullName,
        tableBalance: tableBalance,
        data:entries,
    }))
}

async function getTotalServer(ws) {
    const total = await getTotal()
    ws.send(JSON.stringify({
        messageType:'getTotalServer',
        totIncome:total.totalIncome,
        totExpense:total.totalExpense
    }))
}

async function getListTableNameServer(ws) {
    const data = await getListTableName()
    ws.send(JSON.stringify({
        messageType:'getTableChoiceServer',
        data:data.tableFullName
    }))
}

async function getTableInfosServer(ws) {
    const listTableSize = await getListTableSize()
    ws.send(JSON.stringify({
        messageType:`getTableInfosServer`,
        listTableSize:listTableSize.listTableSize
    }))
}

async function getGeneralInfosServer(ws) {
    const infos = await getGeneralInfos()
    ws.send(JSON.stringify({
        messageType:'getGeneralInfosServer',
        initialized:infos.initialized,
        categorySize: infos.categorySize
    }))
}