import React, {useState, useEffect} from 'react'; 
import axios from 'axios'; 

const App = () => {
  const [tasks, setTasks] = useState([]);  
  const [newTask, setNewTask] = useState({
    title: "", 
    description: "", 
    completed: false
  })

  const fetchData = async () => {
    try {
      const tasks = await axios.get('http://localhost:5000/tasks'); 
      const tasksData = tasks.data; 
      setTasks(tasksData)
    }
    catch(error) {
      console.error("Erreur lors de la récupération des tâches:", error); 
    }
  }

  useEffect(() => {
    fetchData(); 
  },[tasks])

  const addTask = async () => {
    try {
      const response = await axios.post('http://localhost:5000/tasks', newTask); 
      setNewTask({
        title: "", 
        description: "", 
        completed: false, 
      })
      console.log(response)
    }
    catch (error) {
      console.error("Erreur lors de l'ajout de la tâche:",error); 
    }
  }

  const updateTask = async (taskId, updates) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${taskId}`, updates);
      const updatedTasks = tasks.map((task) => {
        if (taskId === task._id) {
          return { ...task, ...updates }; 
        } else {
          return task; 
        }
      })
      setTasks(updatedTasks); 
    }
    catch(error) {
      console.error("Erreur lors de la mise à jour de la tâche", error)
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`); 
      const updatedTasks = tasks.filter((task) => task._id !== taskId); 
      setTasks(updatedTasks); 
    }
    catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  return (
    <>
    <h1>Todo list - backend training N°6</h1>
    <input 
      type="text"
      placeholder="Task title"
      onChange={(e) => setNewTask({...newTask, title : e.target.value})}
      value={newTask.title}
    />
    <input
      type="text"
      placeholder="Task description"
      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
      value={newTask.description}
    />
    <button onClick={addTask}>Add task</button>
    {
      tasks &&
      <ul>
        {
          tasks.map((task) => (
            <li key={task._id}>
              <input
                type="checkbox"
                onChange={(e) => updateTask(task._id, {completed : e.target.checked})}
                checked={task.completed}
              />
              {task.title} - {task.description}
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </li>
          ))
        }
      </ul>
    }
    </>
  )
}

export default App; 
