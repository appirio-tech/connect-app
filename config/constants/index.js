module.exports = (() => {
  const branch = process.env.CIRCLE_BRANCH || 'dev'

  if(branch === 'master-discourse-free') {
    return require('./master')
  }

  // for security reason don't let to require any arbitrary file defined in process.env
  if (['master', 'qa'].indexOf(branch) < 0) {
    return require('./dev')
  }

  return require('./' + branch)
})()
