const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/todolist', { useNewUrlParser: true, useUnifiedTopology: true });

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

app.put('/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  await Task.findByIdAndUpdate(taskId, req.body);
  res.json({ message: 'Task updated successfully' });
});

app.delete('/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  await Task.findByIdAndRemove(taskId);
  res.json({ message: 'Task deleted successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
