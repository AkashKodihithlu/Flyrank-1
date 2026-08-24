const express = require('express');
const app = express();
const port = 3000;

// In-memory "database"
let tasks = [
  { id: 1, title: "Learn Express basics", done: true },
  { id: 2, title: "Build Task API", done: false },
  { id: 3, title: "Write tests", done: false }
];

app.get('/', (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"]
  });
});

app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

// GET /tasks — return the whole list
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// GET /tasks/:id — return one task, or 404 if not found
app.get('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }

  res.json(task);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});