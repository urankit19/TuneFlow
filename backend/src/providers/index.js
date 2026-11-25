const audiusAdapter = require("./audius/audiusAdapter");

const providers = {
  audius: {
    name: "Audius",
    enabled: true,
    adapter: audiusAdapter
  },

  jamendo: {
    name: "Jamendo",
    enabled: false,
    adapter: null
  },

  youtube: {
    name: "YouTube",
    enabled: false,
    adapter: null
  }
};

module.exports = providers;