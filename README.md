# react-obs
A react store built on top of rxjs &amp; hooks

## goals
* simple API
* render individual components in response to state change in store

_No plans for deep object compare, only shallow compare is supported at the moment_

## example

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
const [doubleTest1] = useObs(appStore.doubleTest1);
return (
  <>
    <div>test1 value from the store is {val}</div>
    <div>and double that is {val}</div>
    <button onClick={() => setVal(val + 1)}>add 1</button>
  </>
)
```