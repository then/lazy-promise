const asap = require('asap');

export default class LazyPromise<T> implements Promise<T> {
  readonly [Symbol.toStringTag]: 'Promise';

  private _result: Promise<T> | void;
  private _executor: (
    resolve: (value?: T | PromiseLike<T>) => void,
    reject: (reason?: any) => void,
  ) => void;
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ): Promise<TResult1 | TResult2> {
    if (!this._result) {
      this._result = new Promise((resolve, reject) => {
        asap(() => {
          try {
            this._executor(resolve, reject);
          } catch (ex) {
            reject(ex);
          }
        });
      });
    }
    return this._result.then(onfulfilled, onrejected);
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null,
  ): Promise<T | TResult> {
    return this.then(undefined, onrejected);
  }

  constructor(
    executor: (
      resolve: (value?: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
    ) => void,
  ) {
    this._executor = executor;
  }
}

if (Object.setPrototypeOf) {
  Object.setPrototypeOf(LazyPromise.prototype, Promise.prototype);
  Object.setPrototypeOf(LazyPromise, Promise);
} else {
  (LazyPromise.prototype as any).__proto__ = Promise.prototype;
  (LazyPromise as any).__proto__ = Promise;
}

module.exports = LazyPromise;
module.exports.default = LazyPromise;
