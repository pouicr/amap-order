var controller = require('../../controllers/api/producerController.js');

module.exports = function (server) {
    // ### submition routes
    server.get('/api/producer', controller.list);
    server.get('/api/producer/:producer_id', controller.get);
    server.post('/api/producer', controller.validate, controller.submit);
    server.post('/api/producer/:producer_id', controller.validate, controller.submit);
    server.delete('/api/producer/:producer_id', controller.validate, controller.remove);
};
