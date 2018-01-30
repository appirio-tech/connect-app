const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const _ = require('lodash')

const defaultProjectConfig = require('./default')

const dirname = path.resolve(__dirname, '../..')

/* module.exports = webpackMerge.strategy({
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
        ]
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
 */
const configFactory = require('topcoder-react-utils/config/webpack/app-development')

// standard config from topcoder-react-utils
const developmentTopCoderConfig = configFactory({
  context: dirname,

  entry: [
    'react-hot-loader/patch',
    './src/styles/main.scss',
    './src/index'
  ]
})

// exclude some folders for `jsx` rule
const jsxRule = _.find(developmentTopCoderConfig.module.rules, { loader: 'babel-loader' })
jsxRule.exclude = [
  /node_modules[\\/](?!appirio-tech.*|topcoder|tc-)/,
  /src[\\/]assets[\\/]fonts/
]

// include `appirio-tech-react-components` package for `scss` rule
const scssRule = _.find(developmentTopCoderConfig.module.rules, (rule => {
  if (!rule.use) {
    return false
  }

  const ruleLoaders = _.map(rule.use, 'loader')

  return _.includes(ruleLoaders.join(','), 'extract-css-chunks-webpack-plugin')
}))

scssRule.exclude = /node_modules[\\/](?!appirio-tech-react-components|tc-ui)/

// customization for the project
const developmentProjectConfig = {}
RegExp.prototype.toJSON = RegExp.prototype.toString
const combinedConfig = webpackMerge.smart(
  developmentTopCoderConfig,
  defaultProjectConfig,
  developmentProjectConfig
)

console.log(JSON.stringify(combinedConfig, null, 4))

const fs = require('fs')

fs.writeFileSync(path.resolve(__dirname, '../../combinedConfig.json'), JSON.stringify(combinedConfig, null, 4))

module.exports = combinedConfig
