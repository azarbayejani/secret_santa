'use strict';

var assert      = require('chai').assert,
    _           = require('underscore'),
    sinon       = require('sinon'),
    mockery     = require('mockery'),
    SecretSanta = require('../index.js');

describe('assign', function () {
  it('should never assign a person to themselves', function (done) {
    var ss = new SecretSanta([1,2,3,4,5,6,7]);
    var items = ss.assign();
    assert.isTrue(_.every(items,function(el) {
      return el.from !== el.to;
    })); 
    done();
  });
});

describe('exceptions', function () {
  var shuffleStub;

  before(function() {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    }); 
    shuffleStub = sinon.stub(_, "shuffle");
    mockery.registerMock("underscore", _);
  });

  it('should handle array', function (done) {
    shuffleStub.onFirstCall().returns([3,1,4,2]);
    shuffleStub.onSecondCall().returns([2,1,4,3]);
   
    var exceptions = {
      1: [3]
    }; 
    var ss = new SecretSanta([1,2,3,4], {exceptions});
    var items = ss.assign();
    
    assert.isTrue(shuffleStub.calledTwice);
    assert.isTrue(_.every(items,function(el) {
      return exceptions[el.from] !== el.to && !_.contains(exceptions[el.from], el.to) && el.from !== el.to;
    }));

    done();
  });

  it('should handle single value', function (done) {
    shuffleStub.onFirstCall().returns([3,1,4,2]);
    shuffleStub.onSecondCall().returns([2,1,4,3]);
   
    var exceptions = {
      1: 3
    }; 
    var ss = new SecretSanta([1,2,3,4], {exceptions});
    var items = ss.assign();
    
    assert.isTrue(shuffleStub.calledTwice);
    assert.isTrue(_.every(items,function(el) {
      return exceptions[el.from] !== el.to && !_.contains(exceptions[el.from], el.to) && el.from !== el.to;
    }));

    done();
  });

  after(function() {
    _.shuffle.restore();
    mockery.disable();
  });

});
