var db = require('./db'),
CalendarItem = require('./calendarItem'),
moment = require('moment'),
when = require('when');

var Calendar = new db.Schema(
    {
    reference      : { type: String , required: true, index: true}
    , openDate     : { type : Date, required: true, get : formatedDate }
    , endDate      : { type : Date, required: true, get : formatedDate }
});

Calendar.statics.process = function process (calId,data){
    return this.model('Calendar').findById(calId)
    .exec()
    .then(function(calendar){
        console.log('calendddar found : ',calendar);
        if ( calendar != null){
            console.log('non vide  ');
            calendar.reference = data.reference;
            calendar.openDate = new Date(moment(data.openDate,'DD/MM/YYYY'));
            calendar.endDate = new Date(moment(data.endDate,'DD/MM/YYYY'));
        }else{
            console.log('vide !!!!');
            calendar = new(db.model('Calendar'))({
                reference: data.reference,
                openDate: new Date(moment(data.openDate,'DD/MM/YYYY')),
                endDate: new Date(moment(data.endDate,'DD/MM/YYYY'))
            });
            return db.model('Calendar').create(calendar)
            .then(function(cal){ 
                return when.resolve(cal);
            });
        } 
        var dataCal = calendar.toObject();
        delete dataCal._id;
        console.log('will save :  ',calendar);
        return db.model('Calendar').update({reference: calendar.reference},calendar,{upsert: true},function(err,cal){
            console.log('Saved !!!! ');
            return when.resolve(cal);
        });

        //.then(function(cal){
        //    return when.resolve(cal);
        //});
    });
};
function formatedDate (val){
    return moment(val).format('DD/MM/YYYY');
}
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
