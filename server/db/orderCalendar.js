var db = require('./db'),
    Product = require('./product'),
    when = require('when');  

var OrderCalendar = new db.Schema({
    name    : { type : String, required: true }
    ,begin  : { type : Date, required: true }
    ,end    : { type : Date, required: true }
    ,cal    : [{
        product : { type: db.Schema.Types.ObjectId, ref: 'Product'},
        delivery: [Date]
    }]
});
/*
Array.prototype.indexOfField = function (propertyName, value) {
    for (var i = 0; i < this.length; i++){
        if (this[i][propertyName] === value){
            return i;
        }
    }
    return -1;
}*/

OrderCalendar.statics.process = function process (calId,data){
    return this.model('OrderCalendar').findById(calId)
    .exec()
    .then(function(ocal) {
        var willBeDone=[];
        for(p in data){
            var index = -1;
            for (var i = 0; i < ocal.cal.length; i++){
                if (ocal.cal[i].product == p.split('_')[1]){
                    index = i;
                }
            }
            //var index = ocal.cal.indexOfField('product',p.split('_')[1]);
            if (index != -1){
                ocal.cal[index].delivery = data[p].split(',');
            } else {
                ocal.cal.push({product:p.split('_')[1], delivery:data[p].split(',')});
            }
            console.log('call insert '+p.split('_')[1]+' date = '+data[p].split(','));
        }
        var defered = when.defer();
        ocal.save(function(err){
            console.log('saved !'+err);
            if(err){
                defered.reject(err);
            }else{
                console.log('odercalendar saved!!'+ ocal);
                defered.resolve(ocal);
            }
        });
        return defered.promise;
    });
}

OrderCalendar.statics.initCalendar = function (name,begin,end){
    return Product.find({})
    .exec()
    .then(function(products){
        var ocal = new(db.model('OrderCalendar'))({
            name: name,
            begin: new Date(begin),
            end: new Date(end),
            cal:[]
        });
        for(p in products){
            ocal.cal.push({product:products[p]._id, delivery:[]});
        }
        return db.model('OrderCalendar').create(ocal)
        .then(function(_ocal){
            console.log('ocal created : ', _ocal);  
            return when.resolve(_ocal);
        });
    });
}

module.exports = db.model('OrderCalendar', OrderCalendar);
