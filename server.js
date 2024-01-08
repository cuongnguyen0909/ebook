const express = require('express');
const { dbConnect } = require('./config/dbConnect');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const initialRoute = require('./routes');
const app = express();

const port = process.env.PORT || 7000;

app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

dbConnect();

initialRoute(app);

app.listen(port, () => {
    console.log('Server is running on port ' + port + '...');
})