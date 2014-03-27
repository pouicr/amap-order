var db = require('./db'),
    when = require('when'),
    Family = require('./family');  

var User = new db.Schema({
    login       : { type : String, index: {unique: true},required: true }
   ,name        : { type : String, index: {unique: true},required: true }
   ,pwd         : { type : String }   
   ,role        : { type : String }
   ,family      : { type: db.Schema.Types.ObjectId, ref: 'Family'},   
});


User.statics.findByLoginAndPwd = function findByLoginAndPwd(login,pwd){
    return this.model('User').findOne({login:login, pwd:pwd})
    .populate('family')
    .exec()
    .then(function(user){
        return when.resolve(user);
    });
}

module.exports = db.model('User', User);
