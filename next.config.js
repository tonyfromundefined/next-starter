const path = require('path')
const withOptimizedImages = require('next-optimized-images')
const withTypescript = require('@zeit/next-typescript')

module.exports = (
  withOptimizedImages(
    withTypescript({
      target: 'serverless',
      distDir: '../dist',
      imagesName: '[hash].[ext]',
      webpack(config) {
        config.resolve.alias['~'] = path.resolve(__dirname, './src')
        config.resolve.alias['~~'] = path.resolve(__dirname, './src/services')

        return config
      },
    })
  )
)
