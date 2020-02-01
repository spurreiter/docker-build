# docker-build

Build reliable docker images with Dockerfile templates using [handlebars](https://handlebarsjs.com/).

This set of scripts allow to pull and tag images from a different repository, build your own and finally push them into your own docker image repository.

Tagging with a build identifier ensures to fall back to a previous container image in case that a least recent pull introduced failures. In short it does:

```
docker pull image:tag
docker tag image:tag image:tag-build
```

In case of a failure you can manually revert to a previous build using

```
docker pull image:tag-build
docker tag image:tag-build image:tag
```

If a repository URL is provided the build, or tagged images can be pushed.

The build uses handlebars Dockerfile templates for not having to deal with versions in the Dockerfile.

```
FROM {{ repository }}{{ fromImage }}:{{ fromVersion}}

{{{ labels }}}

ENV VERSION {{ version }}
```

You should add labels to containers to allow later inspection avoiding any confusion on the container used.

e.g.

```      
LABEL maintainer="me@myself.andi" \
      com.docker.hub.image="node" \
      com.docker.hub.version="12-alpine" \
      com.docker.hub.git-url="https://github.com/nodejs/docker-node/tree/master" \
      andi.myself.server.image="my/server" \
      andi.myself.server.version="1.0.0" \
      andi.myself.server.build="build20200202" \
      andi.myself.server.git-url="https://myself.andi/my.git"
```

is generated by a helper function

```js
const labels = labelsToString({
  maintainer: 'me@myself.andi',
  // relying image from docker hub
  'com.docker.hub': {
    image: fromImage,
    version: fromVersion,
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
```

## install

    npm i git+https://github.com/spurreiter/docker-build#semver:^1

## usage

check out the [example](./examples).

Run with `cd examples ; node .`

The tagged images are:

```
$ docker images
REPOSITORY   TAG                      IMAGE ID       CREATED        SIZE
my/server    1.0.0                    8d9d51917fdb   1 second ago   85.2MB
my/server    1.0.0-build20200202      8d9d51917fdb   1 second ago   85.2MB
my/server    latest                   8d9d51917fdb   1 second ago   85.2MB
node         12-alpine                b0dc3a5e5e9e   2 weeks ago    85.2MB
node         12-alpine-b0dc3a5e5e9e   b0dc3a5e5e9e   2 weeks ago    85.2MB
```

and if using a docker repository they will get pushed as well

```
$ docker images
REPOSITORY                     TAG                      IMAGE ID       CREATED        SIZE
docker.myself.andi/my/server   1.0.0                    8d9d51917fdb   1 second ago   85.2MB
docker.myself.andi/my/server   1.0.0-build20200202      8d9d51917fdb   1 second ago   85.2MB
docker.myself.andi/my/server   latest                   8d9d51917fdb   1 second ago   85.2MB
node                           12-alpine                b0dc3a5e5e9e   2 weeks ago    85.2MB
docker.myself.andi/node        12-alpine                b0dc3a5e5e9e   2 weeks ago    85.2MB
docker.myself.andi/node        12-alpine-b0dc3a5e5e9e   b0dc3a5e5e9e   2 weeks ago    85.2MB
```

## license

MIT licensed
