var Producer = require('../../db/producer'),
Product = require('../../db/product'),
rest = require('rest'),
conf = require('../../log'),
conf = require('../../conf');


var update = function (req, res, next){
    if(req.session.user.role != 'admin'){
        return res.sendStatus(403);
    }else{
        var id = req.params.producer_id;
        var producer = Producer.findOne({_id: id},function(err,result){
            if(err){console.log('err : '+err); return next(err);}
            if(result){
                console.log('TODO ');
                return res.sendStatus(200);
            }else{
                console.log("producer not found");
                return res.send(404);
            }
        });
    }
};

var remove = function(req,res,next){

    console.log('TODO');
}



var get = function (req, res, next){
    var id = req.params.producer_id;
    Producer.findById(id)
    .exec()
    .then(function(producer){
        return res.json(producer);
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
    validate :validate
}
