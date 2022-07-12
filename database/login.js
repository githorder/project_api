const bcrypt = require('bcrypt');

const { selectDataWhere, joinTables } = require('./queries/select');

const compareHash = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    throw err;
  }
};

const checkPassword = async (password, logins) => {
  try {
    const isEqual = await compareHash(password, logins[0]?.password);
    if (!isEqual) throw new Error('user does not exist');
  } catch (err) {
    throw err;
  }
};

const makeTransaction =
  ({ email, password }) =>
  async (trx) => {
    try {
      const logins = await selectDataWhere(trx, 'login', ['password'], {
        email,
      });
      await checkPassword(password, logins);
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

const loginUser = async (postgres, userData) => {
  return await postgres.transaction(makeTransaction(userData));
};

module.exports = { loginUser };
