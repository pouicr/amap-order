var db = require('./db');

var Contrib = new db.Schema({
    author  :  { type: String, required: true, index: true} //match: /[a-z]/ ,
  , title   :  { type: String, required: true }
  , sum     :  { type: String }
  , date    :  { type: Date, default: Date.now }
//  , buff  :  Buffer
});

// a setter
//Contrib.path('title').set(function (v) {
//  return capitalize(v);
//});

//Contrib.path('color').validate(function (value) {
//  return /blue|green|white|red|orange|periwinkle/i.test(value);
//}, 'Invalid color');


// middleware
//Contrib.pre('save', function (next) {
//  console.log('Attention, ça va sauver');
//  next();
//});

module.exports = db.model('Contrib', Contrib);
