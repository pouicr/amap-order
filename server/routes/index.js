var root  = require('./root'),
    order = require('./order'),
    admin = require('./admin'),
    producer = require('./producer');

module.exports = function(server){
    return {
        admin: admin(server),
        order: order(server),
        producer: producer(server),
        root: root(server)
    }
};
