const fse = require('fs-extra');
const path = require('path');
const chai = require('chai');

require('coffee-script');

const { expect } = chai;
const testRoot = __dirname;

const createNodeModulesDirectory = (callback) => {
  fse.mkdirsSync(path.join(testRoot, '/node_modules/bring/lib'));
  fse.copy(path.normalize(`${testRoot}/../lib/`), path.join(testRoot, 'node_modules/bring/lib'), () => {
    fse.copy(path.normalize(`${testRoot}/../package.json`), path.join(testRoot, 'node_modules/bring/package.json'), callback);
  });
};

const removeNodeModulesDirectory = (callback) => {
  fse.remove(path.join(testRoot, '/node_modules'), callback);
};

before((done) => {
  chai.should();

  createNodeModulesDirectory(() => {
    done();
  });
});

after((done) => {
  removeNodeModulesDirectory(() => {
    done();
  });
});

describe('bring', () => {
  it('should be able to load modules from project\'s root directory [one slash]', () => {
    // eslint-disable-next-line
    const bring = require('bring');
    const cache = bring('/test_modules/api/services/cache.js');

    expect(cache).to.equal('cache service');
  });

  it('should be able to find the module by indicating only it\'s name', () => {
    // eslint-disable-next-line
    const bring = require('bring');
    const cache = bring('cache.js');

    expect(cache).to.equal('cache service');
  });

  it('should be able to load modules without extension being specified', () => {
    // eslint-disable-next-line
    const bring = require('bring');
    const cache = bring('cache');

    expect(cache).to.equal('cache service');
  });

  it('should be able to find the module only by indicating a partial path to the module', () => {
    // eslint-disable-next-line
    const bring = require('bring');
    const cache = bring('services/cache');

    expect(cache).to.equal('cache service');
  });

  it('should be able to load normal "require" modules', () => {
    // eslint-disable-next-line
    const bring = require('bring');

    expect(bring('fs')).to.exist();
  });

  it('should be able to load relative modules', () => {
    // eslint-disable-next-line
    const bring = require('bring');
    const cache = bring('./test_modules/api/services/cache');

    expect(cache).to.equal('cache service');
  });

  it('should be able to load relative modules from nested dependencies', () => {
    // eslint-disable-next-line
    const bring = require('bring');
    const user = bring('controllers/user');

    expect(user).to.equal('using user service');
  });

  it('should support loading modules from the index file by specifying the folder', () => {
    // eslint-disable-next-line
    const bring = require('bring');
    const inM = bring('i18n');

    expect(inM).to.equal('i18n service');
  });

  it('should should detect ambiguity', () => {
    // eslint-disable-next-line
    const bring = require('bring');

    expect(() => {
      bring('user');
    }).to.throw();
  });

  it('should support loading json modules', () => {
    // eslint-disable-next-line
    const bring = require('bring');
    const dbInfo = bring('config/db');

    expect(dbInfo).to.have.property('adapter').that.equal('mongo');
  });

  it('should support loading coffee-script modules', () => {
    // eslint-disable-next-line
    const bring = require('bring');
    const login = bring('login');

    expect(login('username', 'password')).to.be.ok();
  });

  it('should throw if it couldn\'t find the module', () => {
    // eslint-disable-next-line
    const bring = require('bring');

    expect(() => {
      bring('missingModule');
    }).to.throw();
  });

  it('should be able to resolve module paths', () => {
    // eslint-disable-next-line
    const bring = require('bring');
    const loginModulePath = bring.resolve('login');

    expect(loginModulePath).to.equal(path.join(__dirname, 'test_modules/api/controllers/login.coffee'));
  });
});
