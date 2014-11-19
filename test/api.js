var should = require('should');
var assert = require('assert');
var request = require('supertest');
var app = require('../server/app');

describe('Routing', function() {
    //var url = process.env.SERVER_PORT.replace('tcp','http');
    var url = 'http://localhost:8000';

    // within before() you can run all the operations that are needed to setup your tests. In this case
    // I want to create a connection with the database, and when I'm done, I call done().
    before(function(done) {
        // In our tests we use the test db
        console.log('url : ',url);
        start(app);
        console.log('server sarted');
        done();
    });
    after(function(done) {
        console.log('stop server');
        stop(app);
        done();
    });

    describe('MyApi', function(){
        it('should return 200 on /', function (done) {
            request(url)
            .get('/')
            .expect(200)
            .end(function(err, res){
                if (err) return done(err)
                    done()
            })
        })
    });
    describe('Producer', function() {
        it('should return error because producer doesn\'t exist', function(done){
            request(url)
            .get('/api/producer')
            .expect(200)
            .end(function(err, res){
                if (err) return done(err)
                    done()
            })

        });
    });
});

var start = function(server){
    server.listen(8000);
}

var stop = function(server){
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 15000);
    server.close();
}
