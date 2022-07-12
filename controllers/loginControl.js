const { loginUser } = require('../database/login');
const { checkInputs } = require('./checkInputs');

const loginControl = (req, res) => async (postgres) => {
  try {
    const { email, password } = req.body;
    checkInputs(email, password);
    const users = await loginUser(postgres, { email, password });
    res.json(users[0]);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

module.exports = { loginControl };
