/**
 * Webpack config for production mode
 */
const path = require('path')
const webpackMerge = require('webpack-merge')
const CompressionPlugin = require('compression-webpack-plugin')

const dirname = path.resolve(__dirname, '../..')

const commonProjectConfig = require('./common')
const applyCommonModifications = require('./common-modifications')
const configFactory = require('topcoder-react-utils/config/webpack/app-production')

// get standard TopCoder production webpack config
const productionTopCoderConfig = configFactory({
  context: dirname,

  entry: [
    './src/styles/main.scss',
    './src/index'
  ]
})

// apply common modifications specific to connect app which cannot by applied by webpack merge
applyCommonModifications(productionTopCoderConfig)

/*
  Add compression plugin which gzip files output files
 */
productionTopCoderConfig.plugins.push(
  new CompressionPlugin({
    asset: '[file]',
    algorithm: 'gzip',
    regExp: /\.js$|\.css$/,
    threshold: 10240,
    minRatio: 0.8
  })
)

// merge standard production TopCoder config with common config specific to connect app
const combinedConfig = webpackMerge.smart(
  productionTopCoderConfig,
  commonProjectConfig
)

module.exports = combinedConfig
