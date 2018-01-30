const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const CompressionPlugin = require('compression-webpack-plugin')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const autoprefixer = require('autoprefixer')
const _ = require('lodash')

const defaultProjectConfig = require('./default')

const dirname = path.resolve(__dirname, '../..')

/* const old = webpackMerge(defaultProjectConfig, {
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
}) */


const configFactory = require('topcoder-react-utils/config/webpack/app-production')

// standard config from topcoder-react-utils
const productionTopcoderConfig = configFactory({
  context: dirname,

  entry: [
    './src/styles/main.scss',
    './src/index'
  ]
})

// exclude some folders for `jsx` rule
const jsxRule = _.find(productionTopcoderConfig.module.rules, { loader: 'babel-loader' })
jsxRule.exclude = [
  /node_modules[\\/](?!appirio-tech.*|topcoder|tc-)/,
  /src[\\/]assets[\\/]fonts/
]

// include `appirio-tech-react-components` package for `scss` rule
const scssRule = _.find(productionTopcoderConfig.module.rules, (rule => {
  if (!rule.use) {
    return false
  }

  const ruleLoaders = _.map(rule.use, 'loader')

  return _.includes(ruleLoaders.join(','), 'extract-css-chunks-webpack-plugin')
}))

scssRule.exclude = /node_modules[\\/](?!appirio-tech-react-components|tc-ui)/

// customization for the project
const productionProjectConfig = {
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
    rules: [
      {
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
      }
    ]
  }
}

RegExp.prototype.toJSON = RegExp.prototype.toString;
const combinedConfig = webpackMerge.smart(
  productionTopcoderConfig,
  defaultProjectConfig,
  productionProjectConfig
)

console.log(JSON.stringify(combinedConfig, null, 4))

const fs = require('fs')

fs.writeFileSync(path.resolve(__dirname, '../../combinedConfig.json'), JSON.stringify(combinedConfig, null, 4))

module.exports = combinedConfig
