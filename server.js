// require some utils to use later
const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
const crypto = require('crypto');

// set up port and application back-end
const PORT = process.env.PORT || 3001
const app = express();

// set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// handle get for webpage traversing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
})


// handle get for api
app.get('/api', (req, res) => {
    res.status(200).json(`Please use /notes route`);
})

// handle get for all notes
app.get('/api/notes', (req, res) => {
    // verify that the request was recieved
    console.info(`${req.method} request recieved`)
    // read the database
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        // if there was an error reading the database, respond 500 and log
        if(err){
            console.error('500: Could not read database');
            console.error(err);
            res.sendStatus(500)
        }
        // otherwise respond 200 with the JSON of the database and log
        else{
            console.info('200: Succesful GET');
            res.status(200).json(JSON.parse(data));
        }
    })
})
// get specific notes by id is not implmented so respond 501
app.get('/api/notes/:id', (req, res) => {
    console.error(`501: ${req.method} not implmented for /api/notes/:id`);
    res.sendStatus(501)
})
// handle posting a new note
app.post('/api/notes', (req, res) => {
    // verify that the request was recieved
    console.info(`${req.method} request recieved`);
    // extract title and text via deconstruciton of the request body
    const {title, text} = req.body;
    // construct the new note with the title and text from above and a unique id
    const newNote = {
        title: title,
        text: text,
        id: crypto.randomUUID()
    }
    // check that title and text were passed in, otherwise this request was handled incorreclty
    if(title && text){
        // read the database
        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            // if there was an error, respond 500 and log it
            if(err){
                console.error('500: Error reading database');
                console.error(err);
                res.sendStatus(500);
            }
            // otherwise
            else{
                // parse the data
                const parsed = JSON.parse(data);
                // add the new note to this parsed data
                parsed.push(newNote);
                // stringify this updated data and format it to be readable
                const updated = JSON.stringify(parsed, null, "\t");
                // write to this
                fs.writeFile('./db/db.json', updated, (err) => {
                    // if there was an error, respond 500 and log it
                    if(err){
                        console.error('500: Error writing to database');
                        console.error(err)
                        res.sendStatus(500);
                    // otherwise log a succesful write
                    }else console.info(`Succesfully added new note entitled ${title}`);
                })
            }
        });
        // construct a response object
        const response = {
            status: 'success',
            body: newNote,
        };
        // log a sucessful POSt, respond 201, and send the json of the response
        console.info('201: Succesful POST');
        console.log(response);
        res.status(201).json(response);
    }
    // if title and text aren't defined, respond 500 and log it
    else{
        console.error('500: Missing title or text param on POST')
        res.status(500).json('Error in posting review');
    }
})
// editing notes via POST with an id is not implmented so respond 501
app.put('/api/notes/:id', (req, res) => {
    console.error(`501: ${req.method} not implmented for /api/notes/:id`);
    res.sendStatus(501)
})
// handle deleting a specific note
app.delete('/api/notes/:id', (req, res) => {
    // verify the request was recieved
    console.info(`${req.method} request recieved for id ${req.params.id}`)
    // read the database
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        // if there was an error, respond 500 and log it
        if(err){
            console.error('500: Could not read database');
            console.error(err);
            res.sendStatus(500);
        // otherwise
        }else{
            // will hold our altered data
            let altered = [];
            // will hold the data of the selected note
            let thisNote;
            // parse the data from database and loop over every note
            JSON.parse(data).forEach(note => {
                // if we find the note specified, store it in thisNote
                if(note['id'] === req.params.id){
                    console.info(`Note id "${note['id']}" found`);
                    thisNote = note;
                // otherwise, we add each note to the altered data
                }else altered.push(note);
            });
            // if we found the specified data
            if(thisNote){
                // write to database
                fs.writeFile('./db/db.json', JSON.stringify(altered, null, "\t"), 'utf-8', (err) => {
                    // if there was an error respond 500 and log it
                    if(err){
                        console.error('500: Error writing to db')
                        console.error(err);
                        res.sendStatus(500);
                    }
                    // otherwise confirm we deleted the note and respond 202
                    else{
                        console.info(`202: Note id "${thisNote['id']}" deleted`);
                        res.sendStatus(202);
                    }
                })
            }
            // if we didn't find the specified data, respond 406 and log it
            else{
                console.error('406: ID not found')
                res.sendStatus(406);
            }
        }
    })
})

app.listen(PORT, () => {
    console.info(`${__filename} listening on port ${PORT}`);
})
