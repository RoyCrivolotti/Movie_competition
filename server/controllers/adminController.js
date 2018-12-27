const connection = require('../lib/dbconnection');

function createCompetition(req, res) {
    if (req.body.nombre == '') return res.status(422).send('You must enter a valid name for the competition.');

    if (req.body.genero == 0 && req.body.director == 0 && req.body.actor == 0) {
        return res.status(422).send('You must enter at least one criteria for the competition.');
    }

    let paramID = param => {
        if (param == 0) return 'NULL';
        else return param;
    }

    let valueOrNull = param => { // In the last 'AND NOT EXISTS', if the value is 'NULL' it's compared with 'IS NULL', if it's a number it's compared with the equals operator...
        if (param == 0) return `IS NULL`;
        else return ` = ${param} `;
    }

    if (!queryParamExists(req.body.nombre)) return;

    let query = ` INSERT INTO competencias (nombre, genero_id, director_id, actor_id)
    SELECT * FROM (SELECT '${req.body.nombre}' AS col1, ${paramID(req.body.genero)} AS col2, ${paramID(req.body.director)} AS col3, ${paramID(req.body.actor)} AS col4) AS \`values\`
    WHERE NOT EXISTS
        (SELECT * FROM competencias WHERE nombre like '${req.body.nombre}')
    AND NOT EXISTS
        (SELECT * FROM competencias WHERE genero_id ${valueOrNull(req.body.genero)} AND director_id ${valueOrNull(req.body.director)} AND actor_id ${valueOrNull(req.body.actor)})
    LIMIT 1; `;

    console.log(query);

    connection.query(query, (error, response) => {
        if (error) {
            console.log(`The query encountered an issue: ${error.message}`);
            return res.status(500).send(`The query encountered an issue: ${error.message}`);
        }

        if (response.length < 2) return res.status(422).send(`There were not enough movie options for this competition –minimum is two...`);

        res.json(response);
    });
}

function editCompetitionName(req, res) { //req.body.nombre
    if (!/\S/.test(req.body.nombre)) return;

    let query = ` UPDATE competencias SET nombre = '${req.body.nombre}' WHERE id = ${req.params.id}; `;

    connection.query(query, (error, response) => {
        if (error) {
            console.log(`The query encountered an issue: ${error.message}`);
            return res.status(500).send(`There was an issue: ${error.message}`);
        }

        if (response.affectedRows == 0) return res.status(422).send(`Nothing was modified, there might be a problem with the request.`);
        return res.status(200).send(`The name of the competition with ID ${req.params.id} was successfully modified.`);
    });
}

// This function is a bit long, but I couldn't find a simpler way of returning not only the competition name, but also director name, actor name and genre name, considering a dinamically constructed query that takes into account null vs non-null values
function getCompetition(req, res) { // req.params.id
    let query = ` SELECT * FROM competencias WHERE id = ${req.params.id} `;
    let notNullValueFound = false;

    connection.query(query, (error, response) => {
        if (error) {
            console.log(`The query encountered an issue: ${error.message}`);
            return res.status(500).send(`There was an issue: ${error.message}`);
        }

        if (response.length == 0) return res.status(404).send(`There were no results for this competition ID.`);

        let fields = [{
                'table': 'genero',
                'alias': 'genero_nombre',
                'join': 'genero_id',
                'id': response[0].genero_id
            },
            {
                'table': 'director',
                'alias': 'director_nombre',
                'join': 'director_id',
                'id': response[0].director_id
            },
            {
                'table': 'actor',
                'alias': 'actor_nombre',
                'join': 'actor_id',
                'id': response[0].actor_id
            }
        ];

        for (let i = 0; i < fields.length; i++) {
            if (fields[i].id == null) {
                fields.splice(i, 1);
                i--;
            }
        }

        query = ` SELECT `;

        fields.forEach(fieldObj => {
            if (notNullValueFound == false) notNullValueFound = true;
            else query += `, `

            query += `${fieldObj.table}.nombre AS ${fieldObj.alias}`;
        });

        notNullValueFound = false;
        query += ` FROM competencias AS c `

        fields.forEach(fieldObj => query += ` JOIN ${fieldObj.table} ON c.${fieldObj.join} = ${fieldObj.table}.id `);

        query += ` WHERE c.id = ${req.params.id};`;

        connection.query(query, (error, response_) => {
            console.log(query);
            if (error) {
                console.log(`The query encountered an issue: ${error.message}`);
                return res.status(500).send(`The query encountered an issue: ${error.message}`);
            }

            if (response_.length == 0) return res.status(422).send(`There was an issue with the request: no criteria was found for this competition.`);

            res.json({
                'nombre': response[0].nombre,
                'genero_nombre': response_[0].genero_nombre || '',
                'director_nombre': response_[0].director_nombre || '',
                'actor_nombre': response_[0].actor_nombre || ''
            });
        });
    });
}

function resetCompetition(req, res) {
    let query = ` DELETE FROM competencias_votos WHERE competencia_id = ${req.params.id}; `;

    connection.query(query, (error, response) => {
        if (error) {
            console.log(`The query encountered an issue: ${error.message}`);
            return res.status(500).send(`There was an issue: ${error.message}`);
        }

        if (response.affectedRows == 0) return res.status(200).send(`The request was properly processed, but there were no votes to reset!`);
        return res.status(200).send(`The votes for the competition with ID ${req.params.id} were successfully reseted.`);
    });
}

function deleteCompetition(req, res) {
    // This query has one vulnerability: it depends on the fact that the rest of the code doesn't allow for there to be votes on a competition that doesn't exist: it doesn't check for that!
    let query = ` DELETE c, cv FROM competencias AS c LEFT JOIN competencias_votos AS cv ON c.id = cv.competencia_id WHERE c.id = ${req.params.id} `;

    connection.query(query, (error, response) => {
        if (error) {
            console.log(`The query encountered an issue: ${error.message}`);
            return res.status(500).send(`There was an issue: ${error.message}`);
        }

        if (response.affectedRows == 0) return res.status(422).send(`The competition was not properly deleted!`);
        res.status(200).send(`The competition with ID ${req.params.id} was successfully deleted, along with its votes.`);
    });
}

function queryParamExists(value) {
    return value != undefined && isStringNotEmpty(value);
}

function isStringNotEmpty(value) {
    if (typeof value != 'string') return true;
    return value.trim().length > 0;
}

module.exports = {
    createCompetition: createCompetition,
    getCompetition: getCompetition,
    resetCompetition: resetCompetition,
    deleteCompetition: deleteCompetition,
    editCompetitionName: editCompetitionName
}