const express = require('express')
const router = express.Router()
const {createTeam, getTeams, updateTeam, deleteTeam} = require('./team-crud')

router.post('/', createTeam)
        .get('/', getTeams)
        .put('/', updateTeam)
        .delete('/:id', deleteTeam)


module.exports = router