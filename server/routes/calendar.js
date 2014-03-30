var controller = require('../controllers/calendarController.js');

module.exports = function (server) {
    // ### submition routes
    server.get('/calendar/list', controller.list);
    server.get('/calendar', controller.newCalendar);
    server.get('/calendar/:calendar_id', controller.form);
    server.post('/calendar/:calendar_id', controller.validate, controller.submit);
    server.post('/calendar', controller.validate, controller.submitNew);
};
