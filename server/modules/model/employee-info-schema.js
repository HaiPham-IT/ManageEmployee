const mongoose = require('mongoose')

const info = new mongoose.Schema({
    fullname: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true
    },
    phone: {
        type: String
    },
    emp_code: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Info', info)