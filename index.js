var Promise = require('promise')
module.exports = LazyPromise
function LazyPromise(fn) {
  if (!(this instanceof LazyPromise))
    return new LazyPromise(fn)
  if (typeof fn !== 'function')
    throw new TypeError('fn is not a function')

  var promise = null
  this.then = function(onResolved, onRejected) {
    ;(promise = promise || new Promise(fn)).then(onResolved, onRejected)
  }
}
