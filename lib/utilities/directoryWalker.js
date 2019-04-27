const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const directoryWalker = {};

const getFirstMatchedPattern = (value, patterns) => {
  return _.find(patterns, (pattern) => {
    // eslint-disable-next-line no-param-reassign
    if (!_.isRegExp(pattern)) { pattern = new RegExp(pattern); }

    if (pattern.test(value)) {
      return true;
    }

    return false;
  });
};

const walkDirecotyTree = (root) => {
  const moduleFileList = [];

  _.chain(fs.readdirSync(root)).map((subDirectory) => {
    return path.join(root, subDirectory);
  }).filter((subDirectory) => {
    const matchedPattern = getFirstMatchedPattern(subDirectory, directoryWalker.folderExcludePatterns);

    if (!matchedPattern) {
      return true;
    }

    return false;
  }).forEach((subDirectory) => {
    const stat = fs.statSync(subDirectory);

    if (stat.isDirectory()) {
      _.forEach(walkDirecotyTree(subDirectory), (moduleFilePath) => {
        moduleFileList.push(moduleFilePath);
      });
    } else {
      const acceptedMatchedPattern = getFirstMatchedPattern(subDirectory, directoryWalker.acceptedFilePatterns);
      const excludedMatchedPattern = getFirstMatchedPattern(subDirectory, directoryWalker.fileExcludePatterns);

      if (acceptedMatchedPattern && !excludedMatchedPattern) {
        moduleFileList.push(path.normalize(subDirectory)); // convert slash to backslash or vice-versa
      }
    }
  });

  return moduleFileList;
};

module.exports = (folderExcludePatterns, fileExcludePatterns, acceptedFilePatterns) => {
  directoryWalker.folderExcludePatterns = folderExcludePatterns;
  directoryWalker.fileExcludePatterns = fileExcludePatterns;
  directoryWalker.acceptedFilePatterns = acceptedFilePatterns;

  return {
    walk: walkDirecotyTree,
  };
};
