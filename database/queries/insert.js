const insertData = async (postgres, table, data) => {
  try {
    const newData = await postgres(table).returning('*').insert(data);
    return newData;
  } catch (err) {
    throw err;
  }
};

module.exports = { insertData };
