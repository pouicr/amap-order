# docker build -t pouic/amap-order .
FROM node

ADD . /usr/src/app
WORKDIR /usr/src/app

RUN npm install


ENTRYPOINT ["/usr/local/bin/npm"]

CMD ["start"]
