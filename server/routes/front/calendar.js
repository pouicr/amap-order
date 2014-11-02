var controller = require('../../controllers/calendarController.js');

module.exports = function (server) {
    // ### submition routes
    server.get('/calendar/list', controller.list);
    server.get('/calendar', controller.form);
    server.get('/calendar/:calendar_id', controller.form);
    server.get('/calendar/detail/:calendar_id', controller.detail);
    server.post('/calendar/getLine', controller.validate, controller.getLine);
    server.post('/calendar/:calendar_id', controller.validate, controller.submit);
    server.post('/calendar', controller.validate, controller.submit);
};
