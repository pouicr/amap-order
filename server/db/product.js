var db = require('./db'),
    when = require('when');

var Product = new db.Schema({
    name        :  { type: String, required: true }
  , category    :  { type: String, required: true, index: true}
  , desc        :  { type: String}
  , unit        :  { type: String, required: true }
  , price       :  { type: Number, required: true }    
  , update_date :  { type: Date, default: Date.now }
  , producer_id :  { type: db.Schema.Types.ObjectId, required: true}
});

Product.statics.findOneById = function findOneById(objId){
    return this.model('Product').findById(objId).exec()
    .then(function(product) {
        return when.resolve(product);
    });
}

Product.statics.findAllByCategory = function findAllByCategory(){
    return this.model('Product').find({})
    .sort('category')
    .exec()
    .then(function(products) {
        return when.resolve(products);
    });
}

Product.statics.findByCategory = function findByCategory(category){
    return this.model('Product').find({category:category}).exec()
    .then(function(products) {
        return when.resolve(products);
    });
}

//middleware
Product.pre('save', function (next) {
    update_date = Date.now;
    next();
});

module.exports = db.model('Product', Product)
