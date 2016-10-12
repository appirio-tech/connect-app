
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


const fixStyleLoader = (loader) => {
  if (BUILD) {
    const first = loader.loaders[0];
    const rest = loader.loaders.slice(1);
    loader.loader = ExtractTextPlugin.extract(first, rest.join('!'));
    delete loader.loaders;
  }
  return loader;
};

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
    },

    fixStyleLoader({
      test: /\.m\.scss$/,
      loaders: [
        'style',
        'css?sourceMap&-minimize&modules&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]',
        'postcss',
        'sass?sourceMap',
      ],
    }),
    fixStyleLoader({
      test: /\.scss$/,
      exclude: /\.m\.scss$/,
      loaders: [
        'style',
        'css?sourceMap&-minimize',
        'postcss',
        'sass?sourceMap',
      ],
    }),
    fixStyleLoader({
      test: /\.css/,
      loaders: [
        'style',
        'css?sourceMap&-minimize',
      ],
    }),
    {
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
  alias: {
    config: path.join(dirname, './src/config'),
    actions: path.join(dirname, './src/actions'),
    components: path.join(dirname, './src/components'),
  },
  modulesDirectories: ['node_modules'],
  extensions: ['', '.js', '.jsx', '.json', '.scss', '.svg', '.png', '.gif', '.jpg']
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

config.postcss = [
  require('postcss-flexboxfixer'),
  require('autoprefixer')({
    browsers: ['last 2 versions'],
  }),
];

module.exports = config;