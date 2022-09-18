import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [addTodos, setAddTodos] = useState(false);
  const [editTodos, setEditTodos] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [currentTodos, setCurrentTodos] = useState('');
  const [selectedTodos, setSelectedTodos] = useState('');
  const [todoValue, setTodoValue] = useState('');

  const todoTextArea = useRef();
  const editTextArea = useRef();
  const checkboxRef = useRef([]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('todoList')) == null) {
      return;
    }
    setTodoList(JSON.parse(localStorage.getItem('todoList')));
  }, []);

  useEffect(() => {
    setTodoValue(currentTodos);
  }, [currentTodos]);

  const setTodos = () => {
    setTodoList([
      ...todoList,
      { value: todoTextArea.current.value, state: false },
    ]);
    let todo = [
      ...todoList,
      { value: todoTextArea.current.value, state: false },
    ];
    todoTextArea.current.value = '';
    setLocalStorage(todo);
  };

  const setLocalStorage = (todo) => {
    localStorage.setItem('todoList', JSON.stringify(todo));
  };

  const changeTodos = () => {
    let todos = [...todoList];
    todos[selectedTodos].value = editTextArea.current.value;
    setTodoList(todos);
    setLocalStorage(todos);
    setEditTodos(false);
  };

  const deleteTodos = () => {
    let todos = [...todoList];
    todos.splice(selectedTodos, 1);
    setTodoList(todos);
    setLocalStorage(todos);
    setEditTodos(false);
  };

  const handleChange = (e) => {
    setTodoValue(e.target.value);
  };

  return (
    <div className='App'>
      {addTodos && (
        <div className='input-todos-modal'>
          <header>
            <h3>lil todo</h3>
            <button
              type='button'
              onClick={() => {
                setAddTodos(false);
              }}
            >
              X
            </button>
          </header>
          <div>
            <textarea placeholder='new todo' ref={todoTextArea}></textarea>
            <button type='button' onClick={setTodos}>
              Add
            </button>
          </div>
        </div>
      )}
      {editTodos && (
        <div className='input-todos-modal'>
          <header>
            <h3>lil todo</h3>
            <button
              type='button'
              onClick={() => {
                setEditTodos(false);
              }}
            >
              X
            </button>
          </header>
          <div>
            <input
              ref={editTextArea}
              value={todoValue}
              onChange={(e) => {
                handleChange(e);
              }}
            ></input>
            <button type='button' onClick={changeTodos}>
              Save
            </button>
            <button type='button' onClick={deleteTodos}>
              Delete
            </button>
          </div>
        </div>
      )}
      <div className='background'>
        <header>
          <h1>Todo</h1>
        </header>
        <TodoBox
          todoList={todoList}
          setTodoList={setTodoList}
          editTodos={editTodos}
          setEditTodos={setEditTodos}
          setCurrentTodos={setCurrentTodos}
          setSelectedTodos={setSelectedTodos}
          checkboxRef={checkboxRef}
        ></TodoBox>
        <footer>
          <button
            type='button'
            onClick={() => {
              setAddTodos(true);
            }}
          >
            Add Todo
          </button>
        </footer>
      </div>
    </div>
  );
}

function TodoBox(props) {
  return (
    <div>
      {props.todoList === [] ? (
        <h3>No todos yet</h3>
      ) : (
        <div>
          {props.todoList.map((todo, index) => {
            return (
              <div
                key={index}
                className={props.todoList[index].state ? 'done' : 'processing'}
              >
                <input
                  className='invisible'
                  id={index}
                  type='checkbox'
                  value={index}
                  ref={(elem) => (props.checkboxRef.current[index] = elem)}
                  onClick={() => {
                    let todo = [...props.todoList];
                    todo[index].state = props.checkboxRef.current[index].checked
                      ? true
                      : false;
                    props.setTodoList(todo);
                    localStorage.setItem('todoList', JSON.stringify(todo));
                  }}
                ></input>
                <label
                  for={index}
                  className={
                    props.todoList[index].state
                      ? 'checkbox checked'
                      : 'checkbox'
                  }
                ></label>
                {todo.value}
                <button
                  type='button'
                  onClick={() => {
                    props.setCurrentTodos(todo.value);
                    props.setEditTodos(true);
                    props.setSelectedTodos(index);
                  }}
                ></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
