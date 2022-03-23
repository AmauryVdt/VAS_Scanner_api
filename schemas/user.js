const mongoose = require('mongoose');

const user = mongoose.Schema({
    uuid : String,
    login : String,
    password : String,
})

module.exports = mongoose.model('user', user);
