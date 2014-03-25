var db = require('./db'),
    slugs = require('slugs'),
    when = require('when');

var Producer = new db.Schema({
    name       :  { type: String, required: true, index: true} //match: /[a-z]/ ,
  , desc       :  { type: String }
  , referent   :  { type: String }
  , info       :  { type: String }    
  , category   :  { type: String, required: true }
  , address    :  { type: String }
  , date       :  { type: Date, default: Date.now }
});

/*Product.statics.findOneById = function findOneById(objId){
    return this.model('Producer').findOne({'products._id':db.Types.ObjectId(objId)}).exec()
    .then(function(producer) {
        var product = producer.products.id(db.Types.ObjectId(objId));
        console.log('resolve product  '+ product);
        return when.resolve(product);
    });
}*/
Producer.methods.getSlugName = function slug(){
    return slugs(this.name);
}

module.exports = db.model('Producer', Producer)
