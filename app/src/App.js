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

  // 렌더링 최적화 작업 필요
  // https://velopert.com/3480 참고

  // addTodos, editTodos 창 draggable 기능 추가해야됨

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('todoList')) == null) {
      return;
    }
    setTodoList(JSON.parse(localStorage.getItem('todoList')));
  }, []);

  useEffect(() => {
    setTodoValue(currentTodos);
  }, [currentTodos]);

  useEffect(() => {
    if (addTodos && editTodos) {
      setEditTodos(false);
    }
    return;
  }, [addTodos]);

  useEffect(() => {
    if (editTodos && addTodos) {
      setAddTodos(false);
    }
    return;
  }, [editTodos]);

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
    <div className='background'>
      {addTodos && (
        <div className='input-todos-modal'>
          <header>
            <h3 className='input-modal-name'>lil todo</h3>
            <button
              type='button'
              className='input-modal-x-btn'
              onClick={() => {
                setAddTodos(false);
              }}
            >
              <div></div>
            </button>
          </header>
          <div>
            <textarea
              placeholder='New todo'
              ref={todoTextArea}
              className='input-todos-textarea'
            ></textarea>
            <button
              type='button'
              className='input-modal-add-btn'
              onClick={setTodos}
            >
              Add
            </button>
          </div>
        </div>
      )}
      {editTodos && (
        <div className='input-todos-modal'>
          <header>
            <h3 className='input-modal-name'>lil todo</h3>
            <button
              type='button'
              className='input-modal-x-btn'
              onClick={() => {
                setEditTodos(false);
              }}
            >
              X
            </button>
          </header>
          <div>
            <textarea
              ref={editTextArea}
              value={todoValue}
              className='input-todos-textarea'
              onChange={(e) => {
                handleChange(e);
              }}
            ></textarea>
            <button
              type='button'
              className='input-modal-save-btn'
              onClick={changeTodos}
            >
              Save
            </button>
            <button
              type='button'
              className='input-modal-delete-btn'
              onClick={deleteTodos}
            >
              Delete
            </button>
          </div>
        </div>
      )}
      <div className='container'>
        <header>
          <h1 className='app-name'>Todo</h1>
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
            className='add-btn'
            type='button'
            onClick={() => {
              setAddTodos(true);
            }}
          >
            <h3>Add Todo</h3>
          </button>
        </footer>
      </div>
    </div>
  );
}

function TodoBox(props) {
  return (
    <main className='todos-container'>
      {props.todoList === [] ? (
        <h3>No todos yet</h3>
      ) : (
        <div>
          {props.todoList.map((todo, index) => {
            return (
              <div
                key={index}
                className={
                  props.todoList[index].state
                    ? 'todo-container done'
                    : 'todo-container processing'
                }
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
                  htmlFor={index}
                  className={
                    props.todoList[index].state
                      ? 'checkbox checked'
                      : 'checkbox'
                  }
                ></label>
                <span className='todo-text'>{todo.value}</span>
                <button
                  type='button'
                  className='todos-edit-btn'
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
    </main>
  );
}

export default App;
