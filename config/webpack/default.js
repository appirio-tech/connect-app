'use strict'

const _ = require('lodash')
const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const constants = require('../constants')

const dirname = path.resolve(__dirname, '../..')

/* const old = {
  context: dirname,

  entry: [
    './src/styles/main.scss',
    './src/index'
  ],

  output: {
    path          : path.join(dirname, '/dist'),
    filename      : '[name].[hash].js',
    chunkFilename : '[name].[hash].js',
    publicPath    : '/'
  },

  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      loader: 'babel-loader',
      exclude: /node_modules\/(?!appirio-tech.*|topcoder|tc-)/,
      options: {
        babelrc: false,
        presets: [ 'env', 'react', 'stage-2' ],
        plugins: ['lodash', 'inline-react-svg']
      }
    }, {
      test: /\.(coffee|litcoffee|cjsx)$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [ 'env', 'react', 'stage-2' ],
            plugins: [ 'lodash' ]
          }
        },
        'coffee-loader',
        'cjsx-loader'
      ]
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      // We have to support css loading for third-party plugins,
      // we are not supposed to use css files inside the project.
      test: /\.css$/,
      use: ExtractCssChunks.extract({
        fallback: 'style-loader',
        use: ['css-loader']
      })
    }, {
      // ASSET LOADER
      // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
      // Rename the file using the asset hash
      // Pass along the updated reference to your code
      // You can add here any file extension you want to get copied to your output
      test: /\.(png|jpg|jpeg|gif)$/,
      loader: 'file-loader'
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader'
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader'
    }]

  },

  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.json',
      '.coffee',
      '.scss',
      '.svg',
      '.png',
      '.gif',
      '.jpg',
      '.cjsx'
    ],
    alias: {
      handlebars: 'handlebars/dist/handlebars.min.js'
    }
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': _.mapValues(constants, (value) => JSON.stringify(value))
    }),
    new FaviconsWebpackPlugin({
      logo: './src/favicon.png',
      // disable cache, otherwise when there is a dist folder with icons
      // icons don't wanna be generated in memory using webpack-dev-server
      persistentCache: false
    }),
    new HtmlWebpackPlugin({
      template: path.join(dirname, '/src/index.html'),
      inject: 'body'
    }),
    // Only emit files when there are no errors
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractCssChunks({
      filename: '[name].css'
    })
  ]
} */

module.exports = {
  // update output as we have different output folder and file naming
  output: {
    path: path.join(dirname, '/dist'),
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    publicPath: '/'
  },

  resolve: {
    extensions: [
      '.coffee',
      '.litcoffee',
      '.cjsx',
      '.svg'
    ],
    alias: {
      handlebars: 'handlebars/dist/handlebars.min.js'
    }
  },

  module: {
    rules: [{
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
      test: /\.svg$/,
      loader: 'file-loader'
    }],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(dirname, '/src/index.html'),
      inject: 'body'
    }),

    new webpack.DefinePlugin({
      'process.env': _.mapValues(constants, (value) => JSON.stringify(value))
    }),
  ]
}
