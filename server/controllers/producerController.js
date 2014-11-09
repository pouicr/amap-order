var Producer = require('../db/producer'),
Product = require('../db/product'),
conf = require('../conf'),
log = require('../log'),
nodefn = require('when/node'),
when = require('when'),
request = require('request');


var submit = function (req, res, next){
    var id = req.params.producer_id;
    var producer;
    if(id){
        producer = Producer.findOne({_id: id},function(err,result){
            if(err){console.log('err : '+err); return next(err);}
            if(result){
                if(req.session.user.role != 'admin'){
                    return res.sendStatus(403);
                }
                fillProducer(req,producer,function(err,filledProducer){
                    console.log('fill order OK');
                    if(err){console.log('err : '+err); return next(err);}
                    filledProducer.save(function(err,result){
                        if(err){console.log('err : '+err); return next(err);}
                        return res.redirect('/producer/'+result._id);
                    });
                });
            }else{
                console.log("producer not found");
                return res.send(403);
            }
        });
    }else{
        producer = new Producer();
        fillProducer(req,producer,function(err,filledProducer){
            console.log('fill order OK');
            if(err){console.log('err : '+err); return next(err);}
            filledProducer.save(function(err,result){
                if(err){console.log('err : '+err); return next(err);}
                return res.redirect('/producer/'+result._id);
            });
        });
    }
};

var remove = function(req,res,next){

    console.log('TODO');
}



var form = function (req, res, next){
    request({
        url: conf.api_url+'/producer/'+req.params.producer_id,
        json: true
    },function(err,response,producer){
        if(err){log.error(err); return next(err);}
        log.debug('producer found : '+producer);
        request({
            url: conf.api_url+'/producer/products/'+producer.producer_id,
            json: true
        },function(err,response,products){
            if(err){log.error(err); return next(err);}
            log.debug('products found : '+products);
            var action = 'form';
            if(req.url.indexOf('view') > -1) {
                action = 'view';
            }
            return res.render('producer/'+action,{menu:req.session.menu,user:req.session.user, producer : producer, products : products});
        })
    });
}

var list = function (req, res, next){
    request({
        url: conf.api_url+'/producer',
        json: true
    },function(err,response,result){
        if(err){log.error(err); return next(err);}
        log.debug('producer found : '+result);
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
