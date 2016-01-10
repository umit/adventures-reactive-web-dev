module.exports = {
  entry: "./app.ts",
  output: {
    path: "../public",
    filename: "generated-app.js"
  },
  resolve: {
    extensions: ["", ".js", ".ts"]
  },
  module: {
    loaders: [
      {
        loader: "ts-loader",
        test: /\.ts$/,
        exclude: /node_modules/
      }
    ]
  }
};
