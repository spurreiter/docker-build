const { exec, repositoryName } = require('./utils')

function pull ({
  image,
  version = 'latest',
  build,
  tags = [],
  repository
}) {
  const imageVersion = `${image}:${version}`
  const repo = repositoryName(repository)

  exec(`docker pull ${imageVersion}`)

  if (!build) {
    build = exec(`docker images -q ${imageVersion}`).stdout
  }

  if (repo) {
    exec(`docker tag  ${imageVersion} ${repo}${imageVersion}`)
  }
  exec(`docker tag  ${imageVersion} ${repo}${imageVersion}-${build || ''}`)
  tags.forEach(tag => {
    exec(`docker tag  ${imageVersion} ${repo}${image}:${tag}`)
  })

  return build
}

module.exports = { pull }
