var Order = require('../db/order'),
    Family = require('../db/family'),
    Db = require('../db/db'),
    when = require('when'),
    nodefn = require('when/node'),
    OrderCalendar = require('../db/orderCalendar'),
    Product = require('../db/product'),
    Producer = require('../db/producer');



var processKey = function(family,key,value){
    var objId = key.split('_')[1];
    return Product.findOneById(objId)
    .then(function(product){
        return Order.findByProductAndFamily(product, family);
    })
    .then(function(result){
        return Order.process(result.order,result.product,value,family);
    })
}

var processOrderGroup = function(data,family){
    var processedKeys = [];
    for (p in data) {
        console.log('process to Key '+ p +' value => '+data[p]);
        if(data[p]){
            processedKeys.push(processKey(family, p, data[p]));
        }
    }
    return when.all(processedKeys);
}

var submit = function (req, res, next){
    Family.findByName(req.session.user.family)
    .then(function(family) {
        return processOrderGroup(req.body,family);
    })
    .then(function(_order) {
        console.log('Saved !!!!!!!');
        return res.redirect('/order/');
    }, next);
};

var prepareData = function(products,orders){
    return when.resolve(products);
}

var form = function (req, res, next){
    OrderCalendar.findOneByRef(1)
    .then(function(calendar){
        Product.findAllByCategory()
        .then(function(products){
            Order.findByRefAndFamily(calendar.ref,req.session.user.family_id._id)
            .then(function(orders){ 
                return prepareData(products,orders);
            })
            .then(function(order){
                return res.render('order/form',{user : req.session.user, products : order});
            },function(err){
                console.log('err in form find order: '+err); 
                return next(err);
            });
        },function(err){
            console.log('err in form : '+err); 
            return next(err);
        });
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
