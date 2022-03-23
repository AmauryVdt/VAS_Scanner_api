const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const accessTokenSecret = 'wtfunsuperaccesstokenincroyable';
const user = require('../schemas/user')
const utils = require('./utils')

router.post('/login', async (request, response) => {

    // Missing data
    if (!request.body.login || !request.body.password) {
        return response.status(400).json({ message: 'Error. Please enter the correct login and password' })
    }

    // Get data
    const { login, password } = request.body

    // Find the user
    user.findOne({ login: login, password: password }, (err, result) => {
        // Error
        if (err) return response.status(404).json({ message: 'Error. The server was unable to find what was requested' })

        // User don't have access or doesn't exist
        if (!result) return response.status(401).json({ message: 'Error. Wrong login or password' })

        // Creat the JWT
        const token = jwt.sign({
            uuid: result.uuid,
            login: result.login,
            },
            accessTokenSecret
        )

        // Return JWT
        return response.status(200).json({ access_token: token, result: result })
    })
})

// router.get('/:userID', (request, response) => {
//
//     //Check authentication
//     utils.logUser(request, response)
//         .catch(err => { return response.status(404).json({ message: 'Internal Server Error.' }) })
//
//     // console.log(request.params.userID)
//     user.findOne({ uuid: request.params.userID }).then(user => response.send(user)).catch(err => response.send(err))
// })


module.exports = router