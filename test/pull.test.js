/* eslint-env mocha */

const { pull } = require('..')

describe.skip('pull', function () {
  this.timeout(30000)

  it('shall pull alpine image', function () {
    pull({ image: 'alpine', version: '3.10', tags: ['latest-dev'] })
  })
})
