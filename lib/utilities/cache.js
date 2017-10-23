var cache = {};

Object.defineProperty(cache, 'set', {
    get: function(){
        return function(key, value){
            cache[key] = value;
        };
    }
});

Object.defineProperty(cache, 'get', {
    get: function(){
        return function(key){
            return cache[key];
        };
    }
});

Object.defineProperty(cache, 'remove', {
    get: function(){
        return function(key){
            var value = cache[key];
            
            delete cache[key];
            
            return value;
        };
    }
});

Object.defineProperty(cache, 'reset', {
    get: function(){
        return function(){
            for(var key in cache){
                delete cache[key];
            }
        };
    }
});

module.exports = cache;