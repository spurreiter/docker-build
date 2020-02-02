/* eslint-env mocha */

const assert = require('assert')
const shell = require('shelljs')
const { labelsToString, imageName, buildDockerfile } = require('../src/utils')

describe('utils', function () {
  it('shall generate labels from an object', function () {
    const fromImage = 'alpine'
    const fromVersion = '3.11'
    const image = 'myself/cool-alpine'
    const version = '3.11.2'
    const build = 'build42'

    const labels = {
      maintainer: 'me@myself.andi',
      'com.docker.hub': {
        image: fromImage,
        version: fromVersion,
        'git-url': 'https://github.com/alpinelinux/docker-alpine/tree/edge/x86_64'
      },
      'andi.myself': {
        [imageName(image)]: {
          image,
          version,
          build,
          'git-url': 'https://myself.andi/my.git'
        }
      }
    }

    const result = labelsToString(labels)
    // console.log(result)
    assert.strictEqual(
      result,
      'LABEL maintainer="me@myself.andi" \\\n' +
      '      com.docker.hub.image="alpine" \\\n' +
      '      com.docker.hub.version="3.11" \\\n' +
      '      com.docker.hub.git-url="https://github.com/alpinelinux/docker-alpine/tree/edge/x86_64" \\\n' +
      '      andi.myself.cool-alpine.image="myself/cool-alpine" \\\n' +
      '      andi.myself.cool-alpine.version="3.11.2" \\\n' +
      '      andi.myself.cool-alpine.build="build42" \\\n' +
      '      andi.myself.cool-alpine.git-url="https://myself.andi/my.git"'
    )
  })

  it('shall build dockerfile', function () {
    const fromImage = 'alpine'
    const fromVersion = '3.11'
    const image = 'my/node'
    const version = '12.14.1'
    const build = 'build42'

    const labels = labelsToString({
      maintainer: 'me@myself.andi',
      'com.docker.hub': {
        image: fromImage,
        version: fromVersion,
        'git-url': 'https://github.com/alpinelinux/docker-alpine/tree/edge/x86_64'
      },
      'andi.myself': {
        [imageName(image)]: {
          image,
          version,
          build,
          'git-url': 'https://myself.andi/my.git'
        }
      }
    })
    const dockerfile = `${__dirname}/fixtures/Dockerfile`

    const out = buildDockerfile(dockerfile + '.hb', { fromImage, fromVersion, version, labels })
    // shell.echo(out).to(dockerfile)

    const exp = shell.cat(dockerfile).stdout.replace(/\n$/, '')
    assert.strictEqual(out, exp)
  })
})
