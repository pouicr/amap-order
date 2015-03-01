var Producer = require('../../db/producer'),
Product = require('../../db/product'),
Calendar = require('../../db/calendar'),
log = require('../../log'),
conf = require('../../conf');


var update = function (req, res, next){
    log.debug('insert/update calendar');
    if(req.session.user.role != 'admin'){
        return res.sendStatus(403);
    }else{
        var id = req.params.calendar_id;
        Calendar.update(id,req.body)
        .then(function(_calendar){
            return res.json({id:_calendar._id});
        },function(){
            return res.sendStatus(404);
        });
    };
};

var addDistDate = function (req, res, next){
    log.debug('Add calendar distribution date');
    if(req.session.user.role != 'admin'){
        return res.sendStatus(403);
    }else{
        var id = req.params.calendar_id;
        Calendar.findById(id)
        .exec()
        .then(function(_calendar){
            if(!calendar){
                res.status(404).json({error:'Not found'});
            }
            var dateToPush = new Date(moment(req.params.date,'DD/MM/YYYY'));
            if(typeof _calendar.distDates[dateToPush] === 'undefined') {
                _calendar.distDates.push(dateToPush);
            } else {
                log.debug('Date already exist');
            }
            return res.json(_calendar.distDates);
        },function(){
            return res.sendStatus(404);
        });
    }
}

var removeDistDate = function (req, res, next){
    log.debug('Remove calendar distribution date');
    if(req.session.user.role != 'admin'){
        return res.sendStatus(403);
    }else{
        var id = req.params.calendar_id;
        Calendar.findById(id)
        .exec()
        .then(function(_calendar){
            if(!calendar){
                res.status(404).json({error:'Not found'});
            }
            var dateToPoP = new Date(moment(req.params.date,'DD/MM/YYYY'));
            _calendar.distDates.pop(dateToPoP);
            return res.json(_calendar.distDates);
        },function(){
            return res.sendStatus(404);
        });
    }

}


var remove = function(req,res,next){
    if(req.session.user.role != 'admin'){
        return res.sendStatus(403);
    }else{
        var id = req.params.calendar_id;
        Calendar.findById(id)
        .remove()
        .exec()
        .then(function(err,_calendar){
            if(err){log.error('err : '+err); return next(err);}
            return res.sendStatus(200);
        });
    }
}

var get = function (req, res, next){
    var id = req.params.calendar_id;
    log.debug('get cal : ',id);
    Calendar.findById(id)
    .exec()
    .then(function(calendar){
        if(!calendar){
            res.status(404).json({error:'Not found'});
        }
        return res.json(calendar);
    }),function(err){
        log.error(err); 
        return next(err);
    };
};

var getCurrent = function (req, res, next){
    log.debug('get current cal ');
    Calendar.getCurrent()
    .then(function(calendar){
        if(!calendar){
            res.status(404).json({error:'Not found'});
        }
        return res.json(calendar);
    }),function(err){
        log.error(err); 
        return next(err);
    };
};

var list = function (req, res, next){
    var limit = conf.limit;
    var skip = 0;
    if (req.query.limit){
        limit = req.query.limit;
    }
    if (req.query.skip){
        skip = req.query.skip;
    }
    Calendar.find({})
    .skip(skip)
    .limit(limit)
    .sort({
        name: 1
    })
    .exec()
    .then(function(result){
        return res.json(result);
    }),function(err){
        return next(err);
    };
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
    update : update,
    list :list,
    get : get,
    addDistDate : addDistDate,
    removeDistDate : removeDistDate,
    validate :validate
}
