var Promise = require('./')
  , chai = require('chai')
  , expect = chai.expect
chai.use(require('chai-spies'))


describe('a lazy promise', function() {
  it('should not do anything when left unused', function(cb) {
    var factory = chai.spy()
      , promise = new Promise(factory)
    setTimeout(function() {
      expect(factory).to.not.have.been.called()
      cb()
    }, 20)
  })

  it('should call the factory when .then is called', function(cb) {
    var factory = chai.spy()
      , promise = new Promise(factory)
    promise.then(function() {}, function() {})
    setTimeout(function() {
      expect(factory).to.have.been.called()
      cb()
    }, 20)
  })

  it('should return a promise from .then', function() {
    var promise = new Promise(function() {})
      , ret = promise.then(function() {}, function() {})
    expect(ret).to.have.property('then').and.to.be.a('function')
  })

  it('should call the factory asynchronously', function() {
    var factory = chai.spy()
      , promise = new Promise(factory)
    promise.then(function() {}, function() {})
    expect(factory).to.not.have.been.called()
  })

  it('should only call the success callback on success', function(cb) {
    var factory = chai.spy(function(resolve, reject) { resolve({}) })
      , promise = new Promise(factory)
      , success = chai.spy()
      , failure = chai.spy()
    promise.then(success, failure)
    setTimeout(function() {
      expect(success).to.have.been.called()
      expect(failure).to.not.have.been.called()
      cb()
    }, 20)
  })

  it('should pass resolution values', function(cb) {
    var sentinel = {}
      , factory = chai.spy(function(resolve, reject) { resolve(sentinel) }) 
      , promise = new Promise(factory)
      , success = chai.spy(function(value) { expect(value).to.equal(sentinel) })
      , failure = chai.spy()
    promise.then(success, failure)
    setTimeout(function() {
      expect(success).to.have.been.called()
      cb()
    }, 20)
  })

  it('should only call the failure callback on failure', function(cb) {
    var factory = chai.spy(function(resolve, reject) { reject({}) })
      , promise = new Promise(factory)
      , success = chai.spy()
      , failure = chai.spy()
    promise.then(success, failure)
    setTimeout(function() {
      expect(success).to.not.have.been.called()
      expect(failure).to.have.been.called()
      cb()
    }, 20)
  })

  it('should pass failure reasons', function(cb) {
    var sentinel = {}
      , factory = chai.spy(function(resolve, reject) { reject(sentinel) }) 
      , promise = new Promise(factory)
      , success = chai.spy()
      , failure = chai.spy(function(reason) { expect(reason).to.equal(sentinel) })
    promise.then(success, failure)
    setTimeout(function() {
      expect(failure).to.have.been.called()
      cb()
    }, 20)
  })

  it('should only call the factory once', function(cb) {
    var factory = chai.spy()
      , promise = new Promise(factory)
    promise.then(function() {}, function() {})
    promise.then(function() {}, function() {})
    setTimeout(function() {
      promise.then(function() {}, function() {})
      expect(factory).to.have.been.called.once()
      cb()
    }, 20)
  })
})
