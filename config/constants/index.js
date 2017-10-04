module.exports = (() => {
  const branch = process.env.CIRCLE_BRANCH || 'dev'

  // for security reason don't let to require any arbitrary file defined in process.env
  if (['dev', 'master', 'qa'].indexOf(branch) < 0) {
    throw Error('Unsupported CIRCLE_BRANCH value.')
  }

  return require('./' + branch)
})()
