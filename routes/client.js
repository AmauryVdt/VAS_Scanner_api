const express = require('express')
const router = express.Router()
const Client = require('../schemas/client')
const { uuidv4 } = require('uuidv4');
const utils = require("./utils");

router.get('/', (request, response) => {

    //Check authentication
    utils.logUser(request, response)
        .catch(err => { return response.status(404).json({ message: 'Internal Server Error.' }) })

    Client.find({}, (err, client) => {
        if (err) return response.status(401).json({ message: 'Error. Can\'t find client' })
        console.log(client)
        return response.status(200).json(client)
    })
})

router.get('/:clientID', (request, response) => {

    //Check authentication
    utils.logUser(request, response)
        .catch(err => { return response.status(404).json({ message: 'Internal Server Error.' }) })

    Client.findOne({ uuid: request.params.clientID }).then(client => response.send(client))
})

router.post('/', (request, response) => {

    //Check authentication
    utils.logUser(request, response)
        .catch(err => { return response.status(404).json({ message: 'Internal Server Error.' }) })

    // Get data
    const uuid =            uuidv4()
    const last_name =       request.body.last_name
    const first_name =      request.body.first_name
    const phone_number =    request.body.phone_number
    const email =           request.body.email
    const place_number =    request.body.place_number
    const scan_count =      request.body.scan_count

    // Missing data
    if (!last_name || !first_name || !phone_number || !email || !place_number || !scan_count) {
        return response.status(400).json({ message: 'Error wrong data. Please enter the correct data' })
    }

    // Create object
    const new_client = new Client({
        uuid:           uuid,
        last_name:      last_name,
        first_name:     first_name,
        phone_number:   phone_number,
        email:          email,
        place_number:   place_number,
        scan_count:     scan_count,
    });

    // Save in the DataBase
    new_client.save()
        .then(client => {
            response.status(201).json({ message: 'The client has been successfully created' })
        })
        .catch(err => {
            response.status(400).json({ message: 'Error. Can\'t save the client in the data base ' })
        })
})

router.post('/scan/:clientID', async (request, response) => {

    //Check authentication
    utils.logUser(request, response)
        .catch(err => { return response.status(404).json({ message: 'Internal Server Error.' }) })

    // Find the client
    let current_client
    try {
        current_client = await Client.findOne({ uuid: request.params.clientID})
        if (!current_client) return response.status(401).json({ message: 'Error. Can\'t find client' })
    }
    catch (err) {
        return response.status(401).json({ message: 'Error. Can\'t find client' })
    }

    // Update the client & save
    current_client.scan_count += 1;
    await current_client.save();

    // Return response
    await response.status(200).json({ message: "The client has bee updated", client: current_client })
})

module.exports = router