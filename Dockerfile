# docker build -t pouic/amap-order .
FROM node

ADD . /usr/src/app
WORKDIR /usr/src/app

RUN npm install

EXPOSE 8000
ENTRYPOINT ["/usr/local/bin/npm"]

CMD ["start"]
