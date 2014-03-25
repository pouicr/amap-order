var db = require('./db'),
    when = require('when');  

var Family = new db.Schema({
    name   : { type : String, index: {unique: true},required: true }
   ,address: { type : String }
});

Family.statics.findByName = function findByName(name){
    return this.model('Family').findOne({name:name}).exec()
    .then(function(family){
        return when.resolve(family);
    });
}

module.exports = db.model('Family', Family);

