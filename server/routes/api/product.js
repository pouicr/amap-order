var controller = require('../../controllers/api/productController.js');

module.exports = function (server) {
    // ### submition routes
    var root = '/api/product';
    server.get(root, controller.list);
    server.get(root+'/:product_id', controller.get);
    server.get(root+'/products/:product_id', controller.getProducts);
    server.put(root, controller.validate, controller.update);
    server.post(root, controller.validate, controller.update);
    server.post(root+'/:product_id', controller.validate, controller.update);
    server.delete(root+'/:product_id', controller.validate, controller.remove);
};
