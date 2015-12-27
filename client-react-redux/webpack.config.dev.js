var path = require("path");
var webpack = require("webpack");

var definePlugin = new webpack.DefinePlugin({
  "process.env": {
    "DEV_ENV": "true"
  }
});

module.exports = {
  devtool: "eval",
  entry: [
    "webpack-dev-server/client?http://localhost:3013",
    /* "webpack/hot/only-dev-server", */
    "./app.js"
  ],
  output: {
    path: path.join(__dirname, "../public"),
    filename: "generated-app.js"
  },
  plugins: [
  /*
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  */
    definePlugin
  ],
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  module: {
    loaders: [
      {
        loader: "babel-loader",
        test: /\.jsx?$/,
        exclude: /node_modules/
      }
    ]
  }
};
