# docker build -t pouic/amap-order .
FROM dockerfile/nodejs

RUN useradd node
RUN chown node:node -R /data
RUN mkdir /home/node
RUN chown node:node /home/node

USER node
ENV HOME /home/node
