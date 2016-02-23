var path = require("path");

module.exports = {
  output: {
    path: path.join(__dirname, "../public"),
    filename: "generated-app.js"
  },
  module: {
    loaders: [
      {
        loader: "elm-webpack",
        test: /\.elm?$/,
        exclude: [/elm-stuff/, /node_modules/]
      }
    ],
    
    noParse: /\.elm$/
  }
};
