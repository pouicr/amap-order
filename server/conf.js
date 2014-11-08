var conf = function() {
    var c = {};
    
    c.ip = process.env.IP || '0.0.0.0';
    c.port = process.env.PORT || 8000;
    c.limit = 10;
    c.api_url = 'http://localhost:8000/api'
    
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


    if(process.env.API_URL){
        console.log('api url from external');
        c.api_url = process.env.API_URL;
    }
    return c;
}



module.exports = new conf();
