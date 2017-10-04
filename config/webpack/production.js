const path              = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const CompressionPlugin = require('compression-webpack-plugin')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')

const defaultConfig = require('./default')

const dirname = path.resolve(__dirname, '../..')

module.exports = webpackMerge(defaultConfig, {
  devtool: 'source-map',

  module: {
    rules: [{
      test: /\.scss$/,
      use: ExtractCssChunks.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        },
        'resolve-url-loader',
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            includePaths: [
              path.join(dirname, '/node_modules/bourbon/app/assets/stylesheets'),
              path.join(dirname, '/node_modules/tc-ui/src/styles')
            ]
          }
        }]
      })
    }]
  },

  plugins: [
    // Do not include any .mock.js files if this is a build
    new webpack.IgnorePlugin(/\.mock\.js/),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true
    }),
    new CompressionPlugin({
      asset: '[file]',
      algorithm: 'gzip',
      regExp: /\.js$|\.css$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
})
