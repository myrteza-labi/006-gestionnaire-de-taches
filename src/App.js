import React, {useState, useEffect} from 'react'; 
import axios from 'axios'; 

const App = () => {

  const [tasks, setTasks] = useState([]); 
  const [newTask, setNewTask] = useState({
    title: "", 
    description: "", 
    completed: false,
  })

  const getTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks'); 
      const updatedTasks = response.data; 
      setTasks(updatedTasks); 
    }
    catch (error) {
      console.log("Erreur lors de la récupération des tasks", error)
    }
  } 

  useEffect(() => {
    getTasks(); 
  }, [tasks])

  const addTask = async () => {
    try {
      await axios.post('http://localhost:5000/tasks', newTask); 
      setNewTask({
        title: "", 
        description: "", 
        completed: false,
      })
      getTasks(); 
    }
    catch (error) {
      console.error("Erreur lors de la création de la task", error); 
    }
  }

  const updateTask = async (taskId, updates) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${taskId}`, updates); 
      getTasks(); 
    }
    catch (error) {
      console.error("Erreur lors de la modification de la task", error); 
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`)
      const updatedTasks = tasks.filter((task) => task._id !== taskId); 
      setTasks(updatedTasks); 
    }
    catch(error) {
      console.error("Erreur lors de la suppression de la task", error); 
    }
  }

  return (
    <div>
      <h1>Todo List - backend training 006</h1>
      <input 
        type="text"
        placeholder="Task title"
        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
        value={newTask.title}
      />
      <input 
        type="text"
        placeholder="Task description"
        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
        value={newTask.description}
      />
      <button onClick={addTask}>Add task</button>
      <ul>
        {
          tasks && 
          tasks.map((task) => (
            <li key={task._id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => updateTask(task._id, {
                  completed: e.target.checked
                })}
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