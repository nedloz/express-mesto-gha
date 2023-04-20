const http2 = require('node:http2');

const BAD_REQUEST = http2.constants.HTTP_STATUS_BAD_REQUEST;
const NOT_FOUND = http2.constants.HTTP_STATUS_NOT_FOUND;
const SERVER_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
};
