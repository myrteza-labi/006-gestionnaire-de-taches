const express = require('express'); 
const app = express(); 
const cors = require('cors'); 
app.use(cors()); 
const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); 
const dbUri = 'mongodb://localhost/todolist';
const mongoose = require('mongoose'); 
const dbConfig = {
  useNewUrlParser : true, 
  useUnifiedTopology: true, 
}
const port = 5000; 
  
mongoose.connect(dbUri, dbConfig); 

const db = mongoose.connection; 

const taskSchema = new mongoose.Schema({
  title: String, 
  description: String, 
  completed: Boolean,
})

const Task = mongoose.model('Task', taskSchema); 

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find(); 
    res.json(tasks); 
  }
  catch(error) {
    console.error("Erreur lors de la récupération des tasks", error); 
  }
})

app.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save(); 
    res.json(task);
  }
  catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de la task", 
      error: error, 
    });
  };
});

app.delete("/tasks/:taskId", async (req,res) => {
  try {
    const { taskId } = req.params; 
    await Task.findByIdAndDelete(taskId); 
    res.json(tasks)
  }
  catch (error) {
    console.error("Erreur lors de la suppression de la task:", error); 
  }; 
}); 

app.put('/tasks/:taskId', async (req,res) => {
  try {
    const { taskId } = req.params; 
    const updates = req.body; 
    const response = await Task.findByIdAndUpdate(taskId, updates); 
    res.json(response); 
  }
catch (error) {
  console.error("Erreur lors de la modification de la task", error); 
}; 
}); 


db.once("open", () => {
  console.log("Connexion à mondoDB réussi");
}); 

db.on("close", () => {
  console.log("Déconnexion de la base de données mongoDB"); 
}); 

db.on("error", async () => {
  console.error("Erreur lors de la connexion à mongoDB", error); 
}); 

app.listen(port, () => {
  console.log(`Serveur en cours d'éxécution sur le port ${port}`)
})
