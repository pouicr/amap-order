var controller = require('../controllers/producerController.js');

module.exports = function (server) {
    // ### submition routes
    server.get('/producer/list', controller.list);
    server.get('/producer', controller.form);
    server.get('/producer/:producer_id', controller.form);
    server.post('/producer/:producer_id', controller.validate, controller.submit);
    server.del('/producer/:producer_id', controller.validate, controller.remove);
    server.post('/producer', controller.validate, controller.submit);
};
