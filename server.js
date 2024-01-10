const express = require('express');
const { dbConnect } = require('./config/dbConnect');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const initialRoute = require('./routes');
const app = express();
const bodyParser = require('body-parser');

const port = 3000;

app.use(cookieParser());
app.use(express.json());

app.use(bodyParser.json());

app.use(
    cors({
        origin: 'http://localhost:4200', // allow to server to accept request from different origin
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true, // allow session cookie from browser to pass through
    }),
);

app.use(express.urlencoded({ extended: true }));

dbConnect();

initialRoute(app);

app.listen(port, () => {
    console.log('Server is running on port ' + port + '...');
})