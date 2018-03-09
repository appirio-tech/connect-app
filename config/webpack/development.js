/**
 * Webpack config for development mode
 */
const path = require('path')
const webpackMerge = require('webpack-merge')

const dirname = path.resolve(__dirname, '../..')

const commonProjectConfig = require('./common')
const applyCommonModifications = require('./common-modifications')
const configFactory = require('topcoder-react-utils/config/webpack/app-development')

// get standard TopCoder development webpack config
const developmentTopCoderConfig = configFactory({
  context: dirname,

  entry: [
    'babel-polyfill', // Load this first
    'react-hot-loader/patch', // This package already requires/loads react (but not react-dom). It must be loaded after babel-polyfill to ensure both react and react-dom use the same Symbol.
    'react', // Include this to enforce order
    'react-dom', // Include this to enforce order
    './src/index'
  ]
})

// merge standard development TopCoder config with common config specific to connect app
const combinedConfig = webpackMerge.smart(
  developmentTopCoderConfig,
  commonProjectConfig
)

// apply common modifications specific to connect app which cannot by applied by webpack merge
applyCommonModifications(combinedConfig)

/*
  Remove HotModuleReplacementPlugin, because we run webpack-dev-server with --hot param
  Otherwise this plugin will be added twice and cause bugs
 */
const hotReloadPluginIndex = combinedConfig.plugins.findIndex(plugin => plugin.constructor.name === 'HotModuleReplacementPlugin')
combinedConfig.plugins.splice(hotReloadPluginIndex, 1)

/*
  Remove 'webpack-hot-middleware/client?reload=true' as we use webpack-dev-server, not middleware
 */
combinedConfig.entry.main = combinedConfig.entry.main.filter((entry) => (
  entry !== 'webpack-hot-middleware/client?reload=true'
))

/*
  Remove ExtractTextPlugin, because we want hot reload when editing styles
 */
const extractTextPluginIndex = combinedConfig.plugins.findIndex(plugin => plugin.constructor.name === 'ExtractTextPlugin')
combinedConfig.plugins.splice(extractTextPluginIndex, 1)

combinedConfig.module.rules.forEach(rule => {
  if (rule.use){
    const extractTextLoaderIndex = rule.use.findIndex(use => use.loader && use.loader.indexOf('extract-css-chunks-webpack-plugin') >= 0)
    if (extractTextLoaderIndex >= 0) {
      rule.use.splice(extractTextLoaderIndex, 1)
    }
  }
})
/*
  Enable source maps.
  This also let us see original file names in browser console.
 */
combinedConfig.devtool = 'eval'

module.exports = combinedConfig
