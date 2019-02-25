import { BehaviorSubject, combineLatest, Subject } from "rxjs";
import { map, take } from "rxjs/operators";
import { useEffect, useState } from "react";
type O<T> = BehaviorSubject<T>;

/**
 * Get the current value from an observable
 * @param {*} obs 
 * @returns {*}
 */
export const getValue = <T>(obs: Subject<T>): T => {
  let lastValue: T;
  obs.pipe(take(1)).subscribe(v => lastValue = v)
  return lastValue!;
}

/**
 * Helper method to pluck value from object given a json path that can be called even when object is null
 * @param {*} object 
 * @param {*} path 
 */
export const valueInObjectByPath = <T>(object: Object, path: string): T => path.split('.').reduce((o: any, i) => !!o ? o[i] : '', object) as T;

/**
 * Create an observable with the inital value provided
 * @param {*} initialValue
 * @returns BehaviorSubject
 */
export const makeObs = <T>(initialValue: T): BehaviorSubject<T> => new BehaviorSubject(initialValue);

/**
 * Consume observables using the same API as useState()
 * @param {*} observable
 * @returns {[*, Function]} [getter, setter]
 */
export const useObs = <T>(observable: Subject<T>): [T, (v: T | ((v: T) => T)) => void] => {
  const [val, setVal] = useState(getValue(observable))
  const setValEnhanced = (v: T | ((v: T) => T)) => {
    if (v instanceof Function) {
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
export const useObsDeep = <T>(observable: Subject<T>, jsonPath: string): [T, (v: T | ((v: T) => T)) => void] => {
  if (!jsonPath || typeof jsonPath !== "string" || jsonPath.length === 0) {
    throw new Error("useObsDeep: a string jsonPath is required");
  }
  const [val, setVal] = useState(getValue(observable))
  const setValEnhanced = (v: T | ((v: T) => T)) => {
    let copy = JSON.parse(JSON.stringify(getValue(observable)));
    let paths = jsonPath.split(".");
    let fieldName = paths.pop()!;
    let objectRef = paths.reduce((acc, curr) => acc[curr] || {}, copy || {});
    if (v instanceof Function) {
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


// overload typings for computed()
// ------ For passing the entire store to the computed function
export function computed<V>(fn: (v: any) => V, obsArrayOrStoreInstance: any): O<V>
export function computed<V, S>(fn: (v: S) => V, obsArrayOrStoreInstance: S): O<V>
// ------ For passing an array of observales to the computed function
export function computed<V, T>(fn: (v: [T]) => V, obsArrayOrStoreInstance: [O<T>]): O<V>
export function computed<V, T, T1>(fn: (v: [T, T1]) => V, obsArrayOrStoreInstance: [O<T>, O<T1>]): O<V>
export function computed<V, T, T1, T2>(fn: (v: [T, T1, T2]) => V, obsArrayOrStoreInstance: [O<T>, O<T1>, O<T2>]): O<V>
export function computed<V, T, T1, T2, T3>(fn: (v: [T, T1, T2, T3]) => V, obsArrayOrStoreInstance: [O<T>, O<T1>, O<T2>, O<T3>]): O<V>
export function computed<V, T, T1, T2, T3, T4>(fn: (v: [T, T1, T2, T3, T4]) => V, obsArrayOrStoreInstance: [O<T>, O<T1>, O<T2>, O<T3>, O<T4>]): O<V>
export function computed<V, T, T1, T2, T3, T4, T5>(fn: (v: [T, T1, T2, T3, T4, T5]) => V, obsArrayOrStoreInstance: [O<T>, O<T1>, O<T2>, O<T3>, O<T4>, O<T5>]): O<V>
export function computed<V, T, T1, T2, T3, T4, T5, T6>(fn: (v: [T, T1, T2, T3, T4, T5, T6]) => V, obsArrayOrStoreInstance: [O<T>, O<T1>, O<T2>, O<T3>, O<T4>, O<T5>, O<T6>]): O<V>
export function computed<V, T, T1, T2, T3, T4, T5, T6, T7>(fn: (v: [T, T1, T2, T3, T4, T5, T6, T7]) => V, obsArrayOrStoreInstance: [O<T>, O<T1>, O<T2>, O<T3>, O<T4>, O<T5>, O<T6>, O<T7>]): O<V>
export function computed<V, T, T1, T2, T3, T4, T5, T6, T7, T8>(fn: (v: [T, T1, T2, T3, T4, T5, T6, T7, T8]) => V, obsArrayOrStoreInstance: [O<T>, O<T1>, O<T2>, O<T3>, O<T4>, O<T5>, O<T6>, O<T7>, O<T8>]): O<V>
export function computed<V, T, T1, T2, T3, T4, T5, T6, T7, T8, T9>(fn: (v: [T, T1, T2, T3, T4, T5, T6, T7, T8, T9]) => V, obsArrayOrStoreInstance: [O<T>, O<T1>, O<T2>, O<T3>, O<T4>, O<T5>, O<T6>, O<T7>, O<T8>, O<T9>]): O<V>
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
export function computed(fn: Function, obsArrayOrStoreInstance: any) {
  let names: string[] = [];
  let arr: Subject<any>[] = [];
  if (Array.isArray(obsArrayOrStoreInstance)) {
    arr = obsArrayOrStoreInstance;
  } else {
    let collected = collectObservables(obsArrayOrStoreInstance);
    arr = collected.observables;
    names = collected.names;
  }
  const obs = combineLatest(arr)
    .pipe(
      map(vals => {
        if (names.length) {
          const o = names.reduce((acc: any, curr, i) => {
            acc[curr] = vals[i];
            return acc;
          }, {})
          return fn(o)
        } else {
          return fn(vals);
        }
      })
    ) as BehaviorSubject<any>;
  obs.getValue = () => getValue(obs);
  return obs;
}

/**
 * Given an object collect properties that are of type BehaviorSubject (our default streams)
 * and return an Array of BehaviorSubject
 * @param {*} target 
 * @return BehaviorSubject[]
 */
function collectObservables(target: any) {
  const names = Object.getOwnPropertyNames(target).filter(name => {
    return name.charAt(0) !== "_"
      && target[name] instanceof BehaviorSubject;
  })
  const observables = names.map(name => target[name]);
  return { observables, names };
}