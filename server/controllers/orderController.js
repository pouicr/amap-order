var Order = require('../db/order'),
    Family = require('../db/family'),
    Db = require('../db/db'),
    async = require('async'),
    Producer = require('../db/producer');



var prepareData = function(producers,order){
    var prod = JSON.parse(JSON.stringify(producers));
    console.log('start foreach');

    //for each producer
    prod.forEach(function(producer){
        //for each product
        producer.products.forEach(function(product){
            for(var i = 0; i < order.lines.length; i++) {
                //console.log(' product = '+product._id +' line = '+order.lines[i].product_id); 
                if (order.lines[i].product_id.equals(product._id)) {
                    product.s1 = order.lines[i].quantity_s1 || 0;
                    product.s2 = order.lines[i].quantity_s2 || 0;
                    product.s3 = order.lines[i].quantity_s3 || 0;
                    product.s4 = order.lines[i].quantity_s4 || 0;
                    product.s5 = order.lines[i].quantity_s5 || 0;
                    break;
                }
            }
        });
    });
    prod.order_ref = order.order_ref;
    prod.amount = order.amount;
    prod.order_id = order._id;
    return prod;
};

var saveOrder = function(req, cb){
    Family.findOne({name:'rodier'}).exec()
    .then(function(family){
        var fid = family._id;
        console.log('family found = '+family);
        async.eachSeries(Object.keys(req.body),function(key,next){
            if(req.body[key]){
                var objId = key.substring(4,28);                
                console.log('non empty key = '+objId+" - "+ Db.Types.ObjectId(objId));
                Producer.producer.findOne({'products._id':Db.Types.ObjectId(objId)})
                .exec(function(err,producer){
                    //console.log('producER '+producer); 
                    //console.log('products '+producer.name);
                    var product = producer.products.id(Db.Types.ObjectId(objId));
                    console.log('product found ? '+(product ? 'yes' : 'no'));
                    if(product){
                        Order.findOne({family_id: fid, 'product.id':Db.Types.ObjectId(objId)})
                        .exec(function(err,result){
                            console.log('order found for product ? '+(result ? 'yes' : 'no'));
                            if(err){console.log('err : '+err); return next(err);}
                            var order = result;
                            if(result){
                                console.log('exist !');
                                order.product.price = product.price;
                                order.amount = parseInt(req.body[key]);
                                order.delivery_date = new Date('2014-04-22');
                            }else{
                                order = new Order({
                                    family_id : fid,
                                    product : {
                                        id : product._id,
                                        price : product.price},
                                    amount : parseInt(req.body[key]),
                                    order_date : Date.now(),
                                    delivery_date : new Date('2014-04-11')
                                });
                            }
                            console.log('family found = '+family);
                            console.log('order to be saved = '+order);
                            order.save(function(err,result){
                                if(err){console.log('err : '+err); return cb(err);}
	                        });
                        });
                        return next();
                    }else{
                        return next(new Error('product not found'));
                    }
                });
            }else{
                console.log('vide');
                return next();
            }
        },function(err){
            console.log('ALL DONE NOW !!!!');
            return cb(err);
        });
    });
}

var submit = function (req, res, next){
    console.log('submit order');
    saveOrder(req, function(err,cb){
        console.log('save order OK');
        if(err){console.log('err : '+err); return next(err);}
        return res.redirect('/order/');
    });
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
