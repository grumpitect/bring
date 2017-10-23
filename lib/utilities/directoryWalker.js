var path                = require('path');
var fs                  = require('fs');
var _                   = require('lodash');
var directoryWalker     = {};

var getFirstMatchedPattern = function(value, patterns){
    return _.find(patterns, function(pattern){
        if(!_.isRegExp(pattern))
            pattern = new RegExp(pattern);
        
        if(pattern.test(value)){
            return true;
        }

        return false;
    });
};

var walkDirecotyTree = function(root){
    var moduleFileList = [];
    var subDirectories = _.chain(fs.readdirSync(root)).map(function(subDirectory){
        return path.join(root, subDirectory);
    }).filter(function(subDirectory){
        var matchedPattern = getFirstMatchedPattern(subDirectory, directoryWalker.folderExcludePatterns);

        if(!matchedPattern){
            return true;
        }

        return false;
    }).forEach(function(subDirectory){
        var stat = fs.statSync(subDirectory);

        if(stat.isDirectory()){
            _.forEach(walkDirecotyTree(subDirectory), function(moduleFilePath){
                moduleFileList.push(moduleFilePath);
            });
        }else{
            var acceptedMatchedPattern = getFirstMatchedPattern(subDirectory, directoryWalker.acceptedFilePatterns);
            var excludedMatchedPattern = getFirstMatchedPattern(subDirectory, directoryWalker.fileExcludePatterns);

            if(acceptedMatchedPattern && !excludedMatchedPattern){
                moduleFileList.push(path.normalize(subDirectory)); // convert slash to backslash or vice-versa
            }
        }
    });

    return moduleFileList;
};

module.exports = function(folderExcludePatterns, fileExcludePatterns, acceptedFilePatterns){
    directoryWalker.folderExcludePatterns   = folderExcludePatterns;
    directoryWalker.fileExcludePatterns     = fileExcludePatterns;
    directoryWalker.acceptedFilePatterns    = acceptedFilePatterns;

    return {
        walk: walkDirecotyTree
    };
};