const { getCategoryList, changeCategoryId, addCategory } = require('../services/categories');
const { getEntries, getTableFullName, getTableBalance, addEntry, addTable, changeTableId, changeLastTable, getListTableSize } = require('../services/tables');

async function handleMessage(message, ws) {
    const data = JSON.parse(message);
    console.log(data);
  
    switch(data.messageType) {

        // Initialisation
        case 'initClient':
            // TODO
            break;
        case 'initDbClient':
            // TODO
            break;

        // Général
        case 'getGeneralInfosClient':
            // TODO
            break;

        // Tables
        case 'getTableInfosClient':
            getTableInfosServer(ws)
            break;
        case 'getTableChoiceClient':
            getListTableNameServer(ws)
            break;
        case 'changeTableClient':
            changeLastTable(data.tableId)
            break;
        case 'changeTableIdClient':
            changeTableId(data.tableId, data.up)
            break;
        case 'addTableClient':
            addTable(data.fullName, data.shortName)
            break;

        // Entrées
        case 'getEntriesClient':
            getEntriesServer(ws)
            break;
        case 'submitEntryClient':
            addEntry(data.data)
            break;
        case 'getTotalClient':
            getTotalServer(ws);
            break;

        // Catégories
        case 'getCategoryListClient':
            await getCategoryListServer(ws);
            break;
        case 'changeCategoryIdClient':
            await changeCategoryId(data.up, data.categoryId);
            break;
        case 'addCategoryClient':
            await addCategory(data.categoryName);
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
    const data = getListTableName()
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