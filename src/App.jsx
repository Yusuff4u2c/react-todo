import React, { useEffect, useState } from "react";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editTodo, setEditTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    fetchTodoFromDB();
  }, []);

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos((prevTodos) => {
        const updatedTodos = [
          ...prevTodos,
          { id: prevTodos.length + 1, text: newTodo, completed: false },
        ];
        persistToDB(updatedTodos);
        return updatedTodos;
      });
      setNewTodo("");
    }
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.filter((todo) => todo.id !== id);
      persistToDB(updatedTodos);
      return updatedTodos;
    });
  };

  const startEditing = (id, text) => {
    setEditTodo(id);
    setEditedText(text);
  };

  const saveEditedTodo = (id) => {
    setTodos((prevTodos) => {
      const editedTodos = prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text: editedText } : todo
      );
      persistToDB(editedTodos);
      setEditTodo(null);
      return editedTodos;
    });
  };

  function fetchTodoFromDB() {
    let fetchedTodoFromDB = localStorage.getItem("todo-list");
    try {
      const parsedTodos = JSON.parse(fetchedTodoFromDB);

      if (Array.isArray(parsedTodos)) {
        setTodos(parsedTodos);
      } else {
        setTodos([]);
      }
    } catch (error) {
      console.log(error.message);
      setTodos([]);
    }
  }

  function persistToDB(updatedTodos) {
    console.log("Persisting todos to localStorage:", updatedTodos);
    localStorage.setItem("todo-list", JSON.stringify(updatedTodos));
  }

  return (
    <div className="max-w-screen-md rounded-2xl px-8 bg-amber-900 text-center mx-auto mt-8 p-4">
      <h1 className="text-4xl font-bold mb-4 text-white">Todo App</h1>
      <form className="todo-form flex items-center mb-4">
        <input
          className="todo-input text-black rounded-2xl border p-2 w-full mr-2"
          type="text"
          placeholder="Add new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button
          type="submit"
          className="todo-btn rounded-2xl bg-blue-500 text-white px-4 py-2"
          onClick={addTodo}
        >
          Add
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex mb-2">
            <span className={`text-lg ${todo.completed ? "line-through" : ""}`}>
              {editTodo === todo.id ? (
                <form action="">
                  <input
                    type="text"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="p-1 mr-2 rounded-2xl px-3"
                  />
                  <button
                    className="bg-green-500 rounded-2xl text-white px-2 py-1"
                    onClick={() => saveEditedTodo(todo.id)}
                  >
                    Save
                  </button>
                </form>
              ) : (
                <div className=" flex justify-between p-8 bg-green-500">
                  <div className="flex">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="mr-2 "
                    />
                    <div>{todo.text}</div>
                  </div>
                  <div className="bg-red-500">
                    <button
                      className="bg-yellow-500 rounded-2xl text-white px-2 py-1 mr-2"
                      onClick={() => startEditing(todo.id, todo.text)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-orange-500 rounded-2xl text-white px-5 py-1"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
