var loggerFactory = require('bunyan');

var logger = function(){
    return loggerFactory.createLogger({
        name:'amap',
        streams: [{
            stream: process.stdout,
            level: 'debug'
        },{
            //path:'logs/error.log',
            stream: process.stdout,
            level:'error'
        }]
    });
}

module.exports = new logger();
