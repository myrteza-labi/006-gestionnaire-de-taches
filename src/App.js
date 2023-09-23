import React, {useState, useEffect} from 'react'; 
import axios from'axios'; 

const App = () => {
    const [tasks, setTasks] = useState([]); 
    const [newTask, setNewTask] = useState({
        title: "", 
        description: "", 
        completed: false,
    })

  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  }, []);


    const addTask = () => {
        axios.post('http://localhost:5000/tasks', newTask)
            .then(response => {
                setTasks([...tasks, response.data]); 
                setNewTask({ title: '', description : '', completed: false}); 
            })
            .catch(error => {
                console.error('Error adding task:', error); 
            }); 
    }

    const updateTask = (taskId, updates) => {
        axios.put(`http://localhost:5000/tasks/${taskId}`, updates)
        .then(() => {
            const updatedTasks = tasks.map(task => {
                if (task._id === taskId) {
                    return { ...task, ...updates}; 
                }
                return task; 
            })
            setTasks(updatedTasks); 
        })
        .catch((error) => {
            console.log("Error updating task", error);
        }); 
    }

    const deleteTask = (taskId) => {
        axios.delete(`http://localhost:5000/tasks/${taskId}`)
            .then(() => {
                const updatedTasks = tasks.filter(task => task._id !== taskId); 
                setTasks(updatedTasks); 
            })
            .catch(error => {
                console.log("Error deleting task:", error); 
            })
    }

 
    return (
        <div>
            <h1>Todo List - Backend training n° 006</h1>
            <div>
                <input 
                    type="text"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
                <input 
                    type="text"
                    placeholder="Task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask , description : e.target.value})}
                />
                <button onClick={addTask}>Add task</button>
            </div>
            <ul>
                {tasks.map((task) => (
                    <li key={task._id}>
                        <input  
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) => updateTask(task._id, {
                                completed: e.target.checked
                            })}
                        />
                        {task.title} - {task.description}
                        <button onClick={() => deleteTask(task._id)} >Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default App; 
