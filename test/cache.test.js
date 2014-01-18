var chai        = require('chai');
var expect      = chai.expect;
var cache       = require('../lib/utilities/cache');

describe('cache', function () {
    it('should be able to store a value and retrieve it back', function () {
        cache.set('key', 'value');
        
        expect(cache.get('key')).to.equal('value');
    });

    it('should be able to work like an object that cached key and values could be set or retrieved via brackets or dot syntax', function () {
        cache['key'] = 'value';

        expect(cache['key']).to.equal('value');
        expect(cache.key).to.equal('value');
    });

    it('should be able to store any type of object', function () {
        cache.set('user', {
            name: 'jay'
        });

        expect(cache.get('user')).to.have.property('name').that.equal('jay');

        cache.set('add', function(a, b){
            return a + b;
        });

        expect(cache.add(1, 2)).to.equal(3);
    });

    it('should be able to remove a key from cache', function () {
        cache.set('user', 'jay');

        expect(cache.get('user')).to.equal('jay');

        var value = cache.remove('user');
        
        expect(value).to.equal('jay');
        expect(cache.get('user')).to.be.not.ok;
    });

    it('should be resettable', function () {
        cache.set('key', 'value');
        cache.set('user', 'jay');

        expect(cache.get('key')).to.equal('value');
        expect(cache.get('user')).to.equal('jay');

        cache.reset();

        expect(cache.get('key')).to.be.not.ok;
        expect(cache.get('user')).to.be.not.ok;
    });

    it('should not allow inner functions to be overridden by keys', function () {
        cache.set = 'another value';

        expect(cache.set).to.not.equal('another function');
    });
});