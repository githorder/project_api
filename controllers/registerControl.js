const { createUser } = require('../database/register');
const { checkInputs } = require('./checkInputs');

const capitilizeName = (name) => {
  return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
};

const registerControl = (req, res) => async (postgres) => {
  try {
    const { name, email, password } = req.body;
    checkInputs(name, email, password);
    const newUsers = await createUser(postgres, {
      name: capitilizeName(name),
      email,
      password,
    });
    return res.json(newUsers[0]);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

module.exports = { registerControl };
