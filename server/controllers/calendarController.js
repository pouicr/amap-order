var Order = require('../db/order'),
    Family = require('../db/family'),
    Db = require('../db/db'),
    when = require('when'),
    OrderCalendar = require('../db/orderCalendar'),
    Product = require('../db/product'),
    moment = require('moment'),
    Producer = require('../db/producer');


var submit = function (req, res, next){
    var calId = req.params.calendar_id;
    OrderCalendar.process(calId,req.body)
    .then(function(cal) {
        return res.redirect('/calendar/'+cal._id);
    }, function(err){
        console.log('err on save calendar:'+err);
    });
};

var submitNew = function(req,res,next){
    OrderCalendar.initCalendar(req.body.calendar_name,req.body.begin,req.body.end)
    .then(function(calendar){
        return res.redirect('/calendar/'+calendar._id);
    });
}

var getLine = function(req,res,next){
    Product.findById(req.body.id)
    .exec()
    .then(function(product){
        return res.send(product);
    });
}
var dateFormatter = function(){
    return function(text,render){
        console.log(render(text));
        if(true){
            console.log('date = '+moment(this).format('MM/DD/YY'));
            return moment(this).format('MM/DD/YY');
        }else{
            return '';
        }
    }
}

var form = function (req, res, next){
    var calId = req.params.calendar_id;
    console.log('calendar id'+calId);
    OrderCalendar.findById(calId)
    .populate('cal.product')
    .exec()
    .then(function(result){
        if(!result){
            return res.redirect('/calendar/');
        }else{
            var data = {menu : req.session.menu, user : req.session.user, calendar : result, util : dateFormatter};
            console.log(data);
            return res.render('calendar/form',{menu : req.session.menu, user : req.session.user, calendar : result});
        }
        /*Product.find({})
        .exec()
        .then(function(products){
            return res.render('calendar/form',{menu : req.session.menu, user : req.session.user, calendar : result, products : products});
        });*/
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
    getLine : getLine,
    newCalendar:newCalendar,
    submitNew:submitNew
}
