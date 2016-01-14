var path = require("path");
var webpack = require("webpack");

var definePlugin = new webpack.DefinePlugin({
  "process.env": {
    "DEV_ENV": "true"
  }
});

module.exports = {
  devtool: "source-map",
  entry: [
    "webpack-dev-server/client?http://localhost:3013",
    /* "webpack/hot/only-dev-server", */
    "./vendor.js",
    "./app.ts"
  ],
  output: {
    path: path.join(__dirname, "../public"),
    filename: "generated-app.js"
  },
  plugins: [
  /*
    new webpack.HotModuleReplacementPlugin(),
  */
    new webpack.NoErrorsPlugin(),
    definePlugin
  ],
  resolve: {
    extensions: ["", ".js", ".ts"]
  },
  module: {
    loaders: [
      { test: /\.ts$/,  loader: 'ts', exclude: /node_modules/ },
      { test: /\.js$/,  loader: 'babel', exclude: /node_modules/ }
    ]
  },
  noParse: [
    /rtts_assert\/src\/rtts_assert/
  ]
};
