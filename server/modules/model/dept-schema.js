const mongoose = require('mongoose')

const dept = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    managed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }
})

module.exports = mongoose.model('Dept', dept)