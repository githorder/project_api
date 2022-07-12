const { createComment, getComments } = require('../database/comments');

const commentsPostControl = (req, res) => async (postgres) => {
  try {
    await createComment(postgres, req.body);
    const comments = await getComments(postgres);
    res.json(comments);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const itemCommentsGetControl = (req, res) => async (postgres) => {
  try {
    await getComments(postgres);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

module.exports = { commentsPostControl, itemCommentsGetControl };
