const { get, set } = require('../database');

// Initialiser les catégories par défaut
async function initCategories() {
  await set('infos.category.size', 1);
  await set('infos.category.0.name', "Maison");
}

// Récupérer la liste des catégories
async function getCategoryList() {
  const size = Number(await get("infos.category.size"));
  const categories = [];
  for (let i = 0; i < size; i++) {
    categories.push(await get(`infos.category.${i}.name`));
  }
  return categories;
}

// Changer l'ordre d'une catégorie
async function changeCategoryId(up, categoryId) {
  if(up && categoryId==0) return
  if(up){
    let courA = await get(`infos.category.${(categoryId-1)}.name`)
    let courB = await get(`infos.category.${categoryId}.name`)
    await set(`infos.category.${categoryId}.name`, courA)
    await set(`infos.category.${(categoryId-1)}.name`, courB)
  }
  else{
    let catSize = Number(await get(`infos.category.size`))
    if((categoryId+1)==catSize) return
    let courA = await get(`infos.category.${(categoryId+1)}.name`)
    let courB = await get(`infos.category.${categoryId}.name`)
    await set(`infos.category.${categoryId}.name`, courA)
    await set(`infos.category.${(categoryId+1)}.name`, courB)
  }
}

// Ajouter une catégorie
async function addCategory(categoryName) {
  const size = Number(await get('infos.category.size'));
  await set(`infos.category.${size}.name`, categoryName);
  await set('infos.category.size', (size+1));
}

module.exports = {
  initCategories,
  getCategoryList,
  changeCategoryId,
  addCategory
};
