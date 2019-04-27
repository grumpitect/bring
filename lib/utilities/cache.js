const cache = {};

Object.defineProperty(cache, 'set', {
  get() {
    return (key, value) => {
      cache[key] = value;
    };
  },
});

Object.defineProperty(cache, 'get', {
  get() {
    return (key) => {
      return cache[key];
    };
  },
});

Object.defineProperty(cache, 'remove', {
  get() {
    return (key) => {
      const value = cache[key];

      delete cache[key];

      return value;
    };
  },
});

Object.defineProperty(cache, 'reset', {
  get() {
    return () => {
      for (const key in cache) {
        delete cache[key];
      }
    };
  },
});

module.exports = cache;
