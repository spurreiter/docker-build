FROM {{ fromImage }}:{{ fromVersion }}

ENV NODE_VERSION {{ version }}

{{{ labels }}}

COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

CMD [ "node" ]
