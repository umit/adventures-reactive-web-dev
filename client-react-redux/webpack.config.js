var webpack = require("webpack");
var definePlugin = new webpack.DefinePlugin({
  "process.env": {
    "DEV_ENV": JSON.stringify(JSON.parse(process.env.DEV || "false"))
  }
});

module.exports = {
  entry: "./app.js",
  output: {
    path: "../public",
    filename: "generated-app.js"
  },
  module: {
    loaders: [
      {
        loader: "babel-loader",
        test: /\.jsx?$/,
        exclude: /node_modules/
      }
    ]
  },
  plugins: [ definePlugin ]
};
