var Producer = require('../db/producer');


var init = function (req, res, next){
    var data = require('../../data/producer.json');
    data.forEach(function(producer){
        producer.save(function(err,result){
            if(err){console.log('err : '+err); return next(err);}
            console.log("producer saved : "+result);
            return res.redirect('/');
        });
    });
    
};

var submit = function (req, res, next){
    var id = req.params.producer_id;
    var producer;
    //if there is an id
    if(id){
        producer = Producer.producer.findOne({_id: id},function(err,result){
            if(err){console.log('err : '+err); return next(err);}
            if(result){
                if(!req.session.user.admin && result.referent != req.session.user.id){
                   return res.send(403);
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
                return res.send(403);
            }
        });
    }else{
        producer = new Producer.producer();
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


var form = function (req, res, next){
    var id = req.params.producer_id;
    Producer.producer.find({_id: id}).exec()
    .then(function(result){
        console.log('result : '+result); 
        return res.render('producer/form',{user:req.session.user, producer : result});
    }),function(err){
        console.log('err in form : '+err); 
        return next(err);
    };
};
	
var list = function (req, res, next){
	Producer.producer.find({},function(err,result){
	    if(err){console.log('err : '+err); return next(err);}
	    var data;
	    if (!result){
	        data = {user:req.session.user};
	    }else{
	        data = {user:req.session.user, producers : result};
	    }
	    console.log('list data = '+data);
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
    init : init,
    submit : submit,
    list :list,
    form : form,
    validate :validate
}
