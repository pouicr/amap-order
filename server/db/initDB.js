var db = require('./db'),
    when = require('when'),
    producerData = require('../../data/producer'),
//    Config = require('./config'),
    OrderCalendar = require('./orderCalendar'),
    User = require('./user'),
    Family = require('./family'),
    Producer = require('./producer'),
    Product = require('./product');
    
    
var init = function(){
    return removeAndInsertUsersAndFamilies()
    .then(removeAndInsertProducerAndProduct)
    .then(removeAndInsertOrderCalendar)
    .then(function(){
        console.log('DDDDDDDDDDDDDOOOOOOOOOOOONNEEE');
    },
    function(err){
        console.log('err on save : '+err);
    });
}

var removeAndInsertOrderCalendar = function(){
    return OrderCalendar.remove().exec()
    .then(function(){
        var deb = new Date();
        var fin = new Date(new Date(deb).setMonth(deb.getMonth()+1));
        console.log('deb = ',deb);
        console.log('fin = ',fin);
        return OrderCalendar.initCalendar('la commande du mois',deb,fin);
    });
}

var removeAndInsertUsersAndFamilies = function(){
    return Family.remove().exec()
    .then(function(){
        var deferedFamily = when.defer();
        var family = new Family({
            "name"  : "Rodier/Pujole", 
            "adress": "Chemin du bas Mortier"
        });
        Family.create(family)
        .then(function(_family){
            return User.remove().exec()
            .then(function(){
                var user = new User({
                    "login"  : "pouic",
                    "name"  : "pouic",
                    "pwd"   : "pouic",
                    "role"  : "admin",
                    "family": family._id
                });
                return User.create(user);
            }).then(function(){
                deferedFamily.resolve(_family);
            });
        });
    });
}

var removeAndInsertProducerAndProduct = function(){
    return Producer.remove().exec()
    .then(function(){
        var savedProducer = [];
        for (p in producerData ){
            var producer = new Producer(producerData[p]);
            savedProducer.push(Producer.create(producer)
            .then(function(_producer){
                return saveProducts(_producer);
            }));
        }
        return when.all(savedProducer);
    });
}

var saveProducts = function(producer){
    return Product.remove().exec()
    .then(function(){
        var savedProducts = [];
        var products = require('../../data/product_'+producer.getSlugName());
        for (prod in products ){
            var product = new Product(products[prod]);
            product.producer = producer._id;
            savedProducts.push(Product.create(product)
            .then(function(_product){
                return when.resolve(_product);
            }));
        }
        return when.all(savedProducts);
    });
}

module.exports = init();

