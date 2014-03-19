var db = require('./db');

var Order = new db.Schema({
    family_id    :  { type: db.Schema.Types.ObjectId, required: true, index: true} //match: /[a-z]/ ,
  , product      :  { 
        id       :  { type: db.Schema.Types.ObjectId, required: true},
        price    :  Number
    }
  , amount       :  { type: Number,required:true }
  , order_date   :  { type: Date, default: Date.now }
  , delivery_date:  { type: Date }
});

module.exports = db.model('Order', Order)
