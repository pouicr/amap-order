var should = require('should');
var assert = require('assert');
var request = require('supertest');
var app = require('../server/app');

describe('Routing', function() {
    //var url = process.env.SERVER_PORT.replace('tcp','http');
    var url;

    // within before() you can run all the operations that are needed to setup your tests. In this case
    // I want to create a connection with the database, and when I'm done, I call done().
    before(function(done) {
        // In our tests we use the test db
        start(app);
        url = 'http://'+app.address().address+':'+app.address().port;
        console.log('server sarted at : ',url);
        done();
    });
    after(function(done) {
        stop(app);
        console.log('stop server');
        done();
    });

    describe('MyApi', function(){
        it('should return 200 on /', function (done) {
            request(url)
            .get('/')
            .expect(200)
            .end(function(err, res){
                console.log('api test');
                if (err) return done(err)
                    done()
            })
        })
    });
    describe('Producer', function() {
        console.log('producer test');
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
    server.on('listening', function() {
            console.log('Express server started on port %s at %s', server.address().port, server.address().address);
    });
}

var stop = function(server){
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 15000);
    server.close();
}
