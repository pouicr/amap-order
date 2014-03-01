var submition  = require('./submition'),
    root  = require('./root');
    admin     = require('./admin');

module.exports = function(server){
    return {
        submition: submition(server),
        admin: admin(server),
        root: root(server)
    }
};
