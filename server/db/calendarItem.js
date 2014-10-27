var db = require('./db'),
    when = require('when');

var CalendarItem = new db.Schema(
{
    reference    :  { type: db.Schema.Types.ObjectId, ref: 'Calendar', required: true }
  , delivery_date:  { type: Date, required: true }
  , product      :  { type: db.Schema.Types.ObjectId, ref: 'Product', required: true }
  , price        :  { type: Number, required: true }
});

module.exports =db.model('CalendarItem', CalendarItem);
