var mongoose = require('mongoose');


var db = mongoose.connect('localhost','mydb', '27017', function(err) {
  if (err) { throw err; }
});

module.exports = db;
