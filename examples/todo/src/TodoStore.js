import { createContext } from "react";
import { makeObs, computed } from "../../../";

export const FILTERS = {
  ALL: 0,
  PENDING: 1,
  COMPLETED: 2
}

class TodoStore {
  __todoId = 0;

  filter = makeObs(FILTERS.ALL)
  todos = makeObs([])
  todoLeft = computed(([v]) => v.filter(t => !t.competed).length, [this.todos]);

  addTodo = name => {
    this.todos.next([
      ...this.todos.getValue(),
      { name, completed: false, id: ++this.__todoId }
    ])
  }

  updateItemName = (id, name) => {
    const todos = this.todos.getValue();
    this.todos.next(
      todos.map(todo => todo.id === id ? {...todo, name} : todo)
    )
  }

  toggleItemComplete = (id) => {
    const todos = this.todos.getValue();
    this.todos.next(
      todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed} : todo)
    )
  }

  removeItem = (id) => {
    const todos = this.todos.getValue();
    this.todos.next(
      todos.filter(todo => todo.id !== id)
    )
  }

}

export const todoStore = new TodoStore();
export const TodoContext = createContext(todoStore);