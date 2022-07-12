const { updateTo } = require('./queries/update');
const { selectDataWhere } = require('./queries/select');

const updateLike = async (
  postgres,
  id,
  { itemname, collectionname, description, isLiked }
) => {
  try {
    const [user] = await selectDataWhere(postgres, 'users', ['email'], { id });
    return await updateTo(
      postgres,
      'likes',
      ['liked'],
      { liked: isLiked },
      { email: user.email, likeditem: itemname, collectionname, description }
    );
  } catch (err) {
    throw err;
  }
};

module.exports = { updateLike };
