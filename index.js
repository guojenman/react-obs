import { BehaviorSubject, combineLatest } from "rxjs";
import { map, take } from "rxjs/operators";
import { useEffect, useState } from "react";

/**
 * Get the current value from an observable
 * @param {*} obs 
 * @returns {*}
 */
export const getValue = (obs) => {
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
 * @returns {[*, Function]} [getter, setter]
 */
export const useObs = (observable) => {
  const [val, setVal] = useState(getValue(observable))
  const setValEnhanced = v => {
    if (typeof v === "function") {
      observable.next(v(getValue(observable)));
    } else {
      observable.next(v)
    }
  }
  useEffect(() => {
    const subs = observable.subscribe(setVal);
    return () => subs.unsubscribe();
  }, [])
  return [val, setValEnhanced];
}

/**
 * Observe a field nested inside an object.
 * This doesnt really watch the field itself, but the root level of the object
 * What we're doing here is simplying plucking the value for you when the object
 * reference changes
 * 
 * When you call setValue, we're re-recreating the whole object with your value change
 * and pushing this new reference down the stream
 * 
 * Caveat: You can not change a field that does not exist.
 * 
 * @param {*} observable 
 * @param {*} jsonPath 
 * @returns {[*, Function]} [getter, setter]
 */
export const useObsDeep = (observable, jsonPath) => {
  if (!jsonPath || typeof jsonPath !== "string" || jsonPath.length === 0) {
    throw new Error("useObsDeep: a string jsonPath is required");
  }
  const [val, setVal] = useState(getValue(observable))
  const setValEnhanced = v => {
    let copy = JSON.parse(JSON.stringify(getValue(observable)));
    let paths = jsonPath.split(".");
    let fieldName = paths.pop();
    let objectRef = paths.reduce((acc, curr) => acc[curr] || {}, copy || {});
    if (typeof v === "function") {
      objectRef[fieldName] = v(getValue(observable));
    } else {
      objectRef[fieldName] = v;
    }
    observable.next(copy)
  }
  useEffect(() => {
    const subs = observable.subscribe(
      v => setVal(valueInObjectByPath(v, jsonPath))
    );
    return () => subs.unsubscribe();
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
  const obs = combineLatest(arr)
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
  obs.getValue = () => getValue(obs);
  return obs;
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