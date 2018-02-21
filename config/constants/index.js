module.exports = (() => {
  const branch = process.env.CIRCLE_BRANCH || 'dev'

  // for security reason don't let to require any arbitrary file defined in process.env
  if (['master', 'qa', 'dev-auth0'].indexOf(branch) < 0) {
    return require('./dev')
  }

  return require('./' + branch)
})()
