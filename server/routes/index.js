var submition  = require('./submition'),
    root  = require('./root');
//     admin     = require('./admin');

module.exports = function(server){
    return {
        submition: submition(server),
        root: root(server)
    }
};
