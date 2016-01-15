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
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  }
};
