var controller = require('../../controllers/api/calendarController.js');

module.exports = function (server) {
    // ### submition routes
    server.get('/api/calendar', controller.list);
    server.get('/api/calendar/:calendar_id', controller.get);
    server.put('/api/calendar', controller.validate, controller.update);
    server.post('/api/calendar/:calendar_id', controller.validate, controller.update);
    server.delete('/api/calendar/:calendar_id', controller.validate, controller.remove);
};
