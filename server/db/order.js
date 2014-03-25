var db = require('./db'),
    when = require('when');

var Order = new db.Schema({
    family_id    :  { type: db.Schema.Types.ObjectId, required: true, index: true} //match: /[a-z]/ ,
  , product      :  { 
        id       :  { type: db.Schema.Types.ObjectId, required: true},
        price    :  Number
    }
  , reference    :  { type: String,required:true }
  , amount       :  { type: Number,required:true }
  , order_date   :  { type: Date, default: Date.now }
  , delivery_date:  { type: Date }
});

Order.statics.findByProductAndFamily = function findByProductAndFamily(product,family){
    return this.model('Order').findOne({family_id: family._id, 'product.id':product._id})
    .exec()
    .then(function(order){
        return when.resolve({
            order: order,
            product: product
        });
    });
};

Order.statics.findByRefAndFamily = function findByRefAndFamily(ref,family){
    return this.model('Order').find({family_id: family._id, reference:ref})
    .sort('category')
    .exec()
    .then(function(orders){
        return when.resolve(orders);
    });
};

Order.statics.process = function process(anOrder,product,val,family){
    var order = anOrder;
    console.log('order = '+order);
    console.log('product = '+product);
    if(order){
        order.product.price = product.price;
        order.amount = parseInt(val);
        order.delivery_date = new Date('2014-04-22');
    }else{
        order = new Order({
        family_id : family._id,
        product : { 
            id : product._id,
            price : product.price},
        amount : parseInt(val),
        order_date : Date.now(),
        delivery_date : new Date('2014-04-11')
        });
    }
    console.log('order to be saved = '+order);
    order.save(function(err,result){
        if(err){
            return when.reject(err);
        }else{
            return when.resolve(result);
        }
    });
};

module.exports = db.model('Order', Order)
