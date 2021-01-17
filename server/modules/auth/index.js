const token = require('./token')

const login = async (req, res, next) => {
    try {
        const {username, password} = req.body
        let data = await token.getToken(username, password)
        res.status(200).json(data) 
    } catch (error) {
        next(error)
    }
}

const verify = async (req, res, next) => {
    try {
        let employee = await token.verifyToken(req.headers)
        req.emp = employee
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {login, verify}