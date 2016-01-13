# docker build -t pouic/amap-order .
FROM google/nodejs

RUN useradd node
RUN chown node:node -R /data
RUN mkdir /home/node
RUN chown node:node /home/node

ADD . /data
WORKDIR /data

RUN chown node:node /data

RUN npm install

#USER node
#ENV HOME /home/node

ENTRYPOINT ["/usr/local/bin/npm"]

CMD ["start"]
