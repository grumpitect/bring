var path                    = require('path');
var _                       = require('lodash');
var directoryWalker         = require('./utilities/directoryWalker');
var cache                   = require('./utilities/cache');
var callerModuleFilename    = module.parent.filename;
var callerModuleDirectory   = path.dirname(callerModuleFilename);

delete require.cache[module.filename];

var loadModule = function(modulePath){
    try{
        var requestedModule = bring.cache[modulePath] = require(modulePath);
        
        return requestedModule;
    }
    catch(e){
    }
};

var isError = function(value){
    return Object.prototype.toString.call(value) === "[object Error]";
};

var resolveModulePath = function(modulePath){
    var resolvedModulePath = null;
    var cachedModule = bring.cache[modulePath];

    if(cachedModule){
        resolvedModulePath = modulePath;
    }else{
        if(modulePath.search(/^\/[^\/]/) !== -1){ // project's root directory [exactly one slash]
            resolvedModulePath = path.join(bring.projectRoot, modulePath);
        }
        else{
            try{
                var fullPath = modulePath;

                if(modulePath.search(/^\./) !== -1){
                    fullPath = path.join(callerModuleDirectory, modulePath);
                }

                resolvedModulePath = require.resolve(fullPath);
            }
            catch(e){}

            if(!resolvedModulePath){
                var normalizedModulePath    = path.normalize(modulePath); // convert slash to backslash or vise-versa
                var resolvedModulePaths     = _.filter(cache.allModuleFilePaths, function(aModulePath){
                    var index = aModulePath.indexOf(normalizedModulePath);

                    if(index > -1){
                        var modulePathLength    = normalizedModulePath.length;
                        var pathLength          = aModulePath.length;
                        var extension           = path.extname(aModulePath);
                        var extensionLength     = extension.length;

                        // wonder: I don't know if this is a good idea
                        // ensure that we are at the end of the path (/api/services/user.js -> services/user.js), also support not specifying the extension and folders
                        if(index + modulePathLength === pathLength || index + modulePathLength === pathLength - extensionLength || aModulePath.charAt(index + modulePathLength) === path.sep)
                            return true;
                    }

                    return false;
                });

                if(resolvedModulePaths.length === 1){
                    resolvedModulePath = resolvedModulePaths[0];
                }
                else if(resolvedModulePaths.length > 1){
                    resolvedModulePath = new Error('Ambiguous module path \'' + modulePath + '\' - Requested from \'' + callerModuleFilename + '\' matched \'' + resolvedModulePaths + '\''); 
                }
            }
        }
    }

    return resolvedModulePath;
};

var bring = function(modulePath){
    var resolvedModulePath = resolveModulePath(modulePath);

    if(!resolvedModulePath){
        throw new Error('Cannot find module \'' + modulePath + '\' - Requested from \'' + callerModuleFilename + '\'');
    }
    else if(isError(resolvedModulePath)){
        throw resolvedModulePath;
    }

    var requestedModule = loadModule(resolvedModulePath);

    return requestedModule;
};

Object.defineProperty(bring, 'resolve', {
    enumerable: true,
    get: function(){
        return resolveModulePath;
    }
});

Object.defineProperty(bring, 'projectRoot', {
    enumerable: true,
    get: function(){
        if(!cache.projectRoot){
            cache.projectRoot = path.normalize(__dirname + '/../../../');
        }

        return cache.projectRoot;
    }
});

Object.defineProperty(bring, 'cache', {
    enumerable: true,
    get: function(){
        if(!cache.moduleCache){
            cache.moduleCache = [];
        }

        return cache.moduleCache;
    }
});

Object.defineProperty(bring, 'folderExcludePatterns', {
    enumerable: true,
    get: function(){
        if(!cache.folderExcludePatterns){
            cache.folderExcludePatterns = [/node_modules/i, /^\./i];
        }

        return cache.folderExcludePatterns;
    }
});

Object.defineProperty(bring, 'fileExcludePatterns', {
    enumerable: true,
    get: function(){
        if(!cache.fileExcludePatterns){
            cache.fileExcludePatterns = [/.*\.test\.[js|coffee]/i, /.*spec\.[js|coffee]/i];
        }

        return cache.fileExcludePatterns;
    }
});

Object.defineProperty(bring, 'acceptedModuleFilePatterns', {
    enumerable: true,
    get: function(){
        if(!cache.acceptedModuleFilePatterns){
            cache.acceptedModuleFilePatterns = [/.+\.js/i, /.+\.coffee/i, /.+\.json/i];
        }

        return cache.acceptedModuleFilePatterns;
    }
});

module.exports = (function(){ // init
    var walker = directoryWalker(bring.folderExcludePatterns, bring.fileExcludePatterns, bring.acceptedModuleFilePatterns);
    
    if(!cache.allModuleFilePaths){
        cache.allModuleFilePaths = walker.walk(bring.projectRoot);
    }

    return bring;
})(); // todo: maybe we can send parameters to set exclusions or just walk all and then exclude on module loader