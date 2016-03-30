var path = require("path");
// var webpack = require("webpack");

module.exports = {
  devtool: "eval",
  entry: [
    "webpack-dev-server/client?http://localhost:3013",
    /* "webpack/hot/only-dev-server", */
    "./main.js"
  ],
  output: {
    path: path.join(__dirname, "../public"),
    filename: "generated-app.js"
  },
  /*
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  */
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  module: {
    loaders: [
      {
        //loaders: ["react-hot", "babel-loader"],
        loader: "babel-loader",
        test: /\.jsx?$/,
        exclude: /node_modules/
      }
    ]
  }
};
