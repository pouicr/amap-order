var db = require('./db'),
    when = require('when');  

var OrderCalendar = new db.Schema({
    name   : { type : String, required: true }
   ,ref    : { type : Number ,required: true}
});

OrderCalendar.statics.findOneByRef = function findOneByRef(objId){
    return this.model('OrderCalendar').find({ref:objId})
    .exec()
    .then(function(ocal) {
        return when.resolve(ocal);
    });
}

module.exports = db.model('OrderCalendar', OrderCalendar);
