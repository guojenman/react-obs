import * as React from "react";
import { useState, useRef, useEffect } from "react";
import classnames from "classnames";
import { ITodoItem } from "./TodoStore";

interface IProps {
  todo: ITodoItem;
  editing: boolean;
  toggleComplete: () => void;
  updateName: (name: string) => void;
  toggleEdit: (id: number) => void;
  remove: () => void;
}
export default function TodoItem(props: IProps) {
  const { todo, editing, toggleComplete, updateName, toggleEdit, remove } = props;
  const [editText, setEditText] = useState("");
  const editRef = useRef<HTMLInputElement>();


  const handleEdit = () => {
    setEditText(todo.name);
    toggleEdit(todo.id)
  }

  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      updateName(editText)
      toggleEdit(0)
    }
  }

  useEffect(() => {
    if (editing) {
      editRef.current.focus();
    }
  }, [editing])

  return (
    <li className={classnames({ completed: todo.completed, editing })}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={toggleComplete}
        />
        <label onDoubleClick={handleEdit}>{todo.name}</label>
        <button onClick={remove} className="destroy"></button>
      </div>
      <input
        ref={editRef}
        className="edit"
        value={editText}
        onChange={e => setEditText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </li>
  )
}