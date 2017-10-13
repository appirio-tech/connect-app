require('./node_modules/coffeescript/register')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const branch = process.env.CIRCLE_BRANCH

process.env.ENV = 'DEV' // Default to DEV

if (branch === 'master') process.env.ENV = 'PROD'
if (branch === 'dev')    process.env.ENV = 'DEV'
if (branch === 'qa')     process.env.ENV = 'QA'

const config = require('appirio-tech-webpack-config')({
  dirname: __dirname,
  entry: {
    app: ['./src/styles/main.scss', './src/index']
  },
  template: './src/index.html'
})

// Set asset prefix to CDN
// FIXME: Move to constants in webpack-config
// if (branch === 'dev')     config.output.publicPath = '//d2w5g0u9h79yyx.cloudfront.net/'
// if (branch === 'qa')      config.output.publicPath = '//changeme.cloudfront.net/'
// if (branch === 'master')  config.output.publicPath = '//changeme.cloudfront.net/'

// Adding react hot loader
const babelOptions = {
  presets: [ 'es2015', 'react', 'stage-2' ],
  plugins: [ 'lodash' ]
}

const jsxLoader = {
  test: /\.(js|jsx)$/,
  loaders: [
    'react-hot',
    'babel?' + JSON.stringify(babelOptions)
  ],
  exclude: /node_modules\/(?!appirio-tech.*|topcoder|tc-)/
}

// Loop over loaders and replace
config.module.loaders.forEach((loader, i, loaders) => {
  if (loader.loader === 'babel' && String(loader.test) === String(/\.(js|jsx)$/)) {
    jsxLoader.include = loader.include
    loaders[i] = jsxLoader
  }
})

config.plugins.push(new FaviconsWebpackPlugin('./src/favicon.png'))

// Override webpack constants for testing
const auth0DevConstants = {
  auth0Domain: 'topcoder-newauth.auth0.com',
  AUTH0_DOMAIN: 'topcoder-newauth.auth0.com',
  ACCOUNTS_APP_URL: 'https://accounts-auth0.topcoder-dev.com/member',
  ACCOUNTS_APP_CONNECTOR_URL: 'https://accounts-auth0.topcoder-dev.com/connector.html',
  AUTH0_CLIENT_ID: 'G76ar2SI4tXz0jAyEbVGM7jFxheRnkqc',
  ACCOUNTS_APP_LOGIN_URL: 'https://accounts-auth0.topcoder-dev.com/#!/connect?retUrl=http://connect-auth0.topcoder-dev.com/'
}

Object.assign(process.env, auth0DevConstants)

config.plugins.forEach(p =>  {
  if (p.definitions && p.definitions['process.env']) {
    p.definitions['process.env'] = JSON.stringify(Object.assign(JSON.parse(p.definitions['process.env']), auth0DevConstants))
  }})

module.exports = config
