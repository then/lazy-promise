'use strict';
var Promise = require('promise')
  , inherit = require('inherit')
  , asap = require('asap')

module.exports = LazyPromise
inherit(LazyPromise, Promise)
LazyPromise.prototype.constructor = Promise
function LazyPromise(fn) { var self = this
  if (!(this instanceof LazyPromise))
    return new LazyPromise(fn)
  if (typeof fn != 'function')
    throw new TypeError('fn is not a function')

  var created = false
  this.then = function(onResolved, onRejected) {
    if (!created) createPromise()
    return self.then(onResolved, onRejected)
  }

  function createPromise() {
    Promise.call(self, function(resolve, reject) {
      asap(function() {
        try { fn(resolve, reject) }
        catch (e) { reject(e) }
      })
    })

    created = true
  }
}
