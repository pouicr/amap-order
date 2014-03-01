
module.exports = function (server) {
    // ### root routes
    server.get('/login/:userToSet', function(req,res,next){
        req.session.user = {id : req.params.userToSet || 'undifined'};
        res.redirect('/');
    });
    server.get('/', function(req,res,next){
        res.render('home',{user:req.session.user,message:":-)"});
    });
};
