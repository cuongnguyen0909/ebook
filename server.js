const express = require('express');
const { dbConnect } = require('./config/dbConnect');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const initialRoute = require('./routes');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const port = 4000;

app.use(
    cors({
        origin: 'http://localhost:4200', // allow to server to accept request from different origin
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true, // allow session cookie from browser to pass through
    }),
);
const imagePath = path.join(__dirname, 'images');
const ebookPath = path.join(__dirname, 'ebooks');

app.use('/images', express.static(imagePath));
app.get('/images/:imageName', (req, res) => {
    res.sendFile(path.join(imagePath, req.params.imageName));
    return res
});

app.use('/ebooks', express.static(ebookPath));
app.get('/ebooks/:ebookName', (req, res) => {
    res.sendFile(path.join(imagePath, req.params.imageName));
});

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));

app.use(bodyParser.json({ limit: "50mb" }));


app.use(express.urlencoded({ extended: true, limit: "50mb" }));

dbConnect();


initialRoute(app);
app.listen(port, () => {
    console.log('Server is running on port ' + port + '...');
})