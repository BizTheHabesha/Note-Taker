const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
const crypto = require('crypto');

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// handle get for homepage
app.get('/', (req, res) => {
    res.status(200).json(`${req.method} request recieved`);
})

app.get('/notes', (req, res) => {
    res.status(200).json(`${req.method} request recieved`)
})

app.get('/notes/:note_id', (req, res) => {
    res.status(200).json(`${req.method} request recieved for note id ${req.params.note_id}`)
})

app.post('/notes', (req, res) => {
    res.status(200).json(`${req.method} request recieved`)
})

app.post('/notes/:note_id', (req, res) => {
    res.status(200).json(`${req.method} request recieved for note id ${req.params.note_id}`)
})

app.delete('/notes/:note_id', (req, res) => {
    res.status(200).json(`${req.method} request recieved for note id ${req.params.note_id}`)
})

app.listen(PORT, () => {
    console.info(`${__filename} listening on port ${PORT}`);
})
