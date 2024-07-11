import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get('http://localhost:5057/api/todos');
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (newTodo.trim() === '') return;
    await axios.post('http://localhost:5057/api/todos', { title: newTodo, isCompleted: false });
    setNewTodo('');
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5057/api/todos/${id}`);
    fetchTodos();
  };

  const editTodo = async (todo) => {
    if (editingText.trim() === '') return;
    await axios.put(`http://localhost:5057/api/todos/${todo.id}`, { ...todo, title: editingText });
    setEditingTodo(null);
    setEditingText('');
    fetchTodos();
  };

  return (
    <div className="container">
      <h1>Todo App</h1>
      <input 
        type="text" 
        value={newTodo} 
        onChange={(e) => setNewTodo(e.target.value)} 
        placeholder="New todo"
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <div className="todo-item">
              {editingTodo === todo.id ? (
                <>
                  <input 
                    type="text" 
                    value={editingText} 
                    onChange={(e) => setEditingText(e.target.value)} 
                  />
                  <button className="edit-btn" onClick={() => editTodo(todo)}>Save</button>
                  <button onClick={() => setEditingTodo(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span>{todo.title}</span>
                  <div className="todo-buttons">
                    <button 
                      className="edit-btn"
                      onClick={() => {
                        setEditingTodo(todo.id);
                        setEditingText(todo.title);
                      }}
                    >
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
