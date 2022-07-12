const res = require('express/lib/response');
const { insertData } = require('./queries/insert');
const { selectDataByOrder, selectDataWhere } = require('./queries/select');

const insertItem = async (trx, itemData) => {
  try {
    const [newItem] = await insertData(trx, 'items', {
      ...itemData,
      publication: new Date(),
    });
    await insertData(trx, 'likes', {
      email: itemData.email,
      likeditem: itemData.itemname,
      collectionname: itemData.collectionname,
      description: itemData.description,
    });
    return newItem;
  } catch (err) {
    throw err;
  }
};

const makeTransactionExistingItem = (itemData) => async (trx) => {
  try {
    await selectDataWhere(trx, 'item', ['itemname'], {
      itemname: itemData.itemname,
    });
    return await insertItem(trx, itemData);
  } catch (err) {
    throw err;
  }
};

const makeTransactionNewItem = (itemData) => async (trx) => {
  try {
    await insertData(trx, 'item', {
      itemname: itemData.itemname,
    });
    return await insertItem(trx, itemData);
  } catch (err) {
    throw err;
  }
};

const createItem = async (postgres, itemData) => {
  try {
    return await postgres.transaction(makeTransactionExistingItem(itemData));
  } catch (err) {
    return await postgres.transaction(makeTransactionNewItem(itemData));
  }
};

const getRecentItems = async (postgres) => {
  try {
    return await selectDataByOrder(
      postgres,
      'items',
      ['*'],
      'publication',
      'desc'
    );
  } catch (err) {
    throw err;
  }
};

const getItemsByID = async (postgres, id) => {
  try {
    const [user] = await selectDataWhere(postgres, 'users', ['email'], { id });
    return await selectDataWhere(postgres, 'items', ['*'], {
      email: user.email,
    });
  } catch (err) {
    throw err;
  }
};

module.exports = { createItem, getRecentItems, getItemsByID };
