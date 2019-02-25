"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var react_1 = require("react");
/**
 * Get the current value from an observable
 * @param {*} obs
 * @returns {*}
 */
exports.getValue = function (obs) {
    var lastValue;
    obs.pipe(operators_1.take(1)).subscribe(function (v) { return lastValue = v; });
    return lastValue;
};
/**
 * Helper method to pluck value from object given a json path that can be called even when object is null
 * @param {*} object
 * @param {*} path
 */
exports.valueInObjectByPath = function (object, path) { return path.split('.').reduce(function (o, i) { return !!o ? o[i] : ''; }, object); };
/**
 * Create an observable with the inital value provided
 * @param {*} initialValue
 * @returns BehaviorSubject
 */
exports.makeObs = function (initialValue) { return new rxjs_1.BehaviorSubject(initialValue); };
/**
 * Consume observables using the same API as useState()
 * @param {*} observable
 * @returns {[*, Function]} [getter, setter]
 */
exports.useObs = function (observable) {
    var _a = react_1.useState(exports.getValue(observable)), val = _a[0], setVal = _a[1];
    var setValEnhanced = function (v) {
        if (v instanceof Function) {
            observable.next(v(exports.getValue(observable)));
        }
        else {
            observable.next(v);
        }
    };
    react_1.useEffect(function () {
        var subs = observable.subscribe(setVal);
        return function () { return subs.unsubscribe(); };
    }, []);
    return [val, setValEnhanced];
};
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
exports.useObsDeep = function (observable, jsonPath) {
    if (!jsonPath || typeof jsonPath !== "string" || jsonPath.length === 0) {
        throw new Error("useObsDeep: a string jsonPath is required");
    }
    var _a = react_1.useState(exports.getValue(observable)), val = _a[0], setVal = _a[1];
    var setValEnhanced = function (v) {
        var copy = JSON.parse(JSON.stringify(exports.getValue(observable)));
        var paths = jsonPath.split(".");
        var fieldName = paths.pop();
        var objectRef = paths.reduce(function (acc, curr) { return acc[curr] || {}; }, copy || {});
        if (v instanceof Function) {
            objectRef[fieldName] = v(exports.getValue(observable));
        }
        else {
            objectRef[fieldName] = v;
        }
        observable.next(copy);
    };
    react_1.useEffect(function () {
        var subs = observable.subscribe(function (v) { return setVal(exports.valueInObjectByPath(v, jsonPath)); });
        return function () { return subs.unsubscribe(); };
    }, []);
    return [val, setValEnhanced];
};
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
exports.computed = function (fn, obsArrayOrStoreInstance) {
    var names = [];
    var arr = [];
    if (Array.isArray(obsArrayOrStoreInstance)) {
        arr = obsArrayOrStoreInstance;
    }
    else {
        var collected = collectObservables(obsArrayOrStoreInstance);
        arr = collected.observables;
        names = collected.names;
    }
    var obs = rxjs_1.combineLatest(arr)
        .pipe(operators_1.map(function (vals) {
        if (names.length) {
            var o = names.reduce(function (acc, curr, i) {
                acc[curr] = vals[i];
                return acc;
            }, {});
            return fn(o);
        }
        else {
            return fn(vals);
        }
    }));
    obs.getValue = function () { return exports.getValue(obs); };
    return obs;
};
/**
 * Given an object collect properties that are of type BehaviorSubject (our default streams)
 * and return an Array of BehaviorSubject
 * @param {*} target
 * @return BehaviorSubject[]
 */
function collectObservables(target) {
    var names = Object.getOwnPropertyNames(target).filter(function (name) {
        return name.charAt(0) !== "_"
            && target[name] instanceof rxjs_1.BehaviorSubject;
    });
    var observables = names.map(function (name) { return target[name]; });
    return { observables: observables, names: names };
}
