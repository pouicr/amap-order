var controller = require('../../controllers/productController.js');

module.exports = function (server) {
    // ### submition routes
    var root = '/product';
    server.get(root+'/list', controller.list);
    server.get(root, controller.form);
    server.get(root+'/:product_id', controller.form);
    server.get(root+'/view/:product_id', controller.form);
    server.get(root+'/remove/:product_id', controller.validate, controller.remove);
    server.post(root+'/:product_id', controller.validate, controller.submit);
    server.post(root, controller.validate, controller.submit);
};
