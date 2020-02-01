FROM alpine:3.11

ENV NODE_VERSION 12.14.1

LABEL maintainer="me@myself.andi" \
      com.docker.hub.image="alpine" \
      com.docker.hub.version="3.11" \
      com.docker.hub.git-url="https://github.com/alpinelinux/docker-alpine/tree/edge/x86_64" \
      andi.myself.node.image="my/node" \
      andi.myself.node.version="12.14.1" \
      andi.myself.node.build="build42" \
      andi.myself.node.git-url="https://myself.andi/my.git"

COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

CMD [ "node" ]

