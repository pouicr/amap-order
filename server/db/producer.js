var db = require('./db');

var Product = new db.Schema({
    name        :  { type: String, required: true }
  , desc        :  { type: String}
  , unit        :  { type: String, required: true }
  , price       :  { type: Number, required: true }    
  , update_date :  { type: Date, default: Date.now }
});

var Producer = new db.Schema({
    name       :  { type: String, required: true, index: true} //match: /[a-z]/ ,
  , desc       :  { type: String }
  , category   :  { type: String, required: true }
  , address    :  { type: String }
  , products   :  [ Product ]
  , date       :  { type: Date, default: Date.now }
});

// a setter
//Contrib.path('title').set(function (v) {
//  return capitalize(v);
//});

//Contrib.path('color').validate(function (value) {
//  return /blue|green|white|red|orange|periwinkle/i.test(value);
//}, 'Invalid color');


//middleware
Product.pre('save', function (next) {
    update_date = Date.now;
    next();
});

module.exports = {
    product:db.model('Product', Product),
    producer:db.model('Producer', Producer)
}
