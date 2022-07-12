const { getTopics } = require('../database/topics');

const topicsGetControl = (res) => async (postgres) => {
  try {
    const topics = await getTopics(postgres);
    res.json(topics);
  } catch (err) {
    res.status(400), json(err.message);
  }
};

module.exports = { topicsGetControl };
