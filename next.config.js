const withOptimizedImages = require('next-optimized-images')
const withTypescript = require('@zeit/next-typescript')

module.exports = (
  withOptimizedImages(
    withTypescript({
      target: 'serverless',
      distDir: '../dist',
      imagesName: '[hash].[ext]',
    })
  )
)
