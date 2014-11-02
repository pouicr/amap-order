var Producer = require('../../db/producer'),
Product = require('../../db/product');


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



var form = function (req, res, next){
    var id = req.params.producer_id;
    Producer.findById(id)
    .exec()
    .then(function(producer){
        if (producer){
            Product.find({producer:producer._id})
            .exec()
            .then(function(result){
                var action = 'form';
                if(req.url.indexOf('view') > -1) {
                    action = 'view';
                }
                return res.render('producer/'+action,{menu:req.session.menu,user:req.session.user, producer : producer, products:result});
            });
        }else{
            return res.render('producer/form',{menu:req.session.menu,user:req.session.user});
        }
    }),function(err){
        console.log('err in form : '+err); 
        return next(err);
    };
};

var list = function (req, res, next){
    Producer.find({},function(err,result){
        if(err){console.log('err : '+err); return next(err);}
        var data;
        if (!result){
            data = {menu:req.session.menu,user:req.session.user};
        }else{
            data = {menu:req.session.menu,user:req.session.user, producers : result};
        }
        return res.render('producer/list',data);
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
    remove : remove,
    submit : submit,
    list :list,
    form : form,
    validate :validate
}
