var fse         = require('fs-extra');
var path        = require('path');
var chai        = require('chai');
var expect      = chai.expect;
var testRoot    = __dirname;

before(function(done){
    chai.should();
    require('coffee-script');

    createNodeModulesDirectory(function(){
        done();
    });
});

after(function(done){
    removeNodeModulesDirectory(function(){
        done();
    });
});

describe('bring', function () {
    it('should be able to load modules from project\'s root directory [one slash]', function () {
        var bring   = require('bring');
        var cache   = bring('/test_modules/api/services/cache.js');

        expect(cache).to.equal('cache service');
    });

    it('should be able to find the module by indicating only it\'s name', function(){
        var bring   = require('bring');
        var cache   = bring('cache.js');

        expect(cache).to.equal('cache service');
    });

    it('should be able to load modules without extension being specified', function(){
        var bring   = require('bring');
        var cache   = bring('cache');

        expect(cache).to.equal('cache service');
    });

    it('should be able to find the module only by indicating a partial path to the module', function(){
        var bring   = require('bring');
        var cache   = bring('services/cache');

        expect(cache).to.equal('cache service');
    });

    it('should be able to load normal "require" modules', function(){
        var bring   = require('bring');

        expect(bring('fs')).to.exist;
    });

    it('should be able to load relative modules', function(){
        var bring   = require('bring');
        var cache   = bring('./test_modules/api/services/cache');

        expect(cache).to.equal('cache service');
    });

    it('should be able to load relative modules from nested dependencies', function(){
        var bring   = require('bring');
        var user    = bring('controllers/user');

        expect(user).to.equal('using user service');
    });

    it('should support loading modules from the index file by specifying the folder', function(){
        var bring   = require('bring');
        var inM     = bring('i18n');
        
        expect(inM).to.equal('i18n service');
    });

    it('should should detect ambiguity', function(){
        var bring   = require('bring');

        expect(function(){
            bring('user');
        }).to.throw();
    });

    it('should support loading json modules', function(){
        var bring   = require('bring');
        var dbInfo  = bring('config/db');

        expect(dbInfo).to.have.property('adapter').that.equal('mongo');
    });

    it('should support loading coffee-script modules', function(){
        var bring   = require('bring');
        var login   = bring('login');
        
        expect(login('username', 'password')).to.be.ok;
    });

    it('should throw if it couldn\'t find the module', function(){
        var bring   = require('bring');

        expect(function(){
            bring('missingModule');
        }).to.throw();
    });

    it('should be able to resolve module paths', function(){
        var bring               = require('bring');
        var loginModulePath     = bring.resolve('login');

        expect(loginModulePath).to.equal(path.join(__dirname, 'test_modules/api/controllers/login.coffee'));
    });
});


function createNodeModulesDirectory(callback){
    fse.mkdirsSync(path.join(testRoot, '/node_modules/bring/lib'));
    fse.copy(path.normalize(testRoot + '/../lib/'), path.join(testRoot, 'node_modules/bring/lib'), function(){
        fse.copy(path.normalize(testRoot + '/../package.json'), path.join(testRoot, 'node_modules/bring/package.json'), callback);
    });
}

function removeNodeModulesDirectory(callback){
    fse.remove(path.join(testRoot, '/node_modules'), callback);
}