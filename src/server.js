const express = require('express'); 
const bodyParser = require('body-parser'); 
const cors = require('cors');
const mongoose = require('mongoose'); 
const app = express(); 
app.use(cors()); 
app.use(bodyParser.json()); 
const port = 5000; 
const dbUri = 'mongodb://localhost/todolist'
const dbConfig = {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
}; 

mongoose.connect(dbUri, dbConfig); 

const db = mongoose.connection; 

db.on('error', (err) => {
  console.error("Error connecting to MongoDB", err); 
})

db.once('open', () => {
  console.log("Connected to MongoDB"); 
}); 

db.on("disconnected", () => {
  console.log('Disconnected from MongoDB'); 
})

const taskSchema = new mongoose.Schema({
  title: String, 
  description: String, 
  completed: Boolean,
}); 

const Task = mongoose.model('Task', taskSchema); 

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find(); 
  res.json(tasks)
})

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body); 
  await task.save(); 
  res.json({
    message: "Task updated successfully",
  }); 
}); 

app.put('/tasks/:taskId', async (req,res) => {
  const { taskId } = req.params; 
  await Task.findByIdAndUpdate(taskId, req.body); 
  res.json({
    message: "Task updated successfully", 
  }); 
}); 

app.delete('/tasks/:taskId', async (req,res) => {
  const { taskId } = req.params; 
  await Task.findByIdAndRemove(taskId); 
  res.json({
    message: "Task deleted successfully", 
  }); 
}); 

app.listen(port, () => {
  console.log(`Server listen on port ${port}`)
})
