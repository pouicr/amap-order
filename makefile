.PHONY : all

USERNAME:=pouic
APPNAME:=amap-order
IMAGE:=$(USERNAME)/$(APPNAME)
MONGO_IP:=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' mongo`

define docker_run_flags
-p 8000:8000 \
-it \
--rm
endef

ifdef DEV
	docker_run_flags += --volumes-from $(APPNAME)_volumes
endif

ifdef MONGO_IP
	docker_run_flags += --link mongo:mongo
endif

all: build


volume:
	echo "Building $(APPNAME) volumes..."
	-docker run -v $(PWD):/data --name $(APPNAME)_volumes busybox true

build:
	echo "Building $(IMAGE) docker image..."
	docker build --rm -t $(IMAGE) .

clean:
	echo "Removing $(IMAGE) docker image..."
	docker rmi $(IMAGE)

up: volume mongo-up run

run:
	echo "Running $(IMAGE) ..."
	docker run $(docker_run_flags) --name $(APPNAME) $(IMAGE) npm start

install:
	echo "Installing $(IMAGE) ..."
	docker run $(docker_run_flags) $(IMAGE) npm install

shell:
	echo "shel..."
	docker run $(docker_run_flags) --entrypoint /bin/bash $(IMAGE) -c bash

init:
	docker run $(docker_run_flags) $(IMAGE) node server/db/initDB.js

mongo-cli:
	docker run --rm -it --link mongo:mongo mongo:2.6 mongo $(MONGO_IP)/mydb

mongo-up:
	-docker run -d --name mongo -v /var/data/amap:/data/db -p 27017:27017 mongo:2.6 mongod --smallfiles

mongo-rm:
	docker stop mongo && docker rm mongo
