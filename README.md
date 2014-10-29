AMAP order web site
===================

Nodejs website (express, hogan, mongoose, less) + mongodb


Requirement
----

Docker and make


Usage
----


* Install: make install 
  install node modules
* Build: make build
  create an image with everything in it
* Up : make up
  will start a mongo container, create a box for the volumes and start the nodejs server


Configuration
----

The configuration is done in server/conf.js
