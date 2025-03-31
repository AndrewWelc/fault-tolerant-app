const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/tasks', (req, res) => {
  console.log('Task received:', req.body);
  res.status(201).json({ message: 'Task received', taskId: req.body.taskId });
});

app.get('/tasks', (req, res) => {
  res.json([]);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Port:  http://localhost:${PORT}`);
});
