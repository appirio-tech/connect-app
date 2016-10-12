
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const constants = require('./constants');

const branch = process.env.TRAVIS_BRANCH

if (branch === 'master') process.env.ENV = 'PROD'
if (branch === 'dev')    process.env.ENV = 'DEV'
if (branch === 'qa')     process.env.ENV = 'QA'


const dirname = path.join(__dirname, '..');
const entry = {
  app: [
    './src/styles/main.scss',
    './src/index',
  ]
};

let TEST = false;
let BUILD = false;
let SILENT = false;
let MOCK = false;
let ENV = process.env.ENV || 'DEV';
process.argv.forEach(function (arg) {
  if (arg === '--test') {
    TEST = true;
  }
  if (arg === '--build') {
    BUILD = true;
  }
  if (arg === '--silent') {
    SILENT = true;
  }
  if (arg === '--dev') {
    ENV = 'DEV';
  }
  if (arg === '--qa') {
    ENV = 'QA';
  }
  if (arg === '--prod') {
    ENV = 'PROD';
  }
  if (arg === '--mock') {
    return MOCK = true;
  }
});
const envConstants = constants(ENV);
if (!SILENT) {
  console.log('Assigning the following constants to process.env:');
  console.log(envConstants);
  console.log('\n');
}
Object.assign(process.env, envConstants);
const config = {
  entry,
  context: dirname,
};

if (TEST) {
  config.output = {};
} else {
  config.output = {
    path: path.join(dirname, '/dist'),
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js'
  };
}
if (TEST) {
  config.devtool = 'inline-source-map';
} else if (BUILD) {
  config.devtool = 'source-map';
} else {
  config.devtool = 'eval';
}
const scssLoaderBase = 'css-loader!sass-loader';
const scssLoader = BUILD ? ExtractTextPlugin.extract('style-loader', scssLoaderBase) : 'style-loader!' + scssLoaderBase;
config.module = {
  preLoaders: [],
  loaders: [
    {
      test: /\.(js|jsx)$/,
      loaders: [
        'react-hot',
        'babel?' + JSON.stringify({
          presets: [ 'es2015', 'react', 'stage-0' ],
          plugins: [ 'lodash' ]
        })
      ],
      exclude: /node_modules\/(?!appirio-tech.*|topcoder|tc-)/,
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.scss$/,
      loader: scssLoader
    }, {
      test: /\.css$/,
      loader: BUILD ? ExtractTextPlugin.extract('style-loader', 'css-loader') : 'style-loader!css-loader',
    }, {
      test: /\.(png|jpg|jpeg|gif)$/,
      loader: 'file'
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file'
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file'
    }
  ],
  postLoaders: [
    {
      test: /\.(js|jsx)$/,
      loader: 'transform/cacheable?envify'
    }
  ]
};
config.resolveLoader = {
  root: path.join(dirname, '/node_modules/')
};
config.resolve = {
  root: path.join(dirname, '/node_modules/'),
  modulesDirectories: ['node_modules'],
  extensions: ['', '.js', '.jsx', '.json', '.coffee', '.jade', '.jader', '.scss', '.svg', '.png', '.gif', '.jpg', '.cjsx']
};
config.sassLoader = {
  includePaths: [path.join(dirname, '/node_modules/bourbon/app/assets/stylesheets'), path.join(dirname, '/node_modules/tc-ui/src/styles')]
};
config.plugins = [];
if (BUILD) {
  config.plugins.push(new ExtractTextPlugin('[name].[hash].css'));
}
config.plugins.push(new webpack.DefinePlugin({
  __MOCK__: JSON.stringify(JSON.parse(MOCK || 'false'))
}));
if (!TEST) {
  config.plugins.push(new HtmlWebpackPlugin({
    template: './src/index.html',
    inject: 'body',
    favicon: null,
    NEW_RELIC_APPLICATION_ID: process.env.NEW_RELIC_APPLICATION_ID
  }));
}
if (BUILD) {
  config.plugins.push(new webpack.IgnorePlugin(/\.mock\.js/));
  config.plugins.push(new webpack.NoErrorsPlugin());
  config.plugins.push(new webpack.optimize.DedupePlugin());
  const uglifyOptions = {
    mangle: true
  };
  config.plugins.push(new webpack.optimize.UglifyJsPlugin(uglifyOptions));
  config.plugins.push(new CompressionPlugin({
    asset: "{file}",
    algorithm: "gzip",
    regExp: /\.js$|\.css$/,
    threshold: 10240,
    minRatio: 0.8
  }));
}

module.exports = config;