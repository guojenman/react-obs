import React from "react"
import { makeObs, computed } from "../../";

class AppStore {

  test1 = makeObs(0);
  test2 = makeObs(0);
  someData = makeObs(null);

  // computed value w/ explicit depdencies
  computedVal1 = computed(
    ([test1, test2]) => test1 + test2, [this.test1, this.test2]
  );

  // computed value whenever any observable updates
  computedVal2 = computed(
    obj => obj.test1 + obj.test2, this
  );

  // sample fetching data
  // purposely using fetch instead of rxjs to get data
  // to illustrate that you don't need to know rxjs to use react-obs
  fetchSomeData () {
    fetch("https://randomuser.me/api/")
    .then(data => data.json())
    .then(data => {
      this.someData.next(data)
    })
  }
}

export const appStore = new AppStore();
export const AppContext = React.createContext(appStore);