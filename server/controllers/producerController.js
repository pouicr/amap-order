var Producer = require('../db/producer');


var init = function (req, res, next){
    var product = new Producer.product({
        name: "nametest",
        desc: "desc",
        unit: "500litre",
        price: 2.3
    });
    var producer = new Producer.producer({
        name:"myproducter",
        desc:"ons'en fou",
        category:"qq",
        address:"bla",
        products:[product]
    });
    producer.save(function(err,result){
        if(err){console.log('err : '+err); return next(err);}
        console.log("producer saved : "+result);
        return res.redirect('/home');
    });
    
};


    
    
module.exports = {
    init : init
}
