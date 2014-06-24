'use strict';
var Promise = require('promise')
  , inherit = require('inherit')
  , asap = require('asap')

module.exports = LazyPromise
inherit(LazyPromise, Promise)
function LazyPromise(fn) {
  if (!(this instanceof LazyPromise))
    return new LazyPromise(fn)
  if (typeof fn != 'function')
    throw new TypeError('fn is not a function')

  var promise = null
  this.then = function(onResolved, onRejected) {
    if (promise === null) createPromise()
    return promise.then(onResolved, onRejected)
  }

  function createPromise() {
    promise = new Promise(function(resolve, reject) {
      asap(function() {
        try { fn(resolve, reject) }
        catch (e) { reject(e) }
      })
    })
  }
}
