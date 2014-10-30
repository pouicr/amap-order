# docker build -t pouic/amap-order .
FROM dockerfile/nodejs

RUN useradd node
RUN chown node:node -R /data
RUN mkdir /home/node
RUN chown node:node /home/node

ADD . /data
WORKDIR /data

RUN chown node:node /data

USER node
ENV HOME /home/node

RUN npm install

ENTRYPOINT ["/usr/local/bin/npm"]

CMD ["start"]
