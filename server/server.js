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

let port = '8080';
app.listen(port, e => console.log('Listening to port: ' + port));