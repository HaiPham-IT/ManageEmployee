const Dept = require('../model/dept-schema')
const Employee = require('../model/employee-schema')
const Info = require('../model/employee-info-schema')
const Team = require('../model/team-schema')

const creatDept = async (req, res, next) => {
  try {
    let dept = req.body
    const isExistDeptName = await Dept.findOne({name: dept.name})
    if(isExistDeptName) throw new Error(`Departmance [name=${dept.name}] already exist`)
    if(dept.managed_by){
      let info = await Info.findOne({emp_code: dept.managed_by})
      if(!info) throw new Error(`Employee [emp_code=${dept.managed_by}] does not exist`)
      let emp = await Employee.findOne({info: info._id})
      dept.managed_by = emp._id
    }
    dept = await new Dept(dept).save()

    return res.status(200).json(dept)
  } catch (error) {
    next(error)
  }
}

const getDepts = (req, res, next) => {
  return Dept.find().populate('team', 'managed_by')
    .then(rs => res.status(200).json(rs))
    .catch(err => next(err))
}

const getTeam = (project_name) => {
  return Team.findOne({project_name: project_name})
    .then(rs => rs ? Promise.resolve(rs._id) : Promise.reject(new Error(`Team [project_name=${project_name}] not found`)))
    .catch(error => Promise.reject(error))
}

const updateDept = async (req, res, next) => {
  try {
    let dept = req.body
    if(dept.name){
      const isExistDeptName = await Dept.findOne({name: dept.name})
      if(isExistDeptName) throw new Error(`Departmance [name=${dept.name}] already exist`)
    }
    if(dept.managed_by){
      let info = await Info.findOne({emp_code: dept.managed_by})
      if(!info) throw new Error(`Employee [emp_code=${dept.managed_by}] does not exist`)
      let emp = await Employee.findOne({info: info._id})
      dept.managed_by = emp._id
    }
    await Dept.updateOne({_id: req.query.id}, {$set: dept})

    return res.status(200).json({message: 'Modify successfull'})

  } catch (error) {
    next(error)
  }
}

const deleteDept = (req, res, next) => {
  return Team.find({dept: req.params.id})
    .then(rs => (rs.length > 0) ? Promise.reject(new Error(`Please move list Team to other Department before delete this Department`)) : Dept.deleteOne({_id: req.params.id}))
    .then(rs => res.status(200).json({massage: 'Delete successfull'}))
    .catch(err => next(err))
}

module.exports = {creatDept, getDepts, updateDept, deleteDept}