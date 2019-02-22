import React, { useContext } from "react";
import { AppContext } from "./AppStore";
import { useObsDeep } from "../../";

export default function TestDisplayData() {
  console.log("render data")

  const appStore = useContext(AppContext);
  const [val, setVal] = useObsDeep(appStore.someData, "results.0.name");

  return (
    <div style={{ padding: "4rem", border: "1px solid #ccc" }}>
      {
        !!val
          ? <div>Hi, {val.first} {val.last}</div>
          : <div>no data loaded</div>
      }
      <button onClick={() => setVal({ first: "steve", last: "changed" })}>set name to steve (data must be loaded first, from above)</button>
    </div>
  )
}