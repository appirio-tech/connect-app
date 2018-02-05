/**
 * Babel config for CoffeeScript only.
 *
 * We disable modules for `env` preset of `babel` for CoffeeScript to avoid error
 * 'Uncaught ReferenceError exports is not defined'
 */
const topCoderBabelConfig = require('topcoder-react-utils/config/babel/webpack')

const envPresetIndex = topCoderBabelConfig.presets.find((preset) => preset === 'env')
topCoderBabelConfig.presets.splice(envPresetIndex, 1, ['env', { modules: false }])

module.exports = topCoderBabelConfig
