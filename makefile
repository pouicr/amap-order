.PHONY : all

USERNAME:=pouic
APPNAME:=amap-order
VERSION:=1.0.0
IMAGE:=$(USERNAME)/$(APPNAME):$(VERSION)
MONGO_IP:=` docker inspect --format '{{ .NetworkSettings.IPAddress }}' mongo`

define  docker_install_flags
--rm \
--volumes-from $(APPNAME)_volumes
endef

define docker_run_flags
-p 8000:8000 \
-it \
--rm
endef

ifdef MONGO_IP
	docker_run_flags += --link mongo:mongo
endif

all: build

dev:
	$(eval docker_run_flags += --volumes-from $(APPNAME)_volumes)
	@echo "Dev mode activated"

volume:
	echo "Building $(APPNAME) volumes..."
	- docker run -v $(PWD):/data --name $(APPNAME)_volumes busybox true

build:
	@echo "Building $(IMAGE)  docker image..."
	 docker build --rm -t $(IMAGE) .

clean:
	@echo "Removing  all  docker container..."
	- docker rm $(APPNAME)
	- docker rm $(APPNAME)_volumes

up: volume mongo-up run

down: mongo-rm clean

run:
	@echo "Running $(IMAGE) ..."
	 docker run $(docker_run_flags) --name $(APPNAME) $(IMAGE)

itest:
	@echo "Launch tests ..."
	- docker run -d --name mongo_test -p 27017:27017 mongo:3 mongod --smallfiles
	sleep 4
	- docker run -p 8000:8000 -it --rm --link mongo_test:mongo --name $(APPNAME)_test $(IMAGE) test
	- docker stop mongo_test &&  docker rm mongo_test

ltest:
	@echo "Launch local tests ..."
	- docker run -d --name mongo_test -p 27017:27017 mongo:3 mongod --smallfiles
	- docker run -v $(PWD):/data --name $(APPNAME)_test_volumes busybox true
	sleep 3
	- docker run --rm --link mongo_test:mongo --volumes-from $(APPNAME)_test_volumes -p 8000:8000 $(IMAGE) test
	- docker rm $(APPNAME)_test_volumes
	- docker stop mongo_test &&  docker rm mongo_test


install:
	@echo "Installing $(IMAGE) ..."
	 docker run $( docker_install_flags) $(IMAGE) install

push:
	@echo "Pushing $(IMAGE) ..."
	 docker push $(IMAGE)

shell:
	@echo "Shell..."
	 docker run $( docker_run_flags) --entrypoint /bin/bash $(IMAGE) -c bash

mongo-cli:
	 docker run --rm -it --link mongo:mongo mongo:3 mongo $(MONGO_IP)/mydb

mongo-up:
	- docker run -d --name mongo -v /var/data/amap:/data/db -p 27017:27017 mongo:3 mongod --smallfiles

mongo-rm:
	- docker stop mongo &&  docker rm mongo
