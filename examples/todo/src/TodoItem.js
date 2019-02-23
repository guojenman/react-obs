import React, { useState, useRef, useEffect } from "react";
import classnames from "classnames";

export default function TodoItem({ todo, editing, toggleComplete, remove, updateName, toggleEdit }) {
  const [editText, setEditText] = useState("");
  const editRef = useRef();


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
    <li className={classnames({completed: todo.completed, editing})}>
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