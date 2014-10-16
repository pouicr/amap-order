var mongoose = require('mongoose');

console.log(process.env);
var db = mongoose.connect(process.env.MONGO_PORT_27017_TCP_ADDR,'mydb', process.env.MONGO_PORT_27017_TCP_PORT, function(err) {
  if (err) { throw err; }
});

module.exports = db;
