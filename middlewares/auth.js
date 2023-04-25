const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/UnAuthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnAuthorizedError('Необходима авторизация'));
    return;
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, '60295c22daed02f6e45e7ecb6eeaa19cf49621c7afc76fd508d982b4bccc1335');
  } catch (err) {
    next(new UnAuthorizedError('Необходима авторизация'));
    return;
  }
  req.user = payload;
  next();
};

module.exports = auth;
