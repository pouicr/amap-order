var db = require('./db');  

var Config = new db.Schema({
    _id   : { type : String }
   ,phase : { type : String }
   ,admins: { type : String }
});

var conf;

Config.statics.get = function(cb){
    if(null != conf){
        return cb(null,conf);
    }else{
        this.findOne({ _id: '1' },function(err,result){
            if(err){console.log('err : '+err); return cb(err);}
            if(null == result){
                return cb('error : no config in db');
            }else{
                conf = result;
                return cb(null,result);
            }
        });
    }
};

Config.statics.set = function(newConf,cb){
    conf.phase = newConf.phase;
    conf.admins = newConf.admins;
    conf.save(function(err){
        if(err){console.log('err : '+err); return cb(err);}
        return cb(null,conf);
    });
};


module.exports = db.model('Config', Config);
/*
var PageSlider = function() {
    this.sliders = [];
}

PageSlider.prototype.addSlider = function(display, target, itemClass, width, height, itemsPerPage, defaultPage){
    var slideConfig = {
            display : display,
            target : target
    };
    var slider = this.createSlider(slideConfig);
    slider.initSlider();
    this.sliders.push(slider);

}

slider = new PageSlider();
*/
