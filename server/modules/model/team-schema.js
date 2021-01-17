const mongoose = require('mongoose')

const team = new mongoose.Schema({
    project_name: {
        type: String,
        unique: true,
        required: true
    },
    manage_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    member: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    dept: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dept'
    }
})

module.exports = mongoose.model('Team', team)