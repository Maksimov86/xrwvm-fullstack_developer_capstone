/* jshint esversion: 8 */

const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3050;

app.use(cors());
app.use(express.urlencoded({ extended: false }));

const carsData = JSON.parse(fs.readFileSync('car_records.json', 'utf8'));

mongoose.connect('mongodb://mongo_db:27017/', { dbName: 'dealershipsDB' })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


const Cars = require('./inventory');

try {
    Cars.deleteMany({}).then(() => {
        Cars.insertMany(carsData.cars);
    });
} catch (error) {
    console.error(error);
}

app.get('/', async (req, res) => {
    res.send('Welcome to the Mongoose API');
});


app.get('/cars/:id', async (req, res) => {
    try {
        const documents = await Cars.find({dealer_id: req.params.id});
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reviews' });
    }
});

