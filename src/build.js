const fs = require('fs')
const path = require('path')
const { exec, buildDockerfile, repositoryName } = require('./utils')

function buildContainer ({
  dockerfile,
  fromImage,
  fromVersion,
  image,
  version,
  build,
  tags,
  repository,
  labels,
  ...other
}, opts) {
  const repo = repositoryName(repository)
  const out = buildDockerfile(dockerfile, { fromImage, fromVersion, image, version, build, labels, repository: repo, ...other })
  const dirname = path.dirname(dockerfile)

  fs.writeFileSync(`${dirname}/Dockerfile`, out, 'utf8')

  const imageVersionBuild = `${repo}${image}:${version}-${build}`

  const hash = exec(`docker images -q ${imageVersionBuild}`).stdout
  if (hash) {
    exec(`docker rmi -f ${hash}`)
  }

  exec(`docker build ${opts} -t ${imageVersionBuild} ${dirname}`)

  exec(`docker tag ${imageVersionBuild} ${repo}${image}:${version}`)
  tags.forEach(tag => {
    exec(`docker tag ${imageVersionBuild} ${repo}${image}:${tag}`)
  })
}

module.exports = {
  buildContainer
}
