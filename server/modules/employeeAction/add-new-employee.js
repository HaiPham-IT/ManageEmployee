const Employee = require('../model/employee-schema')
const Team = require('../model/team-schema')
const camelCase = require('camelcase')
const crypto = require('../crypto') 

const createEmployee = async (req, res, next) => {
    try {
        let employee = req.body
        checkMissingField(employee.username, 'username')
        checkMissingField(employee.password, 'password')
        checkMissingField(employee.role, 'Role')
        checkMissingField(employee.emp_code, 'emp_code')
        checkMissingField(employee.info.fullname, 'Fullname')
        checkMissingField(employee.info.cmnd, 'cmnd')

        employee = await new Employee(employee).save()
        return res.status(200).json(employee)
    } catch (error) {
        next(error)
    }
}

const checkMissingField = (param, name) => {
    if(param === null || param === '' || param === undefined){
        throw new Error(`${name} is required`)
    }
}