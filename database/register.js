const bcrypt = require('bcrypt');

const { joinTables } = require('./queries/select');
const { insertData } = require('./queries/insert');

const saltRounds = 10;

const createHash = async (password) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (err) {
    throw err;
  }
};

const makeUserTransaction = (userData) => async (trx) => {
  try {
    const { name, email, password } = userData;
    await insertData(trx, 'users', { name, email });
    await insertData(trx, 'login', {
      email,
      password: await createHash(password),
    });
    await insertData(trx, 'roles', { email });
    return await joinTables(
      trx,
      'users',
      'roles',
      {
        'users.email': 'roles.email',
      },
      { 'users.email': email }
    );
  } catch (err) {
    throw err;
  }
};

const createUser = (postgres, userData) => {
  return postgres.transaction(makeUserTransaction(userData));
};

module.exports = { createUser };
