/**
 * Webpack config for production mode
 */
const path = require('path')
const webpackMerge = require('webpack-merge')
const CompressionPlugin = require('compression-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const dirname = path.resolve(__dirname, '../..')

const commonProjectConfig = require('./common')
const applyCommonModifications = require('./common-modifications')
const configFactory = require('topcoder-react-utils/config/webpack/app-production')

// get standard TopCoder production webpack config
const productionTopCoderConfig = configFactory({
  context: dirname,

  entry: [
    'babel-polyfill', // Load this first
    'react-hot-loader/patch', // This package already requires/loads react (but not react-dom). It must be loaded after babel-polyfill to ensure both react and react-dom use the same Symbol.
    'react', // Include this to enforce order
    'react-dom', // Include this to enforce order
    './src/index'
  ]
})

// merge standard production TopCoder config with common config specific to connect app
const combinedConfig = webpackMerge.smart(
  productionTopCoderConfig,
  commonProjectConfig
)

// apply common modifications specific to connect app which cannot by applied by webpack merge
applyCommonModifications(combinedConfig)

/*
  Set babel environment to `production` for CoffeeScript babel config
 */
const coffeeRule = combinedConfig.module.rules.find(rule => /coffee/.test(rule.test.toString()))
const coffeeBabelUse = coffeeRule.use.find((use) => use.loader === 'babel-loader')
coffeeBabelUse.options.forceEnv = 'production'

/*
  Add compression plugin which gzip files output files
 */
combinedConfig.plugins.push(
  new CompressionPlugin({
    asset: '[file]',
    algorithm: 'gzip',
    regExp: /\.js$|\.css$/,
    threshold: 10240,
    minRatio: 0.8
  })
)
combinedConfig.plugins = combinedConfig.plugins.map((plugin) => {
  // console.log(/UglifyJsPlugin/.test(plugin.constructor.toString()))
  if (/UglifyJsPlugin/.test(plugin.constructor.toString())) return new UglifyJsPlugin()
  return plugin
})

module.exports = combinedConfig
