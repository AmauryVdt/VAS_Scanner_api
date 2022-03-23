const jwt = require('jsonwebtoken')
const accessTokenSecret = 'wtfunsuperaccesstokenincroyable';
const user = require('../schemas/user')

const logUser = async (request, response) => {

    if (!request.headers.authorization)
        return response.status(401).json({message: "Unauthorized request"});

    try {
        let decoded  = jwt.verify(request.headers.authorization, accessTokenSecret);
        user.exists({ uuid: decoded.uuid }).catch(err => {
            return response.status(401).json({message: "Unauthorized request"});
        })
    }
    catch (err) {
        return response.status(401).json({message: "Unauthorized request"});
    }
}
module.exports.logUser = logUser;


