import React, { useEffect, useState } from "react";

export const TodoListFetch = () => {
    const baseURL = 'https://playground.4geeks.com/todo';
    const user ='mimoun';
    const [isEdit, setIsEdit] = useState(false);
    const [task, setTask] = useState('');
    const [todos, setTodos] = useState([]);
    const [editTask, setEditTask] = useState({});
    const [labelEdit, setLabelEdit] = useState ('');
    const [completedEdit, setCompletedEdit] = useState ();

    const handleSubmitAdd = async (event) =>{
        event.preventDefault();
        const dataToSend = {
            label: task,
            is_done: false
        };
        const url = `${baseURL}/todos/${user}`
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        }
        const response = await fetch(url, options);
        if (!response.ok){
            console.log('error:', response.status, response.status.text)
            return
        }
        setTask('')
        getTodos()
    }
    const handleEdit = (taskEdit) => {
        setIsEdit(true)
        setEditTask(taskEdit)
        setLabelEdit(taskEdit.label)
        setCompletedEdit(taskEdit.is_done)
    }

    const handleSubmitEdit = async (event) => {
        event.preventDefault();
        const dataToSend = {
            label: labelEdit,
            is_done: completedEdit
        };
        const url = `${baseURL}/todos/${editTask.id}`;
        const options = {
            method: 'PUT',
            headers: {"content-type": "application/json"},
            body: JSON.stringify(dataToSend)
        }
        const response = await fetch(url, options);
        if(!response.ok){ console.log('error:', response.status, response.statusText)
            return 
        }
        getTodos()
        setIsEdit(false);
        setEditTask({})
        setLabelEdit('')
        setCompletedEdit(null)

    }
    const handleDelete = async (taskId) => {
        const url = `${baseURL}/todos/${taskId}`
        const options = {
            method:'DELETE'
        
        }
        const response = await fetch(url, options);
        if(!response.ok){
            console.log('error:', response.status, response.statusText)
      return

        }
        getTodos();
    }
    const getTodos = async () => {
        const url = `${baseURL}/users/${user}`;
        const options = {method: 'GET'}
        const response = await fetch(url, options);
        if (!response.ok){
            console.log('error:', response.status, response.statusText)
            if (response.status == 404) {

            }
      
            return 


        }
        const data = await response.json();
        setTodos(data.todos)
    }
    useEffect(() => {
        getTodos()
    }, [])
    return(
        <div className="container my-5">
        <h1 className="text-success">Todo List with Fetch</h1>
        {isEdit ?
          <form onSubmit={handleSubmitEdit}>
            <div className="text-start mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Edit Task</label>
              <input type="text" className="form-control" id="exampleInputPassword1" 
                value={labelEdit} onChange={(event) => { setLabelEdit(event.target.value)}} />
            </div>
            <div className="text-start mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="exampleCheck1" 
                checked={completedEdit} onChange={(event) => { setCompletedEdit(event.target.checked)}}/>
              <label className="form-check-label" htmlFor="exampleCheck1">Completed</label>
            </div>
            <button type="submit" className="btn btn-primary me-2">Submit</button>
            <button type="reset" className="btn btn-secondary">Submit</button>
          </form>
          :
          <form onSubmit={handleSubmitAdd}>
            <div className="text-start mb-3">
              <label htmlFor="exampleTask" className="form-label">Add Task</label>
              <input type="text" className="form-control" id="exampleTask"
                value={task} onChange={(event) => setTask(event.target.value)} />
            </div>
          </form>
        }
  
        <h2 className="text-primary mt-5">List</h2>
        <ul className="text-start list-group">
          {todos.map((item) => <li key={item.id}
            className="list-group-item hidden-icon d-flex justify-content-between">
            <div>
              {item.is_done ?
                <i className="far fa-thumbs-up text-success me-2"></i>
                :
                <i className="fas fa-times-circle text-danger me-2"></i>
              }
              {item.label}
            </div>
            <div>
              <span onClick={() => handleEdit(item)}>
                <i className="fas fa-edit text-primary me-2"></i>
              </span>
  
              <span onClick={() => handleDelete(item.id)}>
                <i className="fas fa-trash text-danger"></i>
              </span>
            </div>
          </li>)}
  
          <li className="list-group-item text-end">{todos.length == 0 ? 'No tasks, please add a nesw taks' : todos.length + ' tasks'}</li>
        </ul>
      </div>  
    )

}