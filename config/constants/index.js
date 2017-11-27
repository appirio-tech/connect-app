module.exports = (() => {
  let branch = process.env.CIRCLE_BRANCH || 'dev'

  // for security reason don't let to require any arbitrary file defined in process.env
  if (['dev', 'master', 'qa'].indexOf(branch) < 0) {
    branch='dev'
  }

  return require('./' + branch)
})()
