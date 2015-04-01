var express = require('express'),
    path = require('path'),
    less = require('less-middleware'),
    url = require('url'),
    yaml = require('js-yaml'),
    hogan = require('hogan-express'),
    http = require('http'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    methodOverride = require('method-override'),
    auth = require('./middleware/auth'),
    conf = require('./conf'),
    routes = require('./routes'),
    appInfo = require('../package.json');;


var app = express();

// folder that contains client static assets
var publicFolder = path.normalize(conf.publicFolder || path.join(__dirname, '..', 'public'));
var viewFolder = path.normalize(conf.viewFolder || path.join(__dirname, '..', 'views'));

app.set('info', {
    name: appInfo.name,
    title: appInfo.name,
    description: appInfo.description,
    version: appInfo.version,
    author: appInfo.author
});
app.set('port', conf.port);
app.set('host', conf.ip);
app.engine('html',hogan);
app.set('view engine', 'html');
app.set('layout', 'layout');
app.set('partials', {menu: 'commons/menu'});
app.set('views', viewFolder);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
    secret : 'bioenbrenne',
    name: 'amap',
    resave: true,
    saveUninitialized: true
}));
app.use(auth);
app.use(less(publicFolder));
app.use(express['static'](publicFolder));
app.use(errorHandler);


function errorHandler(err, req, res, next) {
    console.log('Error : '+err.stack);
    res.render('error', {error: err, info: app.get('info')});
}


require('./routes')(app);
require('./routes/api')(app);


console.log('start the server');
var server = http.createServer(app);

if(!module.parent){
    require('./db/initDB');
    server.listen(app.get('port'), function(err) {
        console.log('web server listening on port '+app.get('port'));
        console.log('web server listening on host '+app.get('host'));
    });
}else{
    console.log('export server for test mode');
    module.exports = server;
}
