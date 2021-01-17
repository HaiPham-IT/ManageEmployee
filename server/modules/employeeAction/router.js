const express = require('express')
const router = express.Router()
const {createEmployee, getEmployees, updateEmployee, deleteEmployee} = require('./employee-crud')

router.post('/', createEmployee)
        .get('/', getEmployees)
        .put('/', updateEmployee)
        .delete('/:id', deleteEmployee)


module.exports = router