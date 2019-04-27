const path = require('path');
const _ = require('lodash');
const directoryWalker = require('./utilities/directoryWalker');
const cache = require('./utilities/cache');

const callerModuleFilename = module.parent.filename;
const callerModuleDirectory = path.dirname(callerModuleFilename);

delete require.cache[module.filename];

const loadModule = (modulePath) => {
  // eslint-disable-next-line
  bring.cache[modulePath] = require(modulePath);

  // eslint-disable-next-line no-use-before-define
  return bring.cache[modulePath];
};

const isError = (value) => {
  return Object.prototype.toString.call(value) === '[object Error]';
};

const resolveModulePath = (modulePath) => {
  let resolvedModulePath = null;
  // eslint-disable-next-line no-use-before-define
  const cachedModule = bring.cache[modulePath];

  if (cachedModule) {
    resolvedModulePath = modulePath;
  } else if (modulePath.search(/^\/[^/]/) !== -1) { // project's root directory [exactly one slash]
    // eslint-disable-next-line no-use-before-define
    resolvedModulePath = path.join(bring.projectRoot, modulePath);
  } else {
    try {
      let fullPath = modulePath;

      if (modulePath.search(/^\./) !== -1) {
        fullPath = path.join(callerModuleDirectory, modulePath);
      }

      resolvedModulePath = require.resolve(fullPath);
    } catch (e) {
      // ignore error
    }

    if (!resolvedModulePath) {
      const normalizedModulePath = path.normalize(modulePath); // convert slash to backslash or vise-versa
      const resolvedModulePaths = _.filter(cache.allModuleFilePaths, (aModulePath) => {
        const index = aModulePath.indexOf(normalizedModulePath);

        if (index > -1) {
          const modulePathLength = normalizedModulePath.length;
          const pathLength = aModulePath.length;
          const extension = path.extname(aModulePath);
          const extensionLength = extension.length;

          // wonder: I don't know if this is a good idea
          // ensure that we are at the end of the path (/api/services/user.js -> services/user.js)
          // also support not specifying the extension and folders
          if (
            index + modulePathLength === pathLength
            || index + modulePathLength === pathLength - extensionLength
            || aModulePath.charAt(index + modulePathLength) === path.sep
          ) {
            return true;
          }
        }

        return false;
      });

      if (resolvedModulePaths.length === 1) {
        [resolvedModulePath] = resolvedModulePaths;
      } else if (resolvedModulePaths.length > 1) {
        resolvedModulePath = new Error(`
          Ambiguous module path '${modulePath}' - Requested from '${callerModuleFilename}' matched '${resolvedModulePaths}'
        `);
      }
    }
  }

  return resolvedModulePath;
};

const bring = (modulePath) => {
  const resolvedModulePath = resolveModulePath(modulePath);

  if (!resolvedModulePath) {
    throw new Error(`Cannot find module '${modulePath}' - Requested from '${callerModuleFilename}'`);
  } else if (isError(resolvedModulePath)) {
    throw resolvedModulePath;
  }

  const requestedModule = loadModule(resolvedModulePath);

  return requestedModule;
};

Object.defineProperty(bring, 'resolve', {
  enumerable: true,
  get() {
    return resolveModulePath;
  },
});

Object.defineProperty(bring, 'projectRoot', {
  enumerable: true,
  get() {
    if (!cache.projectRoot) {
      cache.projectRoot = path.normalize(`${__dirname}/../../../`);
    }

    return cache.projectRoot;
  },
});

Object.defineProperty(bring, 'cache', {
  enumerable: true,
  get() {
    if (!cache.moduleCache) {
      cache.moduleCache = [];
    }

    return cache.moduleCache;
  },
});

Object.defineProperty(bring, 'folderExcludePatterns', {
  enumerable: true,
  get() {
    if (!cache.folderExcludePatterns) {
      cache.folderExcludePatterns = [/node_modules/i, /^\./i];
    }

    return cache.folderExcludePatterns;
  },
});

Object.defineProperty(bring, 'fileExcludePatterns', {
  enumerable: true,
  get() {
    if (!cache.fileExcludePatterns) {
      cache.fileExcludePatterns = [/.*\.test\.[js|coffee]/i, /.*spec\.[js|coffee]/i];
    }

    return cache.fileExcludePatterns;
  },
});

Object.defineProperty(bring, 'acceptedModuleFilePatterns', {
  enumerable: true,
  get() {
    if (!cache.acceptedModuleFilePatterns) {
      cache.acceptedModuleFilePatterns = [/.+\.js/i, /.+\.coffee/i, /.+\.json/i];
    }

    return cache.acceptedModuleFilePatterns;
  },
});

module.exports = (() => { // init
  const walker = directoryWalker(bring.folderExcludePatterns, bring.fileExcludePatterns, bring.acceptedModuleFilePatterns);

  if (!cache.allModuleFilePaths) {
    cache.allModuleFilePaths = walker.walk(bring.projectRoot);
  }

  return bring;
})(); // todo: maybe we can send parameters to set exclusions or just walk all and then exclude on module loader
