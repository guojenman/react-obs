# react-obs
A react store built on top of rxjs &amp; hooks

## goals
* Familiar - useState() like API
* Render individual components in response to state and no other component
* No magic, just streams
* Don't need to know rxjs to use with react-obs, but you can if you want to
* Tiny

## install
```
npm i react-obs rxjs --save
```

## usage
**See example folder for a working demo**

Store
```Javascript
class AppStore {
  
  test1 = makeObs(0);
  doubleTest1 = computed(
    ([v]) => v * 2, [this.test1]
  );
  
}
export const appStore = new AppStore();
export const AppContext = React.createContext(appStore);
```

Component
```JSX
const appStore = useContext(AppContext);
const [val, setVal] = useObs(appStore.test1);
// can't set a computed value, so just the getter
const [doubleTest1] = useObs(appStore.doubleTest1);
return (
  <>
    <div>test1 value from the store is {val}</div>
    <div>and double that, is {doubleTest1}</div>
    <button onClick={() => setVal(val + 1)}>add 1</button>
  </>
)
```

## API
* **makeObs**: create an observable with a default value
* **useObs**: consume the observale in a component with useState like API
* **useObsDeep**: same as useObs but with a jsonPath option to pluck and set value deeply nested in an object
* **computed**: watch one ore more observables and return a computed value from them

**for more doc, for now read the code in index.js, it's a tiny file.**
