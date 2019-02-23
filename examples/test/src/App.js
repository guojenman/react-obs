import React, { useContext } from 'react';
import { AppContext } from './AppStore';
import Test1 from './Test1';
import Test2 from './Test2';
import TestDisplayData from './TestDisplayData';
import { useObs } from '../../../';


export default function App() {

  const appStore = useContext(AppContext)
  const [showDataComponent] = useObs(appStore.showDataComponent);
  return (
    <>
      <AppContext.Provider value={appStore}>
        <div style={{ padding: "4rem", border: "1px solid #ccc" }}>
          <Test1 />
          <Test2 />
          {
            showDataComponent ? <TestDisplayData /> : <div>data component is unmounted</div>
          }
        </div>
      </AppContext.Provider>
    </>
  )
}
