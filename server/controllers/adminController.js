var Config = require('../db/config');


var form = function (req, res, next){
    Config.get(function(err,result){
	    if(err){console.log('err : '+err); return next(err);}
	    if(result){
            return res.render('admin',{user:req.session.user,config : result});
        }else{
            return next('can not get config');
        }
    });
};


var update = function (req, res, next){
    Config.set({phase:req.body.phase, admins:req.body.admins.split(",")},function(err,result){
	    if(err){console.log('err : '+err); return next(err);}
	    if(result){
            return res.redirect('/admin');
        }else{
            return next('can not set config');
        }
    });
}

var authorize = function (req, res, next){
    if(req.session.user.admin){
        return next();
    }else{
        return res.send(403);
    }
}


module.exports = {
    form : form,
    update : update,    
    authorize : authorize 
}
