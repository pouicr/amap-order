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
    return removeAndInsertOrderCalendar()
//    .then(removeAndInsertConfig)
    .then(removeAndInsertUsersAndFamilies)
    .then(removeAndInsertProducerAndProduct,
    function(err){
        console.log('err on save : '+err);
    });
}

var removeAndInsertOrderCalendar = function(){
    return OrderCalendar.remove().exec()
    .then(function(){
        var orderCalendar = new OrderCalendar({
            "name" : "Commande du mois", 
            "ref" : 1
        });
        orderCalendar.save(function(err){
            if(err){console.log('err : '+err);}
            console.log('orderCalendar saved');
        });
        return when.resolve(orderCalendar);
    });
}
/*
var removeAndInsertConfig = function(orderCal){
    return Config.remove().exec()
    .then(function(){
        var conf = new Config({
            "name" : "admin", 
            "order_id" : orderCal._id
        });
        conf.save(function(err){
            if(err){console.log('err : '+err);}
            console.log('Config saved');
        });
        return when.resolve(conf);
    })
}
*/
var removeAndInsertUsersAndFamilies = function(){
    return Family.remove().exec()
    .then(function(){
        var deferedFamily = when.defer();
        var family = new Family({
            "name"  : "Rodier/Pujole", 
            "adress": "Chemin du bas Mortier"
        });
        family.save(function(err,result){
            if(err){
                console.log('err : '+err);
                deferedFamily.reject(err);
            }else{
                return User.remove().exec()
                .then(function(){
                    var defered = when.defer();
                    var user = new User({
                        "login"  : "pouic",
                        "name"  : "pouic",
                        "pwd"   : "pouic",
                        "role"  : "admin",
                        "family": family._id
                    });
                    user.save(function(err,res){
                        if(err){
                            console.log('err : '+err);
                            defered.reject(err);
                        }else{
                            defered.resolve(res);
                        }
                    });
                    return defered.promise;
                }).then(function(){
                    deferedFamily.resolve(result);
                },function(err){
                    console.log('failed');
                });
            }                
        });
        console.log('return family promise');
        return deferedFamily.promise;
    });
}

var removeAndInsertProducerAndProduct = function(){
    return Producer.remove().exec()
    .then(function(){
        var savedProducer = [];
        for (p in producerData ){
            var defered = when.defer();
            savedProducer.push(defered);
            var producer = new Producer(producerData[p]);
            producer.save(function(err,res){
                if(err){
                    console.log('err : '+err);
                    defered.reject(err);
                }else{
                    saveProducts(res)
                    .then(function(){
                        defered.resolve(res);
                    },function(err){
                        defered.reject(err);
                    });
                }
            });
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
            var defered = when.defer();
            savedProducts.push(defered);
            var product = new Product(products[prod]);
            product.producer = producer._id;
            product.save(function(err,res){
                if(err){
                    console.log('err : '+err);
                    defered.reject(err);
                }else{
                    defered.resolve(res);
                }
            });
        }
        return when.all(savedProducts);
    });
}

module.exports = init();

