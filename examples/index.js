const { exec, cd } = require('shelljs')
const { buildContainer, pull, push, buildDate, labelsToString, imageName } = require('..') /* require('docker-build') */

const DO_PUSH = !process.argv.includes('--no-push')
const DO_PULL = !process.argv.includes('--no-pull')

function main () {
  // define your docker repository
  const repository = '' // 'docker.myself.andi'
  // variables
  const fromImage = 'node'
  const fromVersion = '12-alpine'
  const image = 'my/server'
  const version = require('./server/package.json').version
  const build = buildDate() // this could also be replaced by a counter from outside, e.g. using an env-var from Jenkins.
  // define the labels to add to the container
  const labels = labelsToString({
    maintainer: 'me@myself.andi',
    // we are using an official docker hub image so let's add this
    'com.docker.hub': {
      image: fromImage,
      version: fromVersion,
      // location of the Dockerfile...
      'git-url': 'https://github.com/nodejs/docker-node/tree/master'
    },
    // our own image metadata
    [`andi.myself.${imageName(image)}`]: {
      image,
      version,
      build,
      'git-url': 'https://myself.andi/my.git'
    }
  })
  // the image tags
  const tags = ['latest']
  // the Dockerfile template
  const dockerfile = `${__dirname}/Dockerfile.hb`

  // ---- build process ----
  // create package
  cd(`${__dirname}/server`)
  exec('npm pack')
  cd(`${__dirname}`)

  // get dependent image
  if (DO_PULL) {
    const image = fromImage
    const version = fromVersion
    const buildPull = pull({ image, version, repository })
    DO_PUSH && push({ image, version, build: buildPull, repository })
  }

  // build container image and push
  buildContainer({ dockerfile, fromImage, fromVersion, image, version, build, labels, tags, repository }, '--force-rm')
  DO_PUSH && push({ image, version, build, tags, repository })

  // TODO: Now do some tests with the new container
}

main()
