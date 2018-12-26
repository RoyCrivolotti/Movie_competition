const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const controller = require('./controllers/competitionsController');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/competitions', controller.getCompetitions);
app.get('/competitions/:id/movies', controller.getOptions);
app.post('/competitions/:competitionID/vote', controller.vote);
app.get('/competitions/:id/results', controller.getResults);
app.get('/genres', controller.getGenres);
app.get('/directors', controller.getDirectors);
app.get('/actors', controller.getActors);
app.post('/competitions', controller.createCompetition);
app.get('/competitions/:id', controller.getCompetition);
app.delete('competitions/:id/votes', controller.deleteCompetition);

// `${server}/competitions/${idCompetition}/votes`

let port = '8080';
app.listen(port, e => console.log('Listening to port: ' + port));