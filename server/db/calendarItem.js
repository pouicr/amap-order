var db = require('./db'),
    when = require('when');

var CalendarItem = new db.Schema({
    reference    :  { type: db.Schema.Types.ObjectId, ref: 'Calendar', required:true }
  , delivery_date:  { type: Date }
  , products     :  [{type: db.Schema.Types.ObjectId, ref: 'Product'}]
});

module.exports = db.model('CalendarItem', CalendarItem);
