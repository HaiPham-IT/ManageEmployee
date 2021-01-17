const config = require('./config')
const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerDocs = require('./modules/swagger/docs.json')
const mongoose = require('mongoose')
const dbInfo = require('./connection')

app.use(bodyparser.json())
app.use(cors())

//swagger
app.use('/rest-api',require('./modules/employeeAction/employee-crud').defaultEmp)
app.use('/rest-api', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Connect db
mongoose.connect(dbInfo.getUrlConnection(), {useNewUrlParser: true, useUnifiedTopology: true})

//Route
app.use('/api/v1/login', require('./modules/auth').login)
app.use('/api/v2', require('./modules/auth').verify)
app.use('/api/v2/team', require('./modules/teamAction').router)
app.use('/api/v2/employee', require('./modules/employeeAction').router)
app.use('/api/v2/dept', require('./modules/deptAction').router)

//error handle
app.use((err, req, res, next) => {
    console.log('handle error')
    return res.status(err.statusCode||500).json({message: err.message})
})

//listen port
app.listen(config.port.http || 3000, ()=> {
    console.log(`Listen in port ${config.port.http || 3000}`)
    console.log(`localhost:${config.port.http || 3000}/rest-api`)
})
