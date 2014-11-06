var loggerFactory = require('bunyan');

var logger = function(){
    return loggerFactory.createLogger({
        name:'amap',
        streams: [{
            type: 'rotating-file',
            path: 'logs/amap.log',
            period: '1d',   // daily rotation
            count: 3,        // keep 3 back copies
            level: 'debug'
        },{
            path:'logs/error.log',
            level:'error'
        }]
    });
}

module.exports = new logger();
