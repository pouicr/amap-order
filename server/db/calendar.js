var db = require('./db'),
CalendarItem = require('./calendarItem'),
moment = require('moment'),
when = require('when');

var Calendar = new db.Schema(
    {
    reference       : { type: String , required: true, index: true}
    , openDate      : { type : Date, required: true}
    , endDate       : { type : Date, required: true}
    , distDates     : [ { type : Date} ]
});

Calendar.statics.update = function process (calId,data){
    return this.model('Calendar').findById(calId)
    .exec()
    .then(function(calendar){
        if ( calendar != null){
            calendar.reference = data.reference;
            calendar.openDate = new Date(moment(data.openDate,'DD/MM/YYYY'));
            calendar.endDate = new Date(moment(data.endDate,'DD/MM/YYYY'));
            if (data.distDates != ''){
                dates = data.distDates.split(',');
                calendar.distDates = Array();
                for (d in dates){
                    var dateToPush = new Date(moment(dates[d],'DD/MM/YYYY'));
                    calendar.distDates.push(dateToPush);
                }
            }
            calendar.save();
            return calendar;
        }else{
            calendar = new(db.model('Calendar'))({
                reference: data.reference,
                openDate: new Date(moment(data.openDate,'DD/MM/YYYY')),
                endDate: new Date(moment(data.endDate,'DD/MM/YYYY'))
            });
            if (data.distDates != ''){
                dates = data.distDates.split(',');
                for (d in dates){
                    calendar.distDates.push(new Date(moment(dates[d],'DD/MM/YYYY')));
                }
            }
            return db.model('Calendar').create(calendar,function(err, cal){
                return cal;
            });
        } 
    });
};

Calendar.statics.findCurrent = function findCurrent(){
    return this.model('Calendar').find({openDate : { $lt : new Date()}, endDate : { $gt : new Date()}})
    .exec()
    .then(function(cal) {
        console.log('cal found ',cal);
        return when.resolve(cal);
    });
}

module.exports = db.model('Calendar', Calendar);
