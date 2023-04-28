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

// handle get for webpage traversing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/sindex.html'));
})
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
})


// handle get for api
app.get('/api', (req, res) => {
    res.status(200).json(`Please use /notes route`);
})

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request recieved`)
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if(err) console.error(err);
        else{
            console.info('200: Succesful GET');
            res.status(200).json(JSON.parse(data));
        }
    })
})

app.get('/api/notes/:id', (req, res) => {
    res.status(200).json(`${req.method} request recieved for note id ${req.params.id}`)
})

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request recieved`);
    const {title, text} = req.body;
    const newNote = {
        title: title,
        text: text,
        id: crypto.randomUUID()
    }
    if(title && text){
        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if(err) console.error(err);
            else{
                const parsed = JSON.parse(data);
                parsed.push(newNote);
                const updated = JSON.stringify(parsed, null, "\t");
                fs.writeFile('./db/db.json', updated, (err) => {
                    err ? console.error(err) : console.info(`Succesfully added new note entitled ${title}`);
                })
            }
        });
        const response = {
            status: 'success',
            body: newNote,
        };
        console.info('201: Succesful POST');
        console.log(response);
        res.status(201).json(response);
    }
    else{
        console.error('500: Missing title or text param on POST')
        res.status(500).json('Error in posting review');
    }
})

app.post('/api/notes/:id', (req, res) => {
    res.json(`${req.method} request recieved for note id ${req.params.id}`);
})

app.delete('/api/notes/:id', (req, res) => {
    res.status(200).json(`${req.method} request recieved for note id ${req.params.id}`)
})

app.listen(PORT, () => {
    console.info(`${__filename} listening on port ${PORT}`);
})
