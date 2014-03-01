var Contrib = require('../db/contrib');


module.exports = {
    submit: function (req, res, next){
        var id = req.params.contrib_id;
        var myContrib;
        //if there is an id
        if(id){
            myContrib = Contrib.findOne({_id: id},function(err,result){
                if(err){console.log('err : '+err); return next(err);}
                if(result){
                    if(result.author != req.session.user.id){
                       return res.send(403);
                    }
                    myContrib = result;
                    myContrib.title = req.body.title;
                    myContrib.sum = req.body.sum;
                    myContrib.save(function(err,result){
                        if(err){console.log('err : '+err); return next(err);}
		                return res.redirect('/form/'+myContrib._id);
                    });
                }else{
                    return res.send(403);
                }
            });
        }else{
            myContrib = new Contrib({author: req.session.user.id, title: req.body.title, sum: req.body.sum});
            myContrib.save(function(err,result){
                if(err){console.log('err : '+err); return next(err);}
		        return res.redirect('/form/'+result._id);
           });
        }
	},	
    form: function (req, res, next){
        var id = req.params.contrib_id;
        if(id){
            Contrib.findOne({_id: id},function(err,result){
    		    if(err){console.log('err : '+err); return next(err);}
    		    if(result){
                    if(result.author != req.session.user.id){
                        return res.send(403);
                    }
		            return res.render('contrib_form',{user:req.session.user,contrib : result});
		        }
	        });
        }else{
            return res.render('contrib_form',{user:req.session.user,contrib:{}});
        }
	},
    list: function (req, res, next){
		Contrib.find({author: req.session.user.id},function(err,result){
		    if(err){console.log('err : '+err); return next(err);}
		    var data;
		    if (!result){
		        data = {user:req.session.user, contribs : []};
		    }else{
		        data = {user:req.session.user, contribs : result};
		    }
    		return res.render('contrib_list',data);
		});
	},
    validate: function (req, res, next){
        var id = req.params.contrib_id;
	    if (!req.body.title || !req.body.sum){
	        req.params.error = 'Missing required data';
	        return res.render('contrib_form',{user:req.session.user,error:'Missing required data',contrib : {_id:req.params.contrib_id, title: req.body.title, sum: req.body.sum}});
	    }else{
	        return next();
	    }
	},
	csv_export: function (req, res, next){
        if(req.session.user.admin){
            return res.send(403);
        }else{
            Contrib.find({},function(err,result){
                if(err){console.log('err : '+err); return next(err);}
                var data = "";
                result.forEach(function (contrib) {
                    data += contrib.author;
                    data += "; " + contrib.title;
                    data += "; " + contrib.sum;
                    data += "\n";
                });
                res.header('Content-type', 'text/csv');
                res.send(data);
            });
        }
    }
}
