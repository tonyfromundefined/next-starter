const fs = require('fs')
const path = require('path')

const isProd = process.env.NODE_ENV === 'production'

const filenames = fs.readdirSync(path.resolve(__dirname, './src/serverless'))

const entries = []

for (const filename of filenames) {
  entries.push({
    [filename.split('.')[0]]: path.resolve(__dirname, './src/serverless', filename),
  })
}

module.exports = entries.map((entry) => ({
  mode: isProd ? 'production' : 'development',
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
  stats: 'errors-only',
}))
