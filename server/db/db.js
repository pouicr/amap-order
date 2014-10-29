var mongoose = require('mongoose'),
    conf = require('../conf')
;

console.log('pouic : ',conf);
var db = mongoose.connect(conf.dburl, function(err) {
  if (err) { throw err; }
});

module.exports = db;
