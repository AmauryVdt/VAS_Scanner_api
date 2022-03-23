const mongoose = require('mongoose');

const client = mongoose.Schema({
    uuid : String,
    last_name : String,
    first_name : String,
    phone_number : String,
    email : String,
    place_number : Number,
    scan_count : Number,
})

module.exports = mongoose.model('client', client);
