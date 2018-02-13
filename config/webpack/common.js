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

        Note, that we use custom babel config for coffee script which disables modules
       */
      test: /\.(coffee|litcoffee|cjsx)$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            forceEnv: 'development', // by default set env to 'development'
            presets: [path.resolve(dirname, './config/babel/webpack-coffee.js')],
            plugins: ['lodash']
          }
        },
        'coffee-loader',
        'cjsx-loader'
      ]
    }, {
      /*
        Load SVG files not handled by inline-react-svg babel plugin
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
     */
    new webpack.DefinePlugin({
      'process.env': _.mapValues(constants, (value) => JSON.stringify(value))
    }),

    /*
      Remove some unused files to reduce bundle size
     */
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
}
