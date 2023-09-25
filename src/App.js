import React, {useState, useEffect} from 'react'; 
import axios from 'axios'; 

const App = () => {
  const [tasks, setTasks] = useState([]); 
  const [newTask, setNewTask] = useState({
    title: "", 
    description: "", 
    completed: false
  })

  const getTask = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks'); 
      setTasks(response.data)
    }
    catch (error) {
      console.error("Erreur lors de la récupération des tasks:", error)
    }
  }

  useEffect(() => {
    getTask(); 
  }, []); 

  const addTask = async () => {
    try {
      await axios.post('http://localhost:5000/tasks', newTask); 
      setTasks([...tasks, newTask]); 
      setNewTask({
        title: "", 
        description: "", 
        completed: false,
      })
    }
    catch (error) {
      console.error(
        "Erreur lors de la création de la task (message provenant du front)",
         error
      ); 
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`); 
      const updatedArray = tasks.filter((task) => task._id !== taskId); 
      setTasks(updatedArray)
    }
    catch (error) {
      console.error("Erreur lors de la suppression de la task", error)
    }
  }

  const updateTask = async (taskId, updates) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${taskId}`, updates); 
      const updatedTasks = tasks.map((task) => {
        if(task._id === taskId) {
          return { ...task, ...updates}; 
        } else {
          return task
        }
      }); 
      setTasks(updatedTasks); 
    }
    catch (error) {
      console.error("Erreur lors de la modification de la task", error)
    }
  }

  return (
    <div>
      <h1>Todo list - Backend training - 006</h1>
      <input
        type="text"
        placeholder="Task title"
        value={newTask.title}
        onChange={(e) => setNewTask({
          ...newTask, title: e.target.value 
        })}
      />
      <input 
        type="text"
        placeholder="Task description"
        value={newTask.description}
        onChange={(e) => setNewTask({
          ...newTask, description : e.target.value 
        })}
      />
      <button onClick={addTask}>Add Task</button>
      {
        tasks && 
        <ul>
          {
            tasks.map((task) => (
                <li key={task._id}>
                  <input 
                    type="checkbox"
                    checked={task.completed}  
                    onChange={(e) => updateTask(task._id, {
                      completed: e.target.checked
                    })}
                  />
                  <span>{task.title} - {task.description}</span> 
                  <button onClick={() => deleteTask(task._id)}>Delete</button>
                </li>
            ))
          }
        </ul>
      }
    </div>
  )
}

export default App; 