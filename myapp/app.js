const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./openapi.json');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

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

// POST /tasks — create a new task
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: "Title is required and cannot be empty" });
  }

  const nextId = tasks.length > 0
    ? Math.max(...tasks.map(t => t.id)) + 1
    : 1;

  const newTask = {
    id: nextId,
    title: title.trim(),
    done: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id — update a task's title and/or done
app.put('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }

  const { title, done } = req.body;

  // Body must supply at least one valid field to update
  const hasTitle = title !== undefined;
  const hasDone = done !== undefined;

  if (!hasTitle && !hasDone) {
    return res.status(400).json({ error: "Request body must include title and/or done" });
  }

  if (hasTitle) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: "Title must be a non-empty string" });
    }
    task.title = title.trim();
  }

  if (hasDone) {
    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: "Done must be a boolean" });
    }
    task.done = done;
  }

  res.json(task);
});

// DELETE /tasks/:id — remove a task
app.delete('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});