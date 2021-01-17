const express = require('express')
const router = express.Router()
const {creatDept, getDepts, updateDept, deleteDept} = require('./dept-crud')

router.post('/', creatDept)
        .get('/', getDepts)
        .put('/', updateDept)
        .delete('/:id', deleteDept)


module.exports = router