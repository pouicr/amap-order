var db = require('./db');

var Line = new db.Schema({
    product_id  :  { type: db.Schema.Types.ObjectId, required: true} //match: /[a-z]/ ,
  , quantity_s1 :  { type: Number}
  , quantity_s2 :  { type: Number}
  , quantity_s3 :  { type: Number}
  , quantity_s4 :  { type: Number}    
  , quantity_s5 :  { type: Number}    
  , line_sum     :  { type: Number }
});

var Order = new db.Schema({
    owner       :  { type: String, required: true, index: true} //match: /[a-z]/ ,
  , order_ref   :  { type: String, required: true }
  , lines       :  [Line]
  , amount      :  { type: Number,required:true }
  , date        :  { type: Date, default: Date.now }
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

module.exports = {
    order:db.model('Order', Order),
    line:db.model('Line', Line)
}
