var express = require('express'),
    path = require('path'),
    less = require('less-middleware'),
    url = require('url'),
    yaml = require('js-yaml'),
    hogan = require('hogan-express'),
    http = require('http'),
    auth = require('./middleware/auth'),
    conf = require('../conf.yml'),
    routes = require('./routes'),
    appInfo = require('../package.json');;


var app = express();

// folder that contains client static assets
var publicFolder = path.normalize(conf.publicFolder || path.join(__dirname, '..', 'public'));
var viewFolder = path.normalize(conf.viewFolder || path.join(__dirname, '..', 'views'));

app.configure(function(){
    app.set('info', {
        name: appInfo.name,
        title: appInfo.name,
        description: appInfo.description,
        version: appInfo.version,
        author: appInfo.author
    });
    app.set('port', conf.port || 8000);
    app.set('host', conf.host || localhost);
    app.engine('html',hogan);
    app.set('view engine', 'html');
    app.set('views', viewFolder);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({secret : 'pwet'}));
    app.use(auth);
    app.use(app.router);
    app.use(less({src : publicFolder,compress : true}));
    app.use(express['static'](publicFolder));
    app.use(errorHandler);
});


function errorHandler(err, req, res, next) {
    console.log('Error : '+err.stack);
    res.render('error', {error: err, info: app.get('info')});
}


require('./routes')(app);

console.log('start the server');
var server = http.createServer(app);
server.listen(app.get('port'), function(err) {
    console.log('web server listening on port '+app.get('port'));
    console.log('web server listening on host '+app.get('host'));
});
