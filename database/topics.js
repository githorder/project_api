const { selectData } = require('./queries/select');

const getTopics = async (postgres) => {
  try {
    return await selectData(postgres, 'topics', ['*']);
  } catch (err) {
    throw err;
  }
};

module.exports = { getTopics };
