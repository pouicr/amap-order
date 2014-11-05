var 
/*root  = require('./api/root'),
    order = require('./api/order'),
    admin = require('./api/admin'),
    calendar = require('./api/calendar'),*/
    producer = require('./api/producer')
    ;

module.exports = function(server){
    return {
/*        admin: admin(server),
        order: order(server),*/
        producer: producer(server)
/*        root: root(server),
        calendar: calendar(server)*/
    }
};
