const Employee = require('../model/employee-schema')
const Team = require('../model/team-schema')
const camelCase = require('camelcase')
const crypto = require('../crypto') 

const modifyEmployee = (req, res, next) => {
  try {
    let employee = req.body
    delete employee.username
    delete employee.Team

    let emp = await Employee.findById(req.query.id)
    if(!emp) throw new Error(`Employee [id=${req.query.id}] not found`)

    await Employee.updateOne({_id: req.query.id}, {$set: employee})
    res.status(200).json({message: 'Modify successfull'})
  } catch (error) {
    next(error) 
  }
}

const deleteEmployee = (req, res, next) => {
  return Employee.deleteOne({_id: req.params.id})
    .then(() => res.status(204).json({message: 'Delete successfull'}))
    .catch(err => next(err))
}

module.exports = {modifyEmployee, deleteEmployee}