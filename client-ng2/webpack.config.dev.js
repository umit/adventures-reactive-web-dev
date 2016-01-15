var path = require("path");
var webpack = require("webpack");

module.exports = {
  devtool: "source-map",
  entry: [
    "webpack-dev-server/client?http://localhost:3013",
    /* "webpack/hot/only-dev-server", */
    "./vendor.ts",
    "./app.dev.ts"
  ],
  output: {
    path: path.join(__dirname, "../public"),
    filename: "generated-app.js"
  },
  plugins: [
  /*
    new webpack.HotModuleReplacementPlugin(),
    definePlugin,
  */
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ["", ".js", ".ts"]
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: "ts", exclude: /node_modules/ },
      { test: /\.js$/, loader: "babel", exclude: /node_modules/ }
    ]
  }
};
