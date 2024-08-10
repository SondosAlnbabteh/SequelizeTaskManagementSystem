// const express = require('express');
const bcrypt = require('bcryptjs'); 
const express = require("express");
const db = require('./models');
const cors = require('cors');
const bodyParser = require('body-parser'); // Move this to the top
const jwt = require('jsonwebtoken');
const app = express();
const port = 3004;
app.use(express.json());

app.use(cors());
app.use(bodyParser.json()); // Use bodyParser after requiring it
// Test the connection
db.sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));

// Sync the models
db.sequelize
  .sync({ force: false })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Unable to sync the database:", err));


/*************************************** */
// CRUD Routes
app.post('/users', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Check if the email already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await db.User.create({
      email,
      password: hashedPassword, // Pass hashedPassword as password
      username,
    });

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
/****************************************** */


/**************************** */
// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await db.User.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(401).json({ message: 'Email not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: existingUser.id }, 'wesam123456789', { expiresIn: '1h' });
    res.json({ token, userId: existingUser.id });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


/****************************** */
/***************************** */
app.post('/tasks', async (req, res) => {
  try {
    // محاولة إنشاء مهمة جديدة
    const task = await db.Task.create(req.body);
    res.json(task);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      // إذا كان الخطأ هو خطأ قيود الفريدة (مثلاً: تكرار الحقول الفريدة)
      res.status(400).json({ error: 'A task with similar details already exists' });
    } else if (error.name === 'SequelizeValidationError') {
      // إذا كان الخطأ هو خطأ التحقق من الصحة (مثل: إدخال بيانات غير صحيحة)
      res.status(400).json({ error: 'Validation error: ' + error.errors.map(err => err.message).join(', ') });
    } else {
      // معالجة الأخطاء العامة
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

/***************************** { where: { IsDeleted: false } }*/
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await db.Task.findAll({ where: { IsDeleted: false } });
    console.log(tasks);
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/******************************* */
// Add this endpoint in your server
app.post('/validate-token', (req, res) => {
  const token = req.body.token;
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, 'wesam123456789');
    res.json({ userId: decoded.id });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});
/*************************** */
// Route to soft delete a task by updating IsDeleted to true
app.put('/tasksdelete/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Find the task by ID
    const task = await db.Task.findByPk(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Update the IsDeleted field to true
    task.IsDeleted = true;
    await task.save();
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/************************ */
// Route to update a task by ID
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    // Find the task by ID
    const task = await db.Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update the task details
    task.title = title;
    task.content = content;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/************************ */
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
