const { updateLike } = require('../database/likes');
const { checkInputs } = require('./checkInputs');

const likesPutControl = (req, res) => async (postgres) => {
  try {
    const { id } = req.params;
    const { isLiked, email, itemname, collectionname, description } = req.body;
    checkInputs(isLiked, email, itemname, collectionname, description);
    const [updatedLike] = await updateLike(postgres, id, req.body);
    res.json(updatedLike);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

module.exports = { likesPutControl };
