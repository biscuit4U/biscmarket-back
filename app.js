const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors')
require('dotenv').config({ path: __dirname + "/.env" })
console.log(process.env.HOST)

app.use(cors({
    origin: process.env.HOST
}))
app.get('/', (req, res) => {

})

app.listen(8000)