.PHONY : all

USERNAME:=pouic
APPNAME:=amap-order
IMAGE:=$(USERNAME)/$(APPNAME)
MONGO_IP:=`sudo docker inspect --format '{{ .NetworkSettings.IPAddress }}' mongo`

define sudo docker_install_flags
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
	-sudo docker run -v $(PWD):/data --name $(APPNAME)_volumes busybox true

build:
	@echo "Building $(IMAGE) sudo docker image..."
	sudo docker build --rm -t $(IMAGE) .

clean:
	@echo "Removing  all sudo docker container..."
	-sudo docker rm $(APPNAME)
	-sudo docker rm $(APPNAME)_volumes

up: volume mongo-up run

down: mongo-rm clean

run:
	@echo "Running $(IMAGE) ..."
	sudo docker run $(docker_run_flags) --name $(APPNAME) $(IMAGE)

itest:
	@echo "Launch tests ..."
	-sudo docker run -d --name mongo_test -p 27017:27017 mongo:3 mongod --smallfiles
	sleep 4
	-sudo docker run -p 8000:8000 --rm --link mongo_test:mongo --name $(APPNAME)_test $(IMAGE) test
	-sudo docker stop mongo_test && sudo docker rm mongo_test

ltest:
	@echo "Launch local tests ..."
	-sudo docker run -d --name mongo_test -p 27017:27017 mongo:3 mongod --smallfiles
	-sudo docker run -v $(PWD):/data --name $(APPNAME)_test_volumes busybox true
	sleep 6
	-sudo docker run --rm --link mongo_test:mongo --volumes-from $(APPNAME)_test_volumes -p 8000:8000 $(IMAGE) test
	-sudo docker rm $(APPNAME)_test_volumes
	-sudo docker stop mongo_test && sudo docker rm mongo_test

install:
	@echo "Installing $(IMAGE) ..."
	sudo docker run $(sudo docker_install_flags) $(IMAGE) install

shell:
	@echo "Shell..."
	sudo docker run $(sudo docker_run_flags) --entrypoint /bin/bash $(IMAGE) -c bash

mongo-cli:
	sudo docker run --rm -it --link mongo:mongo mongo:3 mongo $(MONGO_IP)/mydb

mongo-up:
	-sudo docker run -d --name mongo -v /var/data/amap:/data/db -p 27017:27017 mongo:3 mongod --smallfiles

mongo-rm:
	-sudo docker stop mongo && sudo docker rm mongo
