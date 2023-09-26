import React, {useState, useEffect} from 'react'; 
import axios from 'axios'; 

const App = () => {

  const [tasks, setTasks] = useState([]); 
  const [newTask, setNewTask] = useState({
    title: "", 
    description: "", 
    completed: false
  })

  useEffect(() => {
    fetchData(); 
  }, [tasks]); 

  const fetchData = async () => {
    try {
      const tasks = await axios.get("http://localhost:5000/tasks"); 
      setTasks(tasks.data); 
    }
    catch(error) {
      console.error("Erreur lors de la récupération des tasks", error); 
    }
  }

  const addTask = async () => {
    try {
      await axios.post('http://localhost:5000/tasks', newTask); 
      fetchData(); 
    } 
    catch (error) {
      console.error("Erreur lors de la creaction de la task", error); 
    }
  }

  const updateTask = async (taskId, updates) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${taskId}`, updates);
      fetchData();  
    } 
    catch (error) {
      console.error("Erreur lors de la modification de la task", error); 
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`); 
      fetchData(); 
    }
    catch (error) {
      console.error("Erreur lors de la suppression de la task", error); 
    }; 
  }; 

  return (
    <div>
      <h1>Todo list - backend training n°6</h1>
      <input
        type="text"
        placeholder="Task title"
        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
        value={newTask.title}
      />
      <input 
        type="text"
        placeholder="Task description"
        onChange={(e) => setNewTask({...newTask, description : e.target.value})}
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
                onChange={(e) => updateTask(task._id, {completed: e.target.checked})}
                checked={task.completed}
              />
              {task.title} - {task.description}
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