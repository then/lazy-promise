var Promise = require('promise')
  , inherit = require('inherit')
  , nextTick = require('next-tick')

module.exports = LazyPromise
inherit(LazyPromise, Promise)
function LazyPromise(fn) {
  if (!(this instanceof LazyPromise))
    return new LazyPromise(fn)
  if (typeof fn !== 'function')
    throw new TypeError('fn is not a function')

  var promise = null
  this.then = function(onResolved, onRejected) {
    if (promise === null) createPromise()
    return promise.then(onResolved, onRejected)
  }

  function createPromise() {
    promise = new Promise(function(resolve, reject) {
      nextTick(function() {
        fn(resolve, reject)
      })
    })
  }
}
