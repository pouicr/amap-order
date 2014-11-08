var controller = require('../../controllers/api/producerController.js');

module.exports = function (server) {
    // ### submition routes
    server.get('/api/producer', controller.list);
    server.get('/api/producer/:producer_id', controller.get);
    server.get('/api/producer/products/:producer_id', controller.getProducts);
    server.post('/api/producer', controller.validate, controller.update);
    server.post('/api/producer/:producer_id', controller.validate, controller.update);
    server.delete('/api/producer/:producer_id', controller.validate, controller.remove);
};
