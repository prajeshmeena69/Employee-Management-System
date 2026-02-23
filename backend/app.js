const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.use(errorMiddleware);

module.exports = app;