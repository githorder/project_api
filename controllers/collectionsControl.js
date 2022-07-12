const { checkInputs } = require('./checkInputs');
const {
  createCollection,
  getCollectionsByID,
  getLargestCollections,
} = require('../database/collections');

const userCollectionsGetControl = (req, res) => async (postgres) => {
  try {
    const { id } = req.params;
    const userCollections = await getCollectionsByID(postgres, id);
    res.json(userCollections);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const usersCollectionsGetControl = (_, res) => async (postgres) => {
  try {
    const largestCollections = await getLargestCollections(postgres);
    res.json(largestCollections.slice(0, 5));
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const collectionsPostControl = (req, res) => async (postgres) => {
  try {
    const { email, collectionname, description, topic } = req.body;
    const { id } = req.params;
    checkInputs(email, collectionname, description, topic);
    await createCollection(postgres, req.body);
    const userCollections = await getCollectionsByID(postgres, id);
    res.json(userCollections);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

module.exports = {
  userCollectionsGetControl,
  usersCollectionsGetControl,
  collectionsPostControl,
};
