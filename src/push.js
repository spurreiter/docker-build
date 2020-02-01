const { exec, repositoryName } = require('./utils')

function push ({
  image,
  version = 'latest',
  build,
  tags = [],
  repository
}) {
  const imageVersion = `${image}:${version}`
  const repo = repositoryName(repository)

  if (!build) {
    build = exec(`docker images -q ${imageVersion}`).stdout
  }

  if (repo) {
    exec(`docker push ${repo}${imageVersion}`)
    exec(`docker push ${repo}${imageVersion}-${build}`)
    tags.forEach(tag => {
      exec(`docker push ${repo}${image}:${tag}`)
    })
  }
}

module.exports = { push }
