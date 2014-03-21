var Order = require('../db/order'),
    Family = require('../db/family'),
    Db = require('../db/db'),
    when = require('when'),
    nodefn = require('when/node');
    Producer = require('../db/producer');



var getFamily = function(aName){
    var deferred = when.defer();
    Family.findOne({name:aName}).exec(function(err,family){
        console.log('family  '+family);
        if(err){
            console.log('err : '+err);  
            deferred.reject(err);
        }else{
            deferred.resolve(family);
        }
    });
    return deferred.promise;
};


var getProduct = function(objId){
    return Producer.producer.findOne({'products._id':Db.Types.ObjectId(objId)}).exec()
    .then(function(producer) {
        var product = producer.products.id(Db.Types.ObjectId(objId));
        console.log('resolve product  '+ product);
        return when.resolve(product);
    }); 
};

var getOrder = function(product,family){
    var deferred = when.defer();
    Order.findOne({family_id: family._id, 'product.id':product._id})
    .exec(function(err,result){
        console.log('order found for product ? '+(result ? 'yes' : 'no'));
        if(err){
            console.log('err : '+err);  
            deferred.reject(err);
        }else{
            deferred.resolve({
                order: result,
                product: product
            });
        }
    }); 
    return deferred.promise;
};

var processOrder = function(anOrder,product,val,family){
    var deferred = when.defer();
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
            console.log('err : '+err);  
            deferred.reject(err);
        }else{
            deferred.resolve(result);
        }
    });
    return deferred.promise;
}

var processKey = function(family,key,value){
    var objId = key.split('_')[1];
    
    return getProduct(objId)
    .then(function(product){
        return getOrder(product, family);
    })
    .then(function(result){
        return processOrder(result.order,result.product,value,family);
    })
}

var processOrderGroup = function(order){
    var processedKeys = [];
    for (p in order.body) {
        console.log('process to Key '+ p +' value => '+order.body[p]);
        if(order.body[p]){
            processedKeys.push(processKey(order.family, p, order.body[p]));
        }
    }
    return when.all(processedKeys);
}


var saveOrder = function(order) {
    return getFamily('rodier')
    .then(function(family) {
        order.family = family;
        return processOrderGroup(order);
    })
    .then(function(order){ 
        console.log('Saved !!!!!!!');
        return when.resolve(order);
    },function(err){ 
        console.log('Error on saved :-( ');
        return when.reject(err);
    });
};

var submit = function (req, res, next){
    var order = {
        body: req.body
    };
    saveOrder(order)
    .then(function(_order) {
        return res.redirect('/order/');
    }, next);
};



var form = function (req, res, next){
    var id = req.params.order_id;
    
    Producer.producer.find({}).exec()
    .then(function(producers){
/*        if(id){
            Order.order.findOne({_id: id}).exec()
            .then(function(order){
                console.log('prepare'); 
                var data = prepareData(producers,order);
                return res.render('order/form',{user:req.session.user, producers : data});
            })
            .fail(function(err){
                console.log('err in form find order: '+err); 
                return next(err);
            });
        }else{*/
            return res.render('order/form',{user:req.session.user, producers : producers});
        //}
    },function(err){
        console.log('err in form : '+err); 
        return next(err);
    });
};
	
var list = function (req, res, next){
    console.log('list');
	Order.order.find({owner:req.session.user.id},function(err,result){
	    if(err){console.log('err : '+err); return next(err);}
	    var data;
	    if (!result){
	        data = {user:req.session.user};
	    }else{
	        data = {user:req.session.user, orders : result};
	    }
	    console.log('list data = '+data);
		return res.render('order/list',data);
	});
};
	
var validate = function (req, res, next){
    /*var id = req.params.contrib_id;
    if (!req.body.title || !req.body.sum){
        req.params.error = 'Missing required data';
        return res.render('contrib_form',{user:req.session.user,error:'Missing required data',contrib : {_id:req.params.contrib_id, title: req.body.title, sum: req.body.sum}});
    }else{
    }*/
        return next();
};



    
module.exports = {
    form : form,
    submit : submit,    
    validate : validate,
    list : list
}
