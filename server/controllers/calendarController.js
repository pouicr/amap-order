var Order = require('../db/order'),
    Family = require('../db/family'),
    Db = require('../db/db'),
    when = require('when'),
    OrderCalendar = require('../db/orderCalendar'),
    Product = require('../db/product'),
    Producer = require('../db/producer');


var submit = function (req, res, next){
    var calId = req.params.calendar_id;
    console.log('calendar id'+calId);
    OrderCalendar.process(calId,req.body)
    .then(function(_order) {
        console.log('calendar Saved !!!!!!!');
        return res.redirect('/order/');
    }, function(err){
        console.log('err on save calendar:'+err);
    });
};

var submitNew = function(req,res,next){
    OrderCalendar.initCalendar(req.body.calendar_name)
    .then(function(calendar){
        return res.redirect('/calendar/'+calendar._id);
    });
}

var form = function (req, res, next){
    var calId = req.params.calendar_id;
    console.log('calendar id'+calId);
    OrderCalendar.findById(calId)
    .exec()
    .then(function(result){
        return res.render('calendar/form',{menu : req.session.menu, user : req.session.user, calendar : result});
    },function(err){
        console.log('err in form calendar : '+err);
        return next(err);
    });
};

var newCalendar = function (req, res, next){
    return res.render('calendar/new',{menu : req.session.menu, user : req.session.user});
};


var list = function (req, res, next){
    console.log('list calendar');
	OrderCalendar.find({},function(err,result){
	    if(err){console.log('err : '+err); return next(err);}
	    var data;
	    if (!result){
	        data = {menu:req.session.menu, user:req.session.user};
	    }else{
	        data = {menu:req.session.menu, user:req.session.user, orders : result};
	    }
	    console.log('calendar list data = '+data);
		return res.render('calendar/list',data);
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
    list : list,
    newCalendar:newCalendar,
    submitNew:submitNew
}
