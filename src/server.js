const express = require('express'); 
const app = express(); 
const port = 5000; 
const mongoose = require('mongoose');
const dbUri = 'mongodb://localhost/todolist'; 
const db = mongoose.connection; 
const dbConfig = {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
}
const bodyParser = require('body-parser'); 
const cors = require('cors'); 
app.use(cors()); 
app.use(bodyParser.json()); 

mongoose.connect(dbUri, dbConfig);

db.once('open', () => {
  console.log("Connection à mongoDB réussi"); 
}); 

db.once('close', () => {
  console.log("Deconnexion de mongoDB"); 
}); 

db.on('error', () => {
  console.error("Erreur lors de la connexion à mongoDB"); 
  }
)

const taskSchema = mongoose.Schema({
  title: String,
  description: String, 
  completed: Boolean
})

const Task = mongoose.model("Task", taskSchema)

app.get('/tasks', async (req,res) => {
  try {
    const response = await Task.find();
    res.json(response)
  }
  catch(error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des tasks", 
      error: error
    })
  }
})

app.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body); 
    const response = await task.save(); 
    res.json(response)
  }
  catch(error) {
    res.status(500).json({
      message: "Erreur lors de la création de la task", 
      error: error
    })
  }
})

app.put('/tasks/:taskId', async (req,res) => {
  try {
    const { taskId } = req.params; 
    const updates = req.body; 
    const response = await Task.findByIdAndUpdate(taskId, updates); 
    res.json(response); 
  }
  catch(error){
    res.status(500).json({
      message: "Erreur lors de la modification de la task", 
      error: error
    })
  }
})

app.delete('/tasks/:taskId', async (req,res) => {
  try {
    const { taskId } = req.params; 
    const response = await Task.findByIdAndDelete(taskId); 
    res.json(response); 
  }
  catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la task", 
      error: error
    });
  };
});

app.listen(port, () => {
  console.log(`Server en cours d'éxécution sur le port ${port}`); 
})