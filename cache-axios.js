const axios = require("axios");
const { setupCache } = require("axios-cache-adapter");

const cache = setupCache({
  maxAge: 15 * 60 * 1000,
});

module.exports = axios.create({
  adapter: cache.adapter,
});
