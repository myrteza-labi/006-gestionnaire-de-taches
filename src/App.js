import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 

const App = () => {

  const [tasks, setTasks] = useState([]); 
  const [newTask, setNewTask] = useState({
    title: "", 
    description: "", 
    completed: true
  })

  const fetchData = async () => {
    try {
      const updatedTasks = await axios.get('http://localhost:5000/tasks'); 
      setTasks(updatedTasks.data); 
    } 
    catch (error) {
      console.error("Erreur lors de la récupération des tasks", error); 
    }
  } 

  useEffect(() => {
    fetchData(); 
  },[tasks]); 

  const addTask = async () => {
    try {
      axios.post('http://localhost:5000/tasks', newTask); 
      setNewTask({
        title: "", 
        description: "", 
        completed: false
      })
    }
    catch (error) {
      console.error("Erreur lors de la création de la task", error); 
    }
  }

  const uploadTask = async (taskId, updates) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${taskId}`, updates); 
      fetchData(); 
    }
    catch (error) {
      console.error("Erreur lors de la modification de la task:", error)
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`); 
      fetchData(); 
    }
    catch(error) {
      console.error("Erreur lors de la suppression de la task", error); 
    }
  }

  return (
    <div>
      <h1>Todo list - backend training n°6</h1>
      <input 
        type="text"
        placeholder="Task title"
        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
      />
      <input 
        type="text"
        placeholder="Task description"
        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
      />
      <button onClick={addTask}>Add task</button>
      <ul>
        {
          tasks && 
          tasks.map((task) => (
            <li key={task._id}>
              <input
                type="checkbox"
                onChange={(e) => uploadTask(task._id, {
                  completed: e.target.checked
                })}
                checked={task.completed}
              />
              {task.title} - {task.description}
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default App; 