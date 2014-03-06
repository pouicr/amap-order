var controller = require('../controllers/producerController.js');

module.exports = function (server) {
    // ### submition routes
    server.get('/producer/init', controller.init);
};
