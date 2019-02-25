import * as React from "react";
import { useState, useContext } from "react";
import { TodoContext, FILTERS } from "./TodoStore";
import { useObs } from "../../../dist";
import TodoItem from "./TodoItem";

export default function Todo() {

  const todoStore = useContext(TodoContext);
  const [todos] = useObs(todoStore.todos)
  const [todoLeft] = useObs(todoStore.todoLeft)
  const [filter, setFilter] = useObs(todoStore.filter);

  const [editId, setEditId] = useState(0);
  const [todoName, setTodoName] = useState("");


  const addTodoIfValid = e => {
    if (e.keyCode === 13 && todoName.trim()) {
      todoStore.addTodo(todoName)
      setTodoName("")
    }
  }


  return (
    <>
      <div className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="After typing name, press enter to add"
            value={todoName}
            onKeyDown={addTodoIfValid}
            onChange={e => setTodoName(e.target.value)}
            autoFocus={true}
          />
        </header>
        <ul className="todo-list">
          {
            todos
              .filter(todo => {
                return filter === FILTERS.ALL
                  || (filter === FILTERS.COMPLETED && todo.completed)
                  || (filter === FILTERS.PENDING && !todo.completed)
              })
              .map(todo => 
              <TodoItem
                todo={todo}
                editing={editId === todo.id}
                toggleEdit={setEditId}
                updateName={name => todoStore.updateItemName(todo.id, name)}
                remove={() => todoStore.removeItem(todo.id)}
                toggleComplete={() => todoStore.toggleItemComplete(todo.id)}
                key={todo.id}
                />
            )
          }
        </ul>
        <footer className="footer">
          <span className="todo-count"><strong>{todoLeft}</strong> item left</span>
          <ul className="filters">
            {
              Object.keys(FILTERS).map((f, i) => (
                <li
                  key={i}
                  onClick={() => setFilter(FILTERS[f])}>
                  <a className={filter === FILTERS[f] ? "selected" : ""} href="#">{f}</a>
                </li>
              ))
            }
          </ul>
        </footer>
      </div>
      <footer className="info">
			  <p>Double-click to edit a todo</p>
        <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
        <p>Created by <a href="http://todomvc.com">Miguel Wu</a></p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      </footer>
    </>
  )
}