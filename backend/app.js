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

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏢 EMS API is live and running',
    version: 'v2.0',
    developer: 'Prajesh Singh Meena',
    endpoints: {
      signup: '/api/auth/signup',
      login: '/api/auth/login',
      employees: '/api/employees'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.use(errorMiddleware);

module.exports = app;