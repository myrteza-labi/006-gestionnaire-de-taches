const express = require('express'); 
const cors = require('cors'); 
const bodyParser = require('body-parser'); 
const port = 5000; 
const app = express(); 
app.use(cors()); 
app.use(bodyParser.json()); 
const mongoose = require('mongoose'); 
const dbUri = "mongodb://localhost/todolist"
const db = mongoose.connection; 
const dbConfig = {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
}

mongoose.connect(dbUri,dbConfig); 

const taskSchema = mongoose.Schema({
  title : String, 
  description: String, 
  completed: Boolean,
})

const Task = mongoose.model('Task', taskSchema); 

db.once('open', () => {
  console.log('Connexion à mongoDB réussi');
});

db.once('close', () => {
  console.log('Deconnexion de mongoDB'); 
}); 

db.on('error', () => {
  console.log('Erreur lors de la connexion à mongoDB');
}); 

app.get('/tasks', async (req,res) => {
  try {
    const response = await Task.find(); 
    res.json(response); 
  }
  catch(error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des tasks", 
      error: error, 
    })
  };
});

app.post('/tasks', async (req,res) => {
  try {
    const task = new Task(req.body); 
    await task.save(); 
    res.status(201).json({
      message: "Task ajouté avec succes", 
      res: task,
    })
  }
  catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout de la task", 
      error: error, 
    })
  };
});

app.put('/tasks/:taskId', async (req,res) => {
  try {
    const { taskId } = req.params; 
    const updates = req.body; 
    await Task.findByIdAndUpdate(taskId, updates); 
    res.status(200).json({
      message: "Task mis à jour avec succès"
    })
  }
  catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mis à jour de la task", 
      error: error
    })
  }
})

app.delete('/tasks/:taskId', async (req,res) => {
  try {
    const {taskId} = req.params; 
    await Task.findByIdAndDelete(taskId); 
    res.status(200).json({
      message: "Task supprimé avec succès"
    })
  }
  catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la task", 
      error: error,
    });
  };
});

app.listen(port, () => {
  console.log(`Serveur en cours d'éxécution sur le port ${port}`); 
}); 
