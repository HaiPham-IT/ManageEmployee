const Employee = require('../model/employee-schema')
const Info = require('../model/employee-info-schema')
const Team = require('../model/team-schema')
const camelCase = require('camelcase')
const crypto = require('../crypto') 

const defaultEmp = async (req, res, next) => {
    try {
        let emp = {}
        emp.username = 'pdhai'
        emp.password = crypto.encrypt('123456')
        let oldEmp = await Employee.findOne({username: emp.username})
        if(!oldEmp) await new Employee(emp).save()
        next()
    } catch (error) {
        next(error)
    }
}

const createEmployee = async (req, res, next) => {
    try {
        let employee = req.body
        let info = await createEmployeeInfo(employee.info)
        employee.info = info._id
        employee.username = info.emp_code + '@TBV.com.vn'
        employee.password = crypto.encrypt(employee.password)
        employee = await new Employee(employee).save()
        delete employee.password

        return res.status(200).json({employee})
    } catch (error) {
        await Info.deleteOne({_id: info._id})
        next(error)
    }
}

const getEmployees = (req, res, next) => {
    return Employee.find().populate('info')
    .then(result => res.status(200).json(result))
    .catch(() => [])
}

const updateEmployee = async (req, res, next) => {
    try {
        let employee = req.body
        delete employee.username
        delete employee.password

        let empdb = await Employee.findById({_id: req.query.id})
        if(employee.info){
            await modifyInfo(empdb.info._id, employee.info)
        }

        return res.status(200).json({message: 'Modify successfull'})
    } catch (error) {
        next(error)
    }
    
}

const deleteEmployee = async (req, res, next) => {
    try {
        let emp = await Employee.findById({_id: req.params.id})
        if(!emp) throw new Error(`Employee not found`)
        await Info.deleteOne({_id: emp.info._id})
        await Employee.deleteOne({_id: req.id})

        return res.status(200).json({message: 'Delete successfull'})
    } catch (error) {
        next(error)
    }
}

const createEmployeeInfo = (info) => {
    return new Promise((resolve, reject) => {
        return Info.findOne({emp_code: info.emp_code})
            .then(rs => rs ? reject(new Error(`Employee [emp_code=${info.emp_code}] already exist`)) : createEmpCode(info.fullname))
            .then(rs => {
                info.emp_code = rs
                return new Info(info).save()
            })
            .then(rs => resolve(rs))
            .catch(err => reject(err))
    })
}

const createEmpCode = (fullname) => {
    return Info.find({fullname: fullname})
        .then(rs => {
            if(rs.length > 0){
                return Promise.resolve(camelCase(fullname, {pascalCase: true})+rs.length)
            }
            return Promise.resolve(camelCase(fullname, {pascalCase: true}))
        })
        .catch(err => Promise.reject(err))
}

const modifyInfo = (id, info) => {
    if(info.emp_code) delete info.emp_code
    return Info.updateOne({_id: id},{$set: info})
        .then(rs => Promise.resolve('ok'))
        .catch(err => Promise.reject(err))
}

module.exports = {createEmployee, getEmployees, updateEmployee, deleteEmployee, defaultEmp}