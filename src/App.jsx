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
      setTodos([
        ...todos,
        { id: todos.length + 1, text: newTodo, completed: false },
      ]);
    }
    persistToDB();
    setNewTodo("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    persistToDB();
  };

  const deleteTodo = (id) => {
    console.log("Deleting todo with id:", id);
    // setTodos(todos.filter((todo) => todo.id !== id));
    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
    persistToDB();
  };

  const startEditing = (id, text) => {
    setEditTodo(id);
    setEditedText(text);
  };

  const saveEditedTodo = (id) => {
    setTodos(
      todos.map((todo) => {
        if (editedText !== "" && editedText !== todo.text) {
          todo.id === id ? { ...todo, text: editedText } : todo;
        } else {
          return todo;
        }
      })
    );
    setEditTodo(null);
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
  function persistToDB() {
    console.log("Persisting todos to localStorage:", todos);
    localStorage.setItem("todo-list", JSON.stringify(todos));
  }

  return (
    <div className="max-w-screen-md mx-auto mt-8 p-4">
      <h1 className="text-4xl font-bold mb-4">Todo App</h1>
      <div className="flex items-center mb-4">
        <input
          className="border p-2 w-full mr-2"
          type="text"
          placeholder="Add new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2" onClick={addTodo}>
          Add
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="mr-2"
            />
            <span className={`text-lg ${todo.completed ? "line-through" : ""}`}>
              {editTodo === todo.id ? (
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="border p-1 mr-2"
                />
              ) : (
                todo.text
              )}
            </span>
            {editTodo !== todo.id && (
              <button
                className="bg-yellow-500 text-white px-2 py-1 mr-2"
                onClick={() => startEditing(todo.id, todo.text)}
              >
                Edit
              </button>
            )}
            {editTodo === todo.id && (
              <button
                className="bg-green-500 text-white px-2 py-1"
                onClick={() => saveEditedTodo(todo.id)}
              >
                Save
              </button>
            )}
            <button
              className="bg-red-500 text-white px-2 mx-8 py-1 ml-2"
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
