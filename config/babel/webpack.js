/**
 * Babel config preset.
 *
 * Here we can update babel config which comes from `topcoder-react-utils` with Connect App specific things.
 */
const topCoderBabelConfig = require('topcoder-react-utils/config/babel/webpack')

/*
  Make sure that the list of plugins is defined
 */
topCoderBabelConfig.plugins = topCoderBabelConfig.plugins || []

/*
  Add babel-plugin-lodash to exclude full lodash lib and include only necessary methods
*/
topCoderBabelConfig.plugins.push('lodash')

/*
  Update options for `inline-react-svg` plugin.
  We have to clean `data-color` and `data-cap` attributes in SVG files which are used in Connect App
  because otherwise we will have `Warning: Unknown prop` from React
*/
topCoderBabelConfig.plugins = topCoderBabelConfig.plugins.map((plugin) => {
  if (plugin === 'inline-react-svg') {
    return ['inline-react-svg', {
      svgo: {
        plugins: [
          {
            removeAttrs: { attrs: '(data-color|data-cap)' }
          }
        ]

      }
    }]
  }

  return plugin
})

module.exports = topCoderBabelConfig
