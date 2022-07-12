const { insertData } = require('./queries/insert');
const { selectDataWhere, selectDataByOrder } = require('./queries/select');

const insertCollection = async (postgres, collectionData) => {
  try {
    return await insertData(postgres, 'collections', collectionData);
  } catch (err) {
    throw err;
  }
};

const makeTransactionExistingCollection = (collectionData) => async (trx) => {
  try {
    await selectDataWhere(
      trx,
      'collection',
      ['collectionname', 'description'],
      { collectionname: collectionData.collectionname }
    );
    return await insertCollection(trx, collectionData);
  } catch (err) {
    throw err;
  }
};

const makeTransactionNewCollection = (collectionData) => async (trx) => {
  try {
    await insertData(trx, 'collection', {
      collectionname: collectionData.collectionname,
      description: collectionData.description,
    });
    return await insertCollection(trx, collectionData);
  } catch (err) {
    throw err;
  }
};

const createCollection = async (postgres, collectionData) => {
  try {
    return await postgres.transaction(
      makeTransactionExistingCollection(collectionData)
    );
  } catch (err) {
    return await postgres.transaction(
      makeTransactionNewCollection(collectionData)
    );
  }
};

const getLargestCollections = async (postgres) => {
  try {
    return await selectDataByOrder(
      postgres,
      'collections',
      ['*'],
      'items',
      'desc'
    );
  } catch (err) {
    throw err;
  }
};

const getCollectionsByID = async (postgres, id) => {
  try {
    const [user] = await selectDataWhere(postgres, 'users', ['email'], { id });
    return await selectDataWhere(postgres, 'collections', ['*'], {
      email: user.email,
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createCollection,
  getLargestCollections,
  getCollectionsByID,
};
