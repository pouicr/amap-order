var 
/*root  = require('./api/root'),
    order = require('./api/order'),
    admin = require('./api/admin'),*/
    calendar = require('./api/calendar'),
    producer = require('./api/producer'),
    product = require('./api/product')
    ;

module.exports = function(server){
    return {
/*        admin: admin(server),
        order: order(server),*/
        producer: producer(server),
        product: product(server),
        calendar: calendar(server)
    }
};
