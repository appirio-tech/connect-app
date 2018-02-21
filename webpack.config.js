/**
 * Webpack configuration is located inside /config/webpack folder. This file
 * is only responsible to expose the actual configuration to Webpack.
 */

/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = function buildConfig(env) {
  const webpackConfig = require(`./config/webpack/${env}.js`)

  // Remove and re-instantiate UglifyJsPlugin if it was present (needed for source-maps)
  // See here: https://github.com/webpack/webpack/issues/2704
  let uglifyPluginIndex = webpackConfig.plugins.findIndex(plugin => plugin.constructor.name === 'UglifyJsPlugin')
  if (uglifyPluginIndex > -1) {
  	webpackConfig.plugins = webpackConfig.plugins.filter((plugin) => plugin.constructor.name !== 'UglifyJsPlugin')
  	webpackConfig.plugins.splice(uglifyPluginIndex, 0, new UglifyJsPlugin({sourceMap: true}))
  }

  return webpackConfig
}

