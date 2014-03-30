var db = require('./db'),
    when = require('when'),
    Family = require('./family');

var Order = new db.Schema({
    family       :  { type: db.Schema.Types.ObjectId, ref:'Family', required: true, index: true} //match: /[a-z]/ ,
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
    return this.model('Order').findOne({family: family._id, 'product.id':product._id})
    .exec()
    .then(function(order){
        return when.resolve({
            order: order,
            product: product
        });
    });
};

Order.statics.findByRefFamilyAndProd = function (ref,family,prod){
    return this.model('Order').find({family: family._id, reference:ref,'product.id':prod._id})
    .exec()
    .then(function(orders){
        return when.resolve(orders);
    });
};

Order.statics.process = function process(ref,product,val,family){
    return this.findByRefFamilyAndProd(ref,family,product)
    .then(function(order){
        console.log('order = '+order);
        console.log('product = '+product);
        if(order != ''){
            console.log('pdt'+order.product);
            order.product.price = product.price;
            order.amount = parseInt(val);
            order.delivery_date = new Date('2014-04-22');
        }else{
            order = new(db.model('Order'))({
            family  : family._id,
            product : { 
                id : product._id,
                price : product.price},
            amount : parseInt(val),
            reference:ref,
            order_date : Date.now(),
            delivery_date : new Date('2014-04-11')
            });
        }
        console.log('order to be saved = '+order);
        var defered = when.defer();
        order.save(function(err,result){
            if(err){
                return defered.reject(err);
            }else{
                console.log('oder saved!!'+ result);
                return defered.resolve(result);
            }
        });
        return defered.promise;
    });
};

module.exports = db.model('Order', Order)
