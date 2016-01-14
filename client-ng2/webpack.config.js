module.exports = {
  entry: [
    "./vendor.ts",
    "./app.ts"
  ],
  output: {
    path: "../public",
    filename: "generated-app.js"
  },
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
