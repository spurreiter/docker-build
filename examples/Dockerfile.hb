FROM {{ repository }}{{ fromImage }}:{{ fromVersion}}

{{{ labels }}}

COPY server/server-{{ version }}.tgz /opt

RUN npm i -g /opt/server-{{ version }}.tgz

ENV USER node
ENV HOME /home/$USER

# RUN addgroup -g 1000 $USER \
#     && adduser -u 1000 -G $USER -s /bin/sh -D $USER \

# principle of least privilege
USER $USER
WORKDIR $HOME

CMD [ "/usr/local/bin/start" ]
