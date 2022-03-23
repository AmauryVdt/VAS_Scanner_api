const express = require('express')
const mongoose = require('mongoose')
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')

const utilsRouter = require('./routes/utils')
const clientRouter = require('./routes/client')
const userRouter = require('./routes/user')

require('dotenv').config()

app.use(bodyParser())
app.use(cors({origin: true}));

const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT || 5000

// Connection to the database
mongoose.connect(MONGO_URI)
    .then((result) => app.listen(PORT, _ => {console.log(`Server is running in http://localhost:${PORT}`)}))
    .catch((err) => console.log(Error))

app.use(express.json())
app.use('/client', clientRouter)
app.use('/user', userRouter)

module.exports = app;

