var Product = require('../../db/product'),
log = require('../../log'),
conf = require('../../conf');


var update = function (req, res, next){
    if(req.session.user.role != 'admin'){
        return res.sendStatus(403);
    }else{
        var id = req.params.producer_id;
        if (id){
            Producer.findOne({_id: id},function(err,_producer){
                if(err){log.error('err : '+err); return next(err);}
                if(_producer){
                    _producer.name = req.body.name;
                    _producer.desc = req.body.desc;
                    _producer.category = req.body.category;
                    _producer.referent = req.body.referent;
                    _producer.save();
                    return res.sendStatus(200);
                }else{
                    return res.sendStatus(404);
                }
            });
        }else{
            Producer.create(req.body,function(err,producer){
                return res.json({id:producer._id});
            });
        }
    }
};

var remove = function(req,res,next){
    if(req.session.user.role != 'admin'){
        return res.sendStatus(403);
    }else{
        var id = req.params.product_id;
        Product.findById(id,function(err,_product){
            if(err){log.error('err : '+err); return next(err);}
            _product.available = false;
            _product.save();
            return res.json(_product);
        });
    }
}



var get = function (req, res, next){
    var id = req.params.producer_id;
    Producer.findById(id)
    .exec()
    .then(function(producer){
        if(!producer){
            res.status(404).json({error:'Not found'});
        }
        return res.json(producer);
    }),function(err){
        log.error(err); 
        return next(err);
    };
};

var getProducts = function (req, res, next){
    var id = req.params.producer_id;
    Product.findByProducer(id)
    .then(function(products){
        return res.json(products);
    }),function(err){
        log.error(err); 
        return next(err);
    };
};

var list = function (req, res, next){
    var limit = conf.limit;
    var skip = 0;
    if (req.query.limit){
        limit = req.query.limit;
    }
    if (req.query.skip){
        skip = req.query.skip;
    }
    Producer.find({})
    .skip(skip)
    .limit(limit)
    .sort({
        name: 1
    })
    .exec()
    .then(function(result){
        return res.json(result);
    }),function(err){
        console.log('err : '+err);
        return next(err);
    };
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
    remove : remove,
    update : update,
    list :list,
    get : get,
    getProducts : getProducts,
    get : get,
    validate :validate
}
