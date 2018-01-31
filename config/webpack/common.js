/**
 * Common part of webpack config specific to connect app
 *
 * This config is merged to development and production configs
 * and is not supposed to be used directly by itself.
 */
'use strict'

const _ = require('lodash')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const constants = require('../constants')

const dirname = path.resolve(__dirname, '../..')

module.exports = {
  /*
    Connect app has different output folder rather than topcoder-react-utils
    So update it
   */
  output: {
    path: path.join(dirname, '/dist'),
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    publicPath: '/'
  },

  resolve: {
    /*
      Connect app depends on `appirio-tech-react-components` which uses
      CoffeeScript so we have to add support for these formats
     */
    extensions: [
      '.coffee',
      '.litcoffee',
      '.cjsx'
    ],
    alias: {
    /*
      Connect app uses handlebars which has some issue with webpack
      We have to create an alias to concrete file in order to import it
     */
      handlebars: 'handlebars/dist/handlebars.min.js'
    }
  },

  module: {
    rules: [{
      /*
        Connect app depends on `appirio-tech-react-components` which uses
        CoffeeScript so we have to add support for it
       */
      test: /\.(coffee|litcoffee|cjsx)$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: ['env', 'react', 'stage-2'],
            plugins: ['lodash']
          }
        },
        'coffee-loader',
        'cjsx-loader'
      ]
    }, {
      /*
        Without this rule there are lots of SVG issues
      */
      test: /\.svg$/,
      loader: 'file-loader'
    }],
  },

  plugins: [
    /*
      Connect app has a custom html template file, so we use it
     */
    new HtmlWebpackPlugin({
      template: path.join(dirname, '/src/index.html'),
      inject: 'body'
    }),

    /*
      Connect app requires a lot of env vars which are defined in constants.

      WARNING this plugin will be a duplicate of the same plugin from topcoder-react-utils,
              most likely this hides variables defined in topcoder-react-utils
     */
    new webpack.DefinePlugin({
      'process.env': _.mapValues(constants, (value) => JSON.stringify(value))
    })
  ]
}
