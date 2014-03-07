var Order = require('../db/order'),
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

var fillOrder = function(req, order, cb){
    var amount =  new Number(order.amount || 0);
    Producer.producer.find({}).exec()
    .then(function(producers){
        //for each producer
        producers.forEach(function(producer){
            //for each product
            producer.products.forEach(function(product){
                //check if value exist for this product in the order
                var qty_1 = parseInt(req.body['qty_'+product._id+'_s1']) || 0;
                var qty_2 = parseInt(req.body['qty_'+product._id+'_s2']) || 0;
                var qty_3 = parseInt(req.body['qty_'+product._id+'_s3']) || 0;
                var qty_4 = parseInt(req.body['qty_'+product._id+'_s4']) || 0;                                
                var qty_5 = parseInt(req.body['qty_'+product._id+'_s5']) || 0;                
                if(qty_1 || qty_2 || qty_3 || qty_4 || qty_5){
                    var newline = true;
                    var line = new Order.line();
                    for(var i = 0; i < order.lines.length; i++) {
                        if (order.lines[i].product_id.equals(product._id)) {
                            newline = false;
                            line = order.lines[i];
                            break;
                        }
                    }
                    if (!newline){
                        amount -= line.line_sum;
                    }
                    line.product_id = product._id;
                    line.quantity_s1 = qty_1;
                    line.quantity_s2 = qty_2;
                    line.quantity_s3 = qty_3;
                    line.quantity_s4 = qty_4;   
                    line.quantity_s5 = qty_5;     
                    line_sum = new Number(0);
                    line_sum += (qty_1*product.price);
                    line_sum += (qty_2*product.price);
                    line_sum += (qty_3*product.price);
                    line_sum += (qty_4*product.price);
                    line_sum += (qty_5*product.price);
                    amount += line_sum;
                    line.line_sum = line_sum;
                    if (newline){
                        order.lines.push(line);
                    }
                } else {
                    for(var i = 0; i < order.lines.length; i++) {
                        if (order.lines[i].product_id.equals(product._id)) {
                            amount -= order.lines[i].line_sum;
                            order.lines.splice(i,1);
                            break;
                        }
                    }
                }
            });
        });
        order.order_ref = req.session.order_id;
        order.amount = Math.round(amount*100)/100;
        order.owner = req.session.user.id;
        return cb(null,order);
    });
};

var submit = function (req, res, next){
    var id = req.params.order_id;
    var order;
    //if there is an id
    if(id){
        order = Order.order.findOne({_id: id},function(err,result){
            if(err){console.log('err : '+err); return next(err);}
            if(result){
                if(!req.session.user.admin && result.owner != req.session.user.id){
                   return res.send(403);
                }
                fillOrder(req,result,function(err,order){
                    console.log('update order OK');
                    if(err){console.log('err : '+err); return next(err);}
                    order.save(function(err,result){
                        if(err){console.log('err : '+err); return next(err);}
            	        return res.redirect('/order/'+result._id);
	                });
                });
            }else{
                return res.send(403);
            }
        });
    }else{
        order = new Order.order();
        fillOrder(req,order,function(err,order){
            console.log('fill order OK');
            if(err){console.log('err : '+err); return next(err);}
            order.save(function(err,result){
                if(err){console.log('err : '+err); return next(err);}
    	        return res.redirect('/order/'+result._id);
	        });
        });
    }
};


var form = function (req, res, next){
var id = req.params.order_id;
    Producer.producer.find({}).exec()
    .then(function(producers){
        if(id){
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
        }else{
            return res.render('order/form',{user:req.session.user, producers : producers});
        }
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
