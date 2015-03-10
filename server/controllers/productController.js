var Product = require('../db/product'),
conf = require('../conf'),
log = require('../log'),
nodefn = require('when/node'),
when = require('when'),
request = require('request');


var submit = function (req, res, next){
    var id = req.params.producer_id;
    var producer={
        name: req.body.name,
        desc: req.body.description,
        referent: req.body.referent,
        category: req.body.category
    };
    if(id){
        request({
            uri: conf.api_url+'/producer/'+id,
            method: 'POST',
            body: producer,
            json: true
        },function(err,response,body){
            if(err){log.error(err); return next(err);}
            log.debug('producer updated');
            return res.redirect('/producer/'+id);
        });
    }else{
        request({
            uri: conf.api_url+'/producer',
            method: 'PUT',
            json: producer
        },function(err,response,body){
            if(err){log.error(err); return next(err);}
            log.debug('producer inserted : ',body);
            return res.redirect('/producer/view/'+body.id);
        });
    }
};

var remove = function(req,res,next){
    request({
        uri: conf.api_url+'/product/'+req.params.product_id,
        method: 'DELETE',
        json: true
    },function(err,response,product){
        if(err){log.error(err); return next(err);}
        log.debug('product deleted : ',product);
        return res.redirect('/producer/'+product.producer);
    });
}

var form = function (req, res, next){
    if( typeof req.params.producer_id !== 'undefined'){
        request({
            url: conf.api_url+'/producer/'+req.params.producer_id,
            json: true
        },function(err,response,producer){
            if(err){log.error(err); return next(err);}
            if(response.statusCode == 200){
                log.debug('producer found : '+producer);
                request({
                    url: conf.api_url+'/producer/products/'+producer._id,
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
            }else{
                return res.redirect('/producer/list');
            }
        });
    }else{
        return res.render('producer/form',{menu:req.session.menu,user:req.session.user});
    }
}

var list = function (req, res, next){
    request({
        url: conf.api_url+'/producer',
        json: true
    },function(err,response,result){
        if(err){log.error(err); return next(err);}
        log.debug('producer found : ',result);
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
