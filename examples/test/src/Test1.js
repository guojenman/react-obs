import React, { useContext } from "react";
import { AppContext } from "./AppStore";
import { useObs } from "../../../dist/";

export default function Test1 () {
  console.log("render 1")

  const appStore = useContext(AppContext);
  const [val, setVal] = useObs(appStore.test1);
  const [computedVal1] = useObs(appStore.computedVal1);
  const [computedVal2] = useObs(appStore.computedVal2);

  return (
    <div style={{ display: "inline-block", padding: "4rem", border: "1px solid #ccc" }}>
      <button onClick={() => setVal(v => v + 1)}>Test 1 = {val}</button>
      <div>computedVal1 = {computedVal1}</div>
      <div>computedVal2 = {computedVal2}</div>
    </div>
  )
}