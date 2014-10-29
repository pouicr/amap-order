var conf = function() {
    var c = {};
    
    c.ip = process.env.NODE_IP || 'localhost';
    c.port = process.env.NODE_PORT || 8000;
    
    if (process.env.MONGO_PORT_27017_TCP_ADDR){
        console.log('mongo from docker link');
        c.dburl = process.env.MONGO_PORT_27017_TCP_ADDR +':'+ process.env.MONGO_PORT_27017_TCP_PORT + '/mydb';
    }else if (process.env.MONGOLAB_URI){
        console.log('mongo from mongo lab');
        c.dburl = process.env.MONGOLAB_URI;
    }else if (process.env.MONGO_URL){
        console.log('mongo from external conf');
        c.dburl = process.env.MONGO_URL;
    }else{
        console.log('default : mongo local');
        c.dburl = 'localhost:27017';
    }
    return c;
}



module.exports = new conf();
