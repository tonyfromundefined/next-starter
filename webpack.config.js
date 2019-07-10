const fs = require("fs");
const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const WebpackbarPlugin = require("webpackbar");

const files = fs.readdirSync(path.resolve(__dirname, "./serverless"));

const entry = {};

for (const file of files) {
  entry[file.split(".")[0]] = path.resolve(__dirname, "./serverless", file);
}

module.exports = {
  entry,
  mode: "production",
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
    ],
  },
  optimization: {
    minimize: false,
  },
  output: {
    filename: `[name].js`,
    libraryTarget: "commonjs",
    path: path.resolve(__dirname, "./dist/serverless/bundles"),
  },
  plugins: [
    new WebpackbarPlugin({
      color: "#fa5252",
      name: "Serverless (Production)",
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  stats: "errors-only",
  target: "node",
};
