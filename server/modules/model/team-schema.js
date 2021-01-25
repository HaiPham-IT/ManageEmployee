const mongoose = require('mongoose')

const team = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    project_name: {
        type: String,
        unique: true,
        required: true
    },
    manage_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    dept: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dept'
    }
})

module.exports = mongoose.model('Team', team)