const express = require('express'); 
const bodyParser = require('body-parser'); 
const cors = require('cors'); 
const mongoose = require('mongoose'); 
const app = express(); 
app.use(cors()); 
app.use(bodyParser.json()); 
const port = 5000; 
const dbUri = 'mongodb://localhost/todolist'; 
const db = mongoose.connection; 
const dbConfig = {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
}; 

mongoose.connect(dbUri, dbConfig); 

db.once("open", () => {
  console.log('Connexion à mongoDB réussi'); 
}); 

db.on('error', (error) => {
  console.error("Erreur lors de la connexion à mongoDB", error)
})

db.on('disconected', () => {
  console.log('Déconnexion de la base de données mongoBD'); 
})


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
  catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des données', 
      error: error, 
    })
  }
}); 

app.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body); 
    const response = await task.save(); 
    res.json({
      response : response, 
      message: "Task ajouté avec succes", 
    }); 
  }
  catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la creation de la task', 
      error: error
    }); 
  }; 
}); 

app.put('/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params; 
    const response = await Task.findByIdAndUpdate(taskId, req.body); 
    res.json({
      message: "Mise à jour de la task réussi", 
      response: response, 
    })
  }
  catch (error) {
    res.status(500).json({
      reponse: res, 
      message: "Erreur lors de la mis à jour de la task", 
    }); 
  }
}); 

app.delete('/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params; 
    const response = await Task.findByIdAndDelete(taskId); 
    res.status(201).json({
      message: "Suppression de la task réussi", 
      response: response
    })
  }
  catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la suppression de la task', 
      error: error, 
    })
  }
})

app.listen(port, () => {
  console.log(`Serveur en cours d'éxécution sur le port ${port}`)
}); 