import React from "react";
import { TodoContext, todoStore } from "./TodoStore";
import Todo from "./Todo";
export default function App() {
  return (
    <TodoContext.Provider value={todoStore}>
      <Todo />
    </TodoContext.Provider>
  )
}