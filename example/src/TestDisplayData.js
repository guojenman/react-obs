import React, { useContext } from "react";
import { AppContext } from "./AppStore";
import { useObs, computed, valueInObjectByPath } from "../../";

export default function TestDisplayData () {
  console.log("render data")

  const appStore = useContext(AppContext);
  const [val] = useObs(computed(
    ([data]) => valueInObjectByPath(data, "results.0.name"),
    [appStore.someData]
  ))

  return (
    <div style={{ padding: "4rem", border: "1px solid #ccc" }}>
      {
        !!val
        ? <div>Hi, {val.first} {val.last}</div>
        : <div>no data loaded</div>
      }
    </div>
  )
}