const { redisClient, getValue, setValue } = require('../database');
const { categories } = require('./categories');

async function initInfos() {
    categories.initCategories();
}

module.exports = {
    initInfos,
}