import { BehaviorSubject, combineLatest } from "rxjs";
import { map, take } from "rxjs/operators";
import { useEffect, useState } from "react";

const getLastValue = (obs) => {
  let lastValue;
  obs.pipe(take(1)).subscribe(v => lastValue = v)
  return lastValue;
}

/**
 * Helper method to pluck value from object given a json path that can be called even when object is null
 * @param {*} object 
 * @param {*} path 
 */
export const valueInObjectByPath = (object, path) => path.split('.').reduce((o, i) => !!o ? o[i] : '', object);

/**
 * Create an observable with the inital value provided
 * @param {*} initialValue
 * @returns BehaviorSubject
 */
export const makeObs = (initialValue) => new BehaviorSubject(initialValue);

/**
 * Consume observables using the same API as useState()
 * @param {*} observable
 * @return [getter, setter]
 */
export const useObs = (observable) => {
  const [val, setVal] = useState(getLastValue(observable))
  const setValEnhanced = v => observable.next(v)
  useEffect(() => {
    const subs = observable.subscribe(setVal);
    return () => subs();
  }, [])
  return [val, setValEnhanced];
}

/**
 * Compute a value from 1 or more observables.
 * 
 * if obsArrayOrStoreInstance is an array
 * fn = ([val1, val2, val3...]) => {.....}
 * if obsArrayOrStoreInstance is the store
 * fn = (storeWithLatestValue) -=> {.....}
 * 
 * IMPORTANT: computed observables only have access to observables that were defined before it in the file
 * 
 * @param {*} fn 
 * @param {*} obsArrayOrStoreInstance
 * @return Observable
 */
export const computed = (fn, obsArrayOrStoreInstance) => {
  let arr = !Array.isArray(obsArrayOrStoreInstance)
    ? collectObservables(obsArrayOrStoreInstance)
    : obsArrayOrStoreInstance;
  return combineLatest(arr)
    .pipe(
      map(vals => {
        if (arr.__names) {
          const o = arr.__names.reduce((acc, curr, i) => {
            acc[curr] = vals[i];
            return acc;
          }, {})
          return fn(o)
        } else {
          return fn(vals);
        }
      })
    );
}

/**
 * Given an object collect properties that are of type BehaviorSubject (our default streams)
 * and return an Array of BehaviorSubject
 * @param {*} target 
 * @return BehaviorSubject[]
 */
function collectObservables(target) {
  const names = Object.getOwnPropertyNames(target).filter(name => {
    return name.charAt(0) !== "_"
      && target[name] instanceof BehaviorSubject;
  })
  const observables = names.map(name => target[name]);
  observables.__names = names;
  return observables;
}