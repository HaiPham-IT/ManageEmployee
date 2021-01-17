const config = require('../../config')
const jwt = require('jsonwebtoken')
const crypto = require('../crypto')
const Employee = require('../model/employee-schema')

const mandory = (parm = 'Parameter') => {
    createErr(`${parm} is required`, 400)
}

const getToken = async (username = mandory('username'), password = mandory('password')) => {
    try {
        const emp = await Employee.findOne({username: username}).populate('info')
        if(!emp || !crypto.matches(password, emp.password)){
            throw new Error(`Invalid username and password`)
        }
        delete emp._doc.password
        const payload = {
            id: emp._id,
            username: emp.username
        }
        const token = jwt.sign(payload, config.jwt.secrectKey, {algorithm: config.jwt.algorithm, expiresIn: config.jwt.expiresInMinutes*60})
        return {employee: emp, token: `Bear ${token}`}
    } catch (error) {
        throw error
    }
}

const verifyToken = async (headers = mandory('headers')) => {
    try {
        let payload = await isValidToken(headers.authorization)
        let checkUser = await Employee.findOne({username: payload.username}).populate('info')
        if(!checkUser){
            throw new Error('Token is invalid')
        }
        return checkUser
    } catch (error) {
        throw error
    }
}

const isValidToken = (authorization) => {
    const readAuthorization = (authorization) => {
        return new Promise((resolve, reject) => {
            if(!authorization || !authorization.trim()){
                return reject(new Error('Missing Authorization'))
            }
            let part = authorization.split(' ')
            if(String(part[0]) === 'Bear' && authorization.substring(5)){
                return resolve(authorization.substring(5).trim())
            }
            return reject(new Error('Wrong Authorization'))
        })
    }
    const decodeToken = (token) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, config.jwt.secrectKey, {algorithms: config.jwt.algorithm}, (err, decode) => {
                if(err) return reject(err)
                return resolve(decode)
            })
        })
    }

    return readAuthorization(authorization)
        .then(token => decodeToken(token))
        .then(payload => Promise.resolve(payload))
        .catch(err => Promise.reject(err))
}

module.exports = {getToken, verifyToken}