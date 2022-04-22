const { readFileSync } = require("fs");
const { join } = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: __dirname + "/public",
    publicPath: "/",
    filename: "app.js",
  },
  target: "web",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  devtool: "cheap-module-source-map",
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    static: {
      directory: join(__dirname, "public"),
    },
    hot: true,
    port: 8082,
  },
};
