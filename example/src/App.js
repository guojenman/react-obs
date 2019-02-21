import React from 'react';
import { AppContext, appStore } from './AppStore';
import Test1 from './Test1';
import Test2 from './Test2';
import TestDisplayData from './TestDisplayData';


export default function App() {
  return (
    <>
      <AppContext.Provider value={appStore}>
        <div style={{ padding: "4rem", border: "1px solid #ccc" }}>
          <Test1 />
          <Test2 />
          <TestDisplayData />
        </div>
      </AppContext.Provider>
    </>
  )
}
