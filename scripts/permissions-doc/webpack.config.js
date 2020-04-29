const path = require('path')
const webpackConfig = require('../../config/webpack/development')

const dirname = path.resolve(__dirname, '../..')

webpackConfig.output = {
  path: path.join(dirname, '/dist/scripts/permissions-doc'),
  filename: '[name].js',
  chunkFilename: '[name].js',
  publicPath: '/'
},

webpackConfig.entry = [
  './scripts/permissions-doc/index'
]

webpackConfig.module.rules.push({
  test: /\.hbs$/,
  loader: 'file-loader'
})

webpackConfig.plugins = []

console.log('webpackConfig', JSON.stringify(webpackConfig, null, 2))

module.exports = webpackConfig
