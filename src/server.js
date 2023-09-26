const mongoose = require('mongoose'); 
const dbUri = "mongodb://localhost/todolist" 
const dbConfig = {
  useNewUrlParser : true, 
  useUnifiedTopology: true
}
const express = require('express'); 
const app = express(); 
const cors = require('cors'); 
const bodyParser = require('body-parser'); 
app.use(cors()); 
app.use(bodyParser.json()); 
const port = 5000; 

const db = mongoose.connection; 

mongoose.connect(dbUri, dbConfig); 


const taskSchema = mongoose.Schema({
  title: String, 
  description: String, 
  completed: Boolean, 
})

const Task = mongoose.model('Task', taskSchema)

db.once('open', () => {
  console.log("Connexion à mongoDB réussi"); 
})

db.once('close', () => {
  console.log('Déconnexion de la base de données mongoDB'); 
})

db.on('error', () => {
  console.error('Erreur lors de la connexion à mongoDB'); 
})

app.get('/tasks', async (req,res) => {
  try {
    const response = await Task.find(); 
    res.json(response);
  }
  catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des tasks", 
      error : error
    });
  };
});

app.post('/tasks', async (req,res) => {
  try {
    const task = new Task(req.body); 
    const response = await task.save(); 
    res.status(201).json({
      message: "Task créée avec succes",
      response: response
    });
  } 
  catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de la task", 
      error: error
    });
  };
});

app.put('/tasks/:taskId', async (req,res) => {
  try {
    const { taskId } = req.params; 
    const response = await Task.findByIdAndUpdate(taskId, req.body)
    res.json(response); 
  }
  catch (error) {
    res.status(500).json({
      message: "Erreur lors de la modification de la task", 
      error: error
    })
  }
})

app.delete('/tasks/:taskId', async (req,res) => {
  try {
    const {taskId} = req.params; 
    const response = await Task.findByIdAndDelete(taskId); 
    res.json(response); 
  }
  catch(error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la task", 
      error: error
    })
  }
})

app.listen(port, () => {
  console.log(`Serveur en cours d'éxécution sur le port ${port}`); 
})