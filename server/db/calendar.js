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
            console.log('will save :  ',calendar);
            return db.model('Calendar').update({reference: calendar.reference},calendar,{upsert: true},function(err,cal){
                console.log('Saved !!!! ');
                return when.resolve(cal);
            });
        }else{
            console.log('vide !!!!');
            calendar = new(db.model('Calendar'))({
                reference: data.reference,
                openDate: new Date(moment(data.openDate,'DD/MM/YYYY')),
                endDate: new Date(moment(data.endDate,'DD/MM/YYYY'))
            });
            return db.model('Calendar').create(calendar)
            .then(function(cal){
                console.log('calendar create, will return',calendar);
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
    });
};
function formatedDate (val){
    return moment(val).format('DD/MM/YYYY');
}

module.exports = db.model('Calendar', Calendar);
