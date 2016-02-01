var config = require("./webpack.config.common");

Object.assign(config, {
  entry: "./app.prod.js"
});

module.exports = config;
