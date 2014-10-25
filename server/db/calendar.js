var db = require('./db'),
CalendarItem = require('./calendarItem'),
when = require('when');

var Calendar = new db.Schema({
    reference      : { type: String , required: true, index: true}
    , openDate     : { type : Date, required: true }
    , endDate      : { type : Date, required: true }
});

Calendar.statics.process = function process (calId,data){
    console.log('process calendar,id= '+calId);
    var calendar = new(db.model('Calendar'))({
        reference: data.name,
        openDate: new Date(data.beginDate),
        endDate: new Date(data.endDate),
        calendarItems:[]
    })
    //var calData = calendar.toObject();
    //console.log('caldata = ',calData);
    db.model('Calendar').create(calendar)
    .then(function(cal){
        return cal;
    });
};

    /*    db.model('Calendar').update({reference: data.name},calData,{upsert: true},function(err, _cal) {
    db.model('Calendar').create(calendar,function(err,_calendar){
        if(err) return err;
        console.log("cal"+_calendar);
        return when.resolve(_calendar);
    })
          if (err) return err;
          console.log('saved _cal = ',_cal);
          var savedItem = []
          for(item in data.itemDates.split(",")){
          var calItem = new CalendarItem({
reference: _cal,
delivery_date: new Date(item),
products: []
});
calItem.save(function(err) {
if (err) throw err;
});
savedItem.push(calItem);
}
console.log('calitems saved');
return when.all (savedItem);
return _cal;
});
};*/

module.exports = db.model('Calendar', Calendar);
