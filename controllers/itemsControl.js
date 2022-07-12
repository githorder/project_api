const { checkInputs } = require('./checkInputs');
const {
  createItem,
  getRecentItems,
  getItemsByID,
} = require('../database/items');

const itemsPostControl = (req, res) => async (postgres) => {
  try {
    const { itemname, tag, collectionname, description, email } = req.body;
    checkInputs(itemname, tag, collectionname, description, email);
    const newItem = await createItem(postgres, req.body);
    res.json(newItem);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const userItemsGetControl = (req, res) => async (postgres) => {
  try {
    const { id } = req.params;
    const userItems = await getItemsByID(postgres, id);
    res.json(userItems);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const usersItemsGetControl = (_, res) => async (postgres) => {
  try {
    const recentItems = await getRecentItems(postgres);
    res.json(recentItems.slice(0, 5));
  } catch (err) {
    res.status(400).json(err.message);
  }
};

module.exports = {
  itemsPostControl,
  userItemsGetControl,
  usersItemsGetControl,
};
