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
        endDate: req.body.endDate,
        distDates: req.body.distDates
    }
    if( typeof id !== 'undefined'){
        request({
            uri: conf.api_url+'/calendar/'+id,
            method: 'POST',
            json: calendar
        },function(err,response,body){
            if(err){log.error(err); return next(err);}
            log.debug('calendar updated',body);
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

var form = function (req, res, next){
    var id = req.params.calendar_id;
    if( typeof id !== 'undefined'){
        request({
            uri: conf.api_url+'/calendar/'+id,
            method: 'GET',
            json: true
        },function(err,response,_calendar){
            _calendar.openDate = moment(_calendar.openDate).format('DD/MM/YYYY');
            _calendar.endDate = moment(_calendar.endDate).format('DD/MM/YYYY');
            console.log('calendar = ',_calendar);
            var distDates = _calendar.distDates;
            var formatedDistDates = Array();
            for (d in distDates){
                formatedDistDates.push(moment(distDates[d]).format('DD/MM/YYYY'));
            }
            _calendar.distDates = formatedDistDates;
            return res.render('calendar/form',{menu : req.session.menu, user : req.session.user, calendar : _calendar });
        });
    }else{
        return res.render('calendar/form',{menu : req.session.menu, user : req.session.user});
    }
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
    validate : validate,
    list : list
}
