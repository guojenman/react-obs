import React, { useContext } from "react";
import { AppContext } from "./AppStore";
import { useObs } from "../../";

export default function Test2 () {
  console.log("render 2")

  const appStore = useContext(AppContext);
  const [val, setVal] = useObs(appStore.test2);

  return (
    <div style={{ display: "inline-block", padding: "4rem", border: "1px solid #ccc" }}>
      <button onClick={() => setVal(val + 1)}>Test 2 = {val}</button>
      <button onClick={() => appStore.fetchSomeData()}>fetch random (called from &lt;Test2&gt;)</button>
    </div>
  )
}