var Order = require('../db/order'),
    Family = require('../db/family'),
    Db = require('../db/db'),
    when = require('when'),
    nodefn = require('when/node'),
    OrderCalendar = require('../db/orderCalendar'),
    Product = require('../db/product'),
    Producer = require('../db/producer');



var processKey = function(family,ref,key,value){
    var objId = key.split('_')[1];
    return Product.findOneById(objId)
    .then(function(product){
//        console.log('prod : '+product);
//        console.log('famil: '+family);
        return Order.process(ref,product,value,family);
    })
}

var processOrderGroup = function(ref,data,family){
    var processedKeys = [];
    for (p in data) {
        console.log('process to Key '+ p +' value => '+data[p]);
        if(data[p]){
            processedKeys.push(processKey(family,ref, p, data[p]));
        }
    }
    return when.all(processedKeys);
}

var submit = function (req, res, next){
    Family.findById(req.session.user.family._id).exec()
//    Family.findByName(req.session.user.family)
    .then(function(family) {
        return processOrderGroup(1,req.body,family);
    })
    .then(function(_order) {
        console.log('Saved !!!!!!!');
        return res.redirect('/order/');
    }, function(err){
        console.log('err on save order:'+err);
    });
};

var form = function (req, res, next){
    OrderCalendar.findCurrent()
    .then(function(ocal){
        if(ocal){
            Order.prepareData(ocal,req.session.user.family._id)
            .then(function(order){
                console.log('o = ' +order);
                return res.render('order/form',{menu : req.session.menu, user : req.session.user, cal : order});
            })
        }else{
            return res.render('order/form',{menu : req.session.menu, user : req.session.user});
        }
    });
};
	
var list = function (req, res, next){
    console.log('list');
	Order.find({family:req.session.user.family.id},function(err,result){
	    if(err){console.log('err : '+err); return next(err);}
	    var data;
	    if (!result){
	        data = {menu:req.session.menu, user:req.session.user};
	    }else{
	        data = {menu:req.session.menu, user:req.session.user, orders : result};
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
