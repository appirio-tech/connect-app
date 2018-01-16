const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')

const defaultConfig = require('./default')

const dirname = path.resolve(__dirname, '../..')

module.exports = webpackMerge.strategy({
  entry: 'prepend' // to put 'react-hot-loader/patch' first
})(defaultConfig, {
  entry: [
    'react-hot-loader/patch'
  ],

  devtool: 'eval',

  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      loader: 'babel-loader',
      exclude: /node_modules\/(?!appirio-tech.*|topcoder|tc-)/,
      options: {
        babelrc: false,
        presets: [ ['env', { modules: false }], 'react', 'stage-2' ],
        plugins: [
          'lodash',
          // add react hot reloader
          'react-hot-loader/babel',
          'inline-react-svg'
        ],
        resolve: {
          alias: {
            Icons$: path.resolve(__dirname, 'Icons.jsx')
          }
        }
      }
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        {
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
        }
      ]
    }]
  },

  plugins: [
    // don't add HotModuleReplacementPlugin, because run webpack-dev-server with --hot param
    // otherwise this plugin will be added twice and cause bugs
    // new webpack.HotModuleReplacementPlugin(),

    new webpack.NamedModulesPlugin()
  ]
})
