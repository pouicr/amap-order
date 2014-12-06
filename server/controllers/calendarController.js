var Order = require('../db/order'),
Family = require('../db/family'),
log = require('../log'),
conf = require('../conf'),
request = require('request'),
Db = require('../db/db'),
when = require('when'),
Calendar = require('../db/calendar'),
Product = require('../db/product'),
moment = require('moment'),
Producer = require('../db/producer');


var submit = function (req, res, next){
    var id = req.params.calendar_id;
    var calendar = {
        reference: req.body.reference,
        openDate: req.body.openDate,
        endDate: req.body.endDate
    }
    if( typeof id !== 'undefined'){
        request({
            uri: conf.api_url+'/calendar/'+id,
            method: 'POST',
            json: calendar
        },function(err,response,body){
            if(err){log.error(err); return next(err);}
            log.debug('calendar updated');
            return res.redirect('/calendar/'+body.id);
        });
    }else{
        request({
            uri: conf.api_url+'/calendar',
            method: 'PUT',
            json: calendar
        },function(err,response,body){
            if(err){log.error(err); return next(err);}
            log.debug('calendar inserted : ',body);
            return res.redirect('/calendar/'+body.id);
        });
    }
};

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
    request({
        url: conf.api_url+'/calendar',
        json: true
    },function(err,response,result){
        if(err){log.error(err); return next(err);}
        log.debug('calendars found : ',result);
        var data;
        if (!result){
            data = {menu:req.session.menu, user:req.session.user};
        }else{
            data = {menu:req.session.menu, user:req.session.user, calendars : result};
        }
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
        list : list
    }
