const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/competitions', userController.getCompetitions);
app.get('/competitions/:id/movies', userController.getOptions);
app.post('/competitions/:id/vote', userController.vote);
app.get('/competitions/:id/results', userController.getResults);
app.get('/genres', userController.getGenres);
app.get('/directors', userController.getDirectors);
app.get('/actors', userController.getActors);
app.post('/competitions', adminController.createCompetition);
app.put('/competitions/:id', adminController.editCompetitionName);
app.get('/competitions/:id', adminController.getCompetition);
app.delete('/competitions/:id/votes', adminController.resetCompetition);
app.delete('/competitions/:id', adminController.deleteCompetition);

let port = '8080';
app.listen(port, e => console.log('Listening to port: ' + port));