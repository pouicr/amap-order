var controller = require('../controllers/adminController.js');

module.exports = function (server) {
    // ### admin routes
    server.get('/admin', controller.authorize, controller.form);
    server.post('/admin', controller.authorize, controller.update);
};
