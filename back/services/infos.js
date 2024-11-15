const { get, set, deleteAll } = require('../database');
const { initCategories } = require('./categories');
const { initTable } = require('./tables')

async function initInfos() {
    await deleteAll()
    await set("infos.initialized", 1)
    await initCategories();
    await initTable();
}

async function getGeneralInfos() {
    let initialized = await get('infos.initialized')
    if(initialized==null) initialized = -1
    let categorySize = Number(await get('infos.category.size'))
    return {initialized:initialized, categorySize:categorySize}
}

module.exports = {
    initInfos,
    getGeneralInfos,
}