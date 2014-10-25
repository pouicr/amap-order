var db = require('./db'),
    when = require('when'),
    producerData = require('../../data/producer'),
//    Config = require('./config'),
    OrderCalendar = require('./orderCalendar'),
    Calendar = require('./calendar'),
    CalendarItem = require('./calendarItem'),
    User = require('./user'),
    Family = require('./family'),
    Producer = require('./producer'),
    Product = require('./product');
    
    
var init = function(){
    return removeAndInsertUsersAndFamilies()
    .then(removeAndInsertProducerAndProduct)
    .then(removeAndInsertCalendar)
    .then(function(){
        console.log('DDDDDDDDDDDDDOOOOOOOOOOOONNEEE');
    },
    function(err){
        console.log('err on save : '+err);
    });
}

var removeAndInsertCalendar = function(){
    return Calendar.remove().exec()
    .then(function(){
    console.log('pwet');
        var cal = new Calendar('la commande du mois',[]);
        Calendar.create(cal)
        .then(function(_cal){
/*        var cal = new (db.model('Calendar'))({
            reference: 'la commande du mois',
            calendarItems: []
        });*/
            console.log('cal : %s', _cal);
            var products = this.model('Product').find();
            //var fin = new Date(new Date(deb).setMonth(deb.getMonth()+1));
            var savedItem = [];
            savedItem.push(CalendarItem.create(_cal._id,new Date(),products));
            savedItem.push(CalendarItem.create(_cal._id,new Date(new Date(deb).setWeek(deb.getWeek()+1),products)));
            cal.calendarItems = savedItem;
            return when.all(savedItem);
        });
    }),function(err){
        console.log('err on calendar insert : '+err);
    };
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

