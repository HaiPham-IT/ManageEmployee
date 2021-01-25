const mongoose = require('mongoose')

const employee = new mongoose.Schema({
    username: {
        type: String,
        requied: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    info: {
        fullname: {
            type: String,
            require: true
        },
        phone: {
            type: String
        },
        cmnd: {
            type: String,
            requied: true
        },
        img: {
            type: String
        }
        
    },
    role: {
        type: String,
        requied: true
    },
    emp_code: {
        type: String,
        require: true
    },
    team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'team'
    }]
})

module.exports = mongoose.model('Employee', employee)