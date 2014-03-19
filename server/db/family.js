var db = require('./db');  

var Family = new db.Schema({
    name   : { type : String, index: {unique: true},required: true }
   ,address: { type : String }
});


module.exports = db.model('Family', Family);

