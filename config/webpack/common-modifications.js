/**
 * Function which is applied to webpack config from topcoder-react-utils
 * and perform some common modification specific to connect app which cannot be applied using
 * webpack merge.
 */

module.exports = function (config) {
  /*
    Exclude some folders from babel-loader
   */
  const jsxRule = config.module.rules.find(rule => /jsx/.test(rule.test.toString()))
  jsxRule.exclude = [
    /node_modules[\\/](?!appirio-tech.*|topcoder|tc-)/,
    /src[\\/]assets[\\/]fonts/
  ]

  /*
    Include packages `appirio-tech-react-components` and `tc-ui`
    to `.scss` rule
   */
  const scssRule = config.module.rules.find(rule => /scss/.test(rule.test.toString()))
  scssRule.exclude = /node_modules[\\/](?!appirio-tech-react-components|tc-ui)/

  /*
    Remove outputPath as otherwise in development mode files cannot be found
    in the webpack in-memory filesystem
    TODO understand why it happens, fix it another way, remove this
   */
  const imagesRule = config.module.rules.find(rule => /gif/.test(rule.test.toString()))
  delete imagesRule.options.outputPath

  /*
    Remove outputPath as otherwise in development mode files cannot be found
    in the webpack in-memory filesystem
    TODO understand why it happens, fix it another way, remove this
   */
  const fontsRule = config.module.rules.find(rule => /woff2/.test(rule.test.toString()))
  delete fontsRule.options.outputPath
}
