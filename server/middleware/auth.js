var //Config = require('../db/config'),
    User = require('../db/user');


var menuitems = [
    {name: 'Accueil', link: '/'},
    {name: 'Producteurs', link: '/producer/list'},
    {name: 'Calendrier', link: '/calendar/list'},
    {name: 'Commandes du mois', link: '/order'},
    {name: 'Toutes mes commandes', link: '/order/list'}
];


var configureUser = function(req, res, next){
    if(!req.session.user){
        return User.findByLoginAndPwd('pouic','pouic')
        .then(function(user){
            var u = user.toObject();
            req.session.menu = JSON.parse(JSON.stringify(menuitems));
            if (user.role.indexOf('admin') >= 0){
                u.admin='bla';
                req.session.menu.push({name: 'Admin', link: '/admin'});
            }
            req.session.user = u;
            return next();
        })
    }else{
        return next();
    }
};

module.exports = configureUser;
