const shell = require('shelljs')
const handlebars = require('handlebars')

const flatten = (arr, depth = 1) =>
  arr.reduce((a, v) => a.concat(depth > 1 && Array.isArray(v) ? flatten(v, depth - 1) : v), [])

const buildDate = () => 'build' + new Date().toISOString().substring(0, 10).replace(/-/g, '')

const labelsToString = (labelsObj) => {
  const walk = (obj, keys) => {
    if (typeof obj === 'object') {
      return Object.entries(obj).map(([key, value]) => walk(value, keys.concat(key)))
    } else {
      return `${keys.join('.')}="${obj}"`
    }
  }
  return 'LABEL ' + flatten(walk(labelsObj, []), 100).join(' \\\n      ')
}

const imageName = (image) => {
  const [prefix, img] = image.split('/')
  return img || prefix
}

const repositoryName = (repo = '') => (/\/$/).test(repo)
  ? repo
  : repo.length
    ? repo + '/'
    : ''

const buildDockerfile = (dockerfile, obj) => {
  const str = shell.cat(dockerfile).stdout
  const out = handlebars.compile(str)(obj)
  return out
}

const exec = (...args) => {
  const { code, stdout, stderr } = shell.exec(...args)
  if (code !== 0) process.exit(code)
  return { code, stdout, stderr }
}

module.exports = {
  buildDate,
  labelsToString,
  imageName,
  repositoryName,
  exec,
  buildDockerfile
}
