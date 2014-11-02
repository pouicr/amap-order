var root  = require('./front/root'),
    order = require('./front/order'),
    admin = require('./front/admin'),
    calendar = require('./front/calendar'),
    producer = require('./front/producer')
    ;

module.exports = function(server){
    return {
        admin: admin(server),
        order: order(server),
        producer: producer(server),
        root: root(server),
        calendar: calendar(server)
    }
};
