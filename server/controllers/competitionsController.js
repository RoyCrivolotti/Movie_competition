const connection = require('../lib/dbconnection');

function getCompetitions(req, res) {
    let query = `SELECT * FROM competencias`;

    connection.query(query, (error, response) => {
        console.log(`Query: ${query}`);

        if (error) {
            console.log(`The query encountered an issue: ${error.message}`);
            return res.status(404).send(`The query encountered an issue: ${error.message}`);
        }

        res.send(JSON.stringify(response));
    });
}

function getOptions(req, res) {
    let compQuery = `SELECT * FROM competencias WHERE id = ${req.params.id}`;

    connection.query(compQuery, (error, response) => {
        if (error || response.length < 1) {
            console.log(response[0]);
            console.log(`The query encountered an issue: ${error.message}`);
            return res.status(404).send(`The query encountered an issue: ${error.message}`);
        }

        // I use this kind of objects to build queries, so that if tomorrow a new filter is added, I'll probably just have to edit this object
        let mainParams = {
            'genre': {
                'value': [response[0].genero_id],
                'query': ` JOIN genero ON genero.id = pelicula.genero_id `,
                'condition': ` genero.id = ${response[0].genero_id} `
            },
            'director': {
                'value': [response[0].director_id],
                'query': ` JOIN director_pelicula dp ON dp.pelicula_id = pelicula.id `,
                'condition': ` dp.director_id = ${response[0].director_id} `
            },
            'actor': {
                'value': [response[0].actor_id],
                'query': ` JOIN actor_pelicula ap ON ap.pelicula_id = pelicula.id `,
                'condition': ` ap.actor_id = ${response[0].actor_id} `
            }
        }

        let query = queryBuilder(mainParams);
        console.log(query);

        connection.query(query, (error_, response_) => {
            if (error_ || response_.length < 2) {
                console.log(`The query encountered an issue: ${error_.message}`);
                return res.status(404).send(`The query encountered an issue: ${error_.message}`);
            }

            res.send(JSON.stringify({
                'competition': response[0].nombre,
                'movies': response_
            }));
        });
    });
}

function vote(req, res) {
    console.log(req.params);
    console.log(req.body);

    let query = ` CALL update_or_insert_vote(${req.params.competitionID}, ${req.body.movieID}) `;

    connection.query(query, (error, response) => {
        if (error) {
            console.log(`The query encountered an issue: ${error.message}`);
            return res.status(404).send(`The query encountered an issue: ${error.message}`);
        }

        res.json(response);
    });
}

function getResults(req, res) {
    console.log(req.params.id); // Competition id

    let query = ` SELECT * FROM competencias_votos cv JOIN pelicula p ON p.id = cv.pelicula_id WHERE cv.competencia_id = ${req.params.id} ORDER BY votos DESC LIMIT 3; `;

    connection.query(query, (error, response) => {
        if (error) {
            console.log(`The query encountered an issue: ${error.message}`);
            return res.status(404).send(`The query encountered an issue: ${error.message}`);
        }

        if (response.length == 0) console.log('There were no matches, hence this there was an empty response :S');

        res.json(response);
    });

}

function queryBuilder(mainParams) {
    let query = ` SELECT pelicula.* FROM pelicula `,
        queryLength = 0;

    // For every valid/defined filter (actor/director/genre), join the necessary tables
    Object.keys(mainParams).map(key => {
        if (mainParams[key].value.every(queryParamExists)) {
            queryLength++;
            query += mainParams[key].query;
        }
    });

    query += ` WHERE `; // There is always at least one condition

    // Again, I loop through the object to add the conditions
    Object.keys(mainParams).map(key => {
        if (mainParams[key].value.every(queryParamExists)) {
            query += mainParams[key].condition;
            queryLength--;
            if (queryLength > 0) query += ` AND `;
        }
    });

    query += ` ORDER BY RAND() LIMIT 2 `;

    return query;
}

function queryParamExists(value) {
    return value != undefined && isStringNotEmpty(value);
}

function isStringNotEmpty(value) {
    if (typeof value != 'string') return true;
    return value.trim().length > 0;
}

module.exports = {
    getCompetitions: getCompetitions,
    getOptions: getOptions,
    vote: vote,
    getResults: getResults
}