var controller = require('../../controllers/orderController.js');

module.exports = function (server) {
    // ### submition routes
    server.get('/order/list', controller.list);
    server.get('/order', controller.form);
    server.get('/order/:order_id', controller.form);
    server.post('/order/:order_id', controller.validate, controller.submit);
    server.post('/order', controller.validate, controller.submit);
};
