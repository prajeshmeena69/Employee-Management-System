const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
} = require('../controllers/employeeController');

router.use(protect);

router.get('/search', searchEmployees);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', addEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;