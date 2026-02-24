const Employee = require('../models/employeeModel');

// POST /api/employees
const addEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create({
      ...req.body,
      companyId: req.company._id,
    });
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// GET /api/employees
const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find({ companyId: req.company._id }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    next(error);
  }
};

// GET /api/employees/:id
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      companyId: req.company._id,
    });
    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// PUT /api/employees/:id
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id, companyId: req.company._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/employees/:id
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOneAndDelete({
      _id: req.params.id,
      companyId: req.company._id,
    });
    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }
    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// GET /api/employees/search?name=xyz
const searchEmployees = async (req, res, next) => {
  try {
    const { name, department } = req.query;
    let query = { companyId: req.company._id };

    if (name) query.fullName = { $regex: name, $options: 'i' };
    if (department) query.department = { $regex: department, $options: 'i' };

    const employees = await Employee.find(query);
    res.status(200).json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
};