var Order = require('../db/order'),
Family = require('../db/family'),
Db = require('../db/db'),
when = require('when'),
OrderCalendar = require('../db/orderCalendar'),
Calendar = require('../db/calendar'),
CalendarItem = require('../db/calendarItem'),
Product = require('../db/product'),
moment = require('moment'),
Producer = require('../db/producer');


var submit = function (req, res, next){
    var calId = req.params.calendar_id;
    Calendar.process(calId,req.body)
    .then(function(cal) {
        return res.redirect('/calendar/'+cal._id);
    }, function(err){
        console.log('err on save calendar:'+err);
    });
};

var submit_old = function(req,res,next){
    var cal = new Calendar(
        {
        reference: req.body.reference,
        openDate: new Date(req.body.openDate),
        endDate: new Date(req.body.endDate)
    });
    Calendar.create(cal,function(err,_cal){
        if (err) return next(err);
        var dateTab = req.body.itemDates.split(",");
        for(item in req.body.itemDates.split(",")){
            var calItem = new CalendarItem({
                reference: _cal,
                delivery_date: new Date(dateTab[item]),
                products: []
            });
            calItem.save(function(err) {
                if (err) throw err;
            });
        }
        return res.redirect('/calendar/'+_cal._id);
    });
}

var getLine = function(req,res,next){
    Product.findById(req.body.id)
    .exec()
    .then(function(product){
        return res.send(product);
    });
}
var dateFormatter =  function(){
    return function(text,render){
        console.log(text);
        console.log(render(text));
        if(true){
            console.log('date = '+moment(this).format('MM/DD/YY'));
            return moment(this).format('MM/DD/YY');
        }else{
            return '';
        }
    }
}
var detail = function (req, res, next){
    var calId = req.params.calendar_id;
    Calendar.findById(calId)
    .exec()
    .then(function(result){
        if(!result){
            return res.redirect('/calendar/form');
        }else{
            Product.find({})
            .exec()
            .then(function(products){
                CalendarItem.find({reference: result._id})
                .exec()
                .then(function(calItem){
                    return res.render('calendar/detail',{menu : req.session.menu, user : req.session.user, calendar : result, products : products, items: calItem});
                });
            });
        }
    },function(err){
        console.log('err in form calendar : '+err);
        return next(err);
    });
};

var form = function (req, res, next){
    var calId = req.params.calendar_id;
    Calendar.findById(calId)
    .populate('cal.calendarItems')
    .exec()
    .then(function(result){
        if(!result){
            return res.render('calendar/form',{menu : req.session.menu, user : req.session.user});
        }else{
            return res.render('calendar/form',{menu : req.session.menu, user : req.session.user, calendar : result});
        }
    },function(err){
        console.log('err in form calendar : '+err);
        return next(err);
    });
};


var list = function (req, res, next){
    console.log('list calendar');
    Calendar.find({},function(err,result){
        if(err){console.log('err : '+err); return next(err);}
        var data;
        if (!result){
            data = {menu:req.session.menu, user:req.session.user};
        }else{
            data = {menu:req.session.menu, user:req.session.user, calendars : result};
        }
        console.log('calendar list data = %s',data);
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
        detail : detail,
        validate : validate,
        list : list,
        getLine : getLine
    }
