import React, {useState, useEffect} from 'react'; 
import axios from 'axios'; 

const App = () => {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({
    title: "", 
    descritpion: "", 
    completed: false,
  })

  const addTask = async () => {
    try {
      const response = await axios.post('http://localhost:5000/tasks', newTask); 
      setTasks([...tasks, response.data]); 
      setNewTask({
        title: "", 
        description: "",
        completed: false,
      })
      
    }
    catch (error) {
      console.error('Error adding task', error)
    }
  }

  const updateTask = async (taskId, updates) => {
    try {
      await axios.put('http://localhost:5000/tasks', updates); 
      const updatedTasks = tasks.map(task => {
        if (task._id === taskId) {
          return {...task, ...updates}
        }
        else {
          return task;
        }
      }); 
      setTasks(updatedTasks); 
    }
    catch (error) {
      console.error("Error updating task", error); 
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`); 
      const updatedTasks = tasks.filter(task => task._id !== taskId); 
      setTasks(updatedTasks); 
    }
    catch (error) {
      console.error("Error deleting task :", error)
    }
  }

  return (
    <>
    <h1>Todo list - backend Training N°6</h1>
      <input 
        type="text"
        placeholder="Task title"
        onChange={e => setNewTask({...newTask, title : e.target.value})}
      />
      <input
        type="text"
        placeholder="Task description"
        onChange={e => setNewTask({...newTask, description : e.target.value})}
      />
      <button onClick={addTask}>Add task</button>
      <ul>
        {
          tasks && 
          tasks.map( task => (
            <li key={task._id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={e => updateTask(task._id, {
                  completed : e.target.checked
                })}
              />
              {task.title} - {task.description}
              <button onClick={() => deleteTask(task._id)} >Delete</button>
            </li>
          ))
        }
      </ul>
    </>
  )
}

export default App; 