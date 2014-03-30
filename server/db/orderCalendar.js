var db = require('./db'),
    Product = require('./product'),
    when = require('when');  

var OrderCalendar = new db.Schema({
    name    : { type : String, required: true }
    ,cal    : [{
        product : { type: db.Schema.Types.ObjectId, ref: 'Product'},
        delivery: [Date]
    }]
});

OrderCalendar.statics.process = function (calId,data){
    var cal = this.model('OrderCalendar').findById(calId)
    .exec()
    .then(function(ocal) {
        console.log('data = '+data);
        return when.resolve(ocal);
    });
}

OrderCalendar.statics.initNewCalendar = function (calId,name){
    Product.find({})
    .exec()
    .then(function(products){
        var ocal = new(db.model('OrderCalendar'))({
            name: name
        });
        for(p in products){
            ocal.cal.push({product:p._id, delivery:[]});
            console.log('ocal.pussh '+p);
        }
        console.log('ocal promise');
        return when.resolve(ocal);
    });
}

module.exports = db.model('OrderCalendar', OrderCalendar);
