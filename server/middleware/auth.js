var Config = require('../db/config');


var menuitems = [
    {name: 'Accueil', link: '/'},
    {name: 'Commandes du mois', link: '/order'},
    {name: 'Toutes mes commandes', link: '/order/list'}
];


var configureUser = function(req, res, next){
    if(!req.session.user){
        req.session.user = {id : 'undifined'};
    }
    if(!req.session.user.menu){
        Config.get(function(err,config){
            if(err){console.log('err : '+err); return next(err);}
            req.session.user.menu = JSON.parse(JSON.stringify(menuitems));
            if (config.admins == req.session.user.id){
                req.session.user.admin = true;
                req.session.order_id = config.order_id;
                req.session.user.menu.push({name: 'Admin', link: '/admin'});
            }
            return next();
        });
    }else{
        return next();
    }
};

module.exports = configureUser;
