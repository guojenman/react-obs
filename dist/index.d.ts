import { BehaviorSubject, Subject } from "rxjs";
/**
 * Get the current value from an observable
 * @param {*} obs
 * @returns {*}
 */
export declare const getValue: <T>(obs: Subject<T>) => T;
/**
 * Helper method to pluck value from object given a json path that can be called even when object is null
 * @param {*} object
 * @param {*} path
 */
export declare const valueInObjectByPath: <T>(object: Object, path: string) => T;
/**
 * Create an observable with the inital value provided
 * @param {*} initialValue
 * @returns BehaviorSubject
 */
export declare const makeObs: <T>(initialValue: T) => BehaviorSubject<T>;
/**
 * Consume observables using the same API as useState()
 * @param {*} observable
 * @returns {[*, Function]} [getter, setter]
 */
export declare const useObs: <T>(observable: Subject<T>) => [T, (v: T | ((v: T) => T)) => void];
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
export declare const useObsDeep: <T>(observable: Subject<T>, jsonPath: string) => [T, (v: T | ((v: T) => T)) => void];
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
export declare const computed: <T>(fn: (v: any) => T, obsArrayOrStoreInstance: any) => BehaviorSubject<T>;
