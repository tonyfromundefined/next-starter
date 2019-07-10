const fs = require('fs')
const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const WebpackbarPlugin = require('webpackbar')

const files = fs.readdirSync(path.resolve(__dirname, './serverless'))

const entry = {}

for (const file of files) {
  entry[file.split('.')[0]] = path.resolve(__dirname, './serverless', file)
}

module.exports = {
  mode: 'production',
  entry,
  output: {
    path: path.resolve(__dirname, './dist/serverless/bundles'),
    filename: `[name].js`,
    libraryTarget: 'commonjs',
  },
  target: 'node',
  optimization: {
		minimize: false,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
    ],
  },
  stats: 'errors-only',
  plugins: [
    new WebpackbarPlugin({
      name: 'Serverless (Production)',
      color: '#fa5252',
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
}
