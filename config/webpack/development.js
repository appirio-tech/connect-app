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
    'react-hot-loader/patch',
    './src/styles/main.scss',
    './src/index'
  ]
})

// apply common modifications specific to connect app which cannot by applied by webpack merge
applyCommonModifications(developmentTopCoderConfig)

/*
  Remove HotModuleReplacementPlugin, because we run webpack-dev-server with --hot param
  Otherwise this plugin will be added twice and cause bugs
 */
const hotReloadPluginIndex = developmentTopCoderConfig.plugins.findIndex(plugin => plugin.constructor.name === 'HotModuleReplacementPlugin')
developmentTopCoderConfig.plugins.splice(hotReloadPluginIndex, 1)

// merge standard development TopCoder config with common config specific to connect app
const combinedConfig = webpackMerge.smart(
  developmentTopCoderConfig,
  commonProjectConfig
)

module.exports = combinedConfig
