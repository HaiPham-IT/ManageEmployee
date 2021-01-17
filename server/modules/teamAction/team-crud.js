const Team = require('../model/team-schema')
const Employee = require('../model/employee-schema')
const Dept = require('../model/dept-schema')
const Info = require('../model/employee-info-schema')

const mandory = (param = 'parameter') => {
  throw new Error(`${param} is required`)
}

const getTeams = (req, res, next) => {
  return Team.find().populate(['manage_by', 'member', 'dept'])
    .then(rs => res.status(200).json(rs))
    .catch(err => next(err))
}

const createTeam = async (req, res, next) => {
  const readBody = async (team) => {
    try {
      let isExistProjectName = await checkProjectName(team.project_name)
      if(isExistProjectName === 'exist') throw new Error(`Team [project_name=${team.project_name}] already exist`)

      team.manage_by = await getEmp(team.manage_by)
      if(team.member){
        team.member = Array.isArray(team.member) ? team.member : [team.member]
        team.member = await Promise.all(team.member.map(getEmp))
      }
      if(team.dept){
        let dep = await Dept.findOne({name: team.dept})
        if(!dep) throw new Error(`Department [name=${team.dept}] does not exist`)
        team.dept = dep._id
      }

      return team
    } catch (error) {
      throw error
    }
  }
  try {
    let team = req.body
    team = await readBody(team)
    team = await new Team(team).save()

    return res.status(200).json(team)
  } catch (error) {
    next(error)
  }
}

const checkProjectName = (project_name = mandory('project_name')) => {
  return Team.findOne({project_name: project_name})
    .then(rs => rs ? Promise.resolve('exist') : Promise.resolve('none'))
    .catch(err => Promise.reject(err))
}

const getEmp = (emp_code) => {
  return Info.findOne({emp_code: emp_code})
    .then(rs => rs ? Employee.findOne({info: rs._id}) : Promise.reject(new Error(`Employee [emp_code=${emp_code}] does not exist`)))
    .then(rs => Promise.resolve(rs._id))
    .catch(err => Promise.reject(err))
}

const updateTeam = async (req, res, next) => {
  try {
    let team = req.body
    delete team.project_name
    delete team._id
    if(team.manage_by){
      team.manage_by = await getEmp(team.manage_by)
    }
    if(team.member){
      team.member = Array.isArray(team.member) ? team.member : [team.member]
      team.member = await Promise.all(team.member.map(getEmp))
    }
    if(team.dept){
      let dep = await Dept.findOne({name: team.dept})
      if(!dep) throw new Error(`Department [name=${team.dept}] does not exist`)
      team.dept = dep._id
    }

    team = await Team.updateOne({_id: req.query.id}, {$set: team})

    return res.status(200).json({message: 'Modify successfull'})
  } catch (error) {
    next(error)
  }
}

const deleteTeam = (req, res, next) => {
  return Team.deleteOne({_id: req.params.id})
    .then(() => res.status(200).json({message: 'Delete successfull'}))
    .catch(error => next(error))
}

module.exports = {createTeam, getTeams, updateTeam, deleteTeam}