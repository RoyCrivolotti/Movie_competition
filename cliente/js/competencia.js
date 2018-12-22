let server = 'http://0.0.0.0:8080';

function CompetitionsController() {

	// Loads all existing competitions
	this.getCompetitions = function () {
			let self = this;

			// Gets the list of competitions from the API
			$.getJSON(`${server}/competitions`, data => {
				// Loading in the DOM the data retrieved
				console.log(`data: ${JSON.stringify(data)}`);
				self.loadCompetitions(data);
			});
		},

		this.loadCompetitions = function (data) {
			// data (JSON): list of competitions retrieved from the API
			$('.competenciaPlantilla').hide();
			let idColor = 1;
			let idColorGrow = true;
			console.log(data);

			data.forEach((element, index) => {
				let divCompetition = $('.competenciaPlantilla').clone().removeClass('competenciaPlantilla');

				// Adding the corresponding competition ID to the links in 'Ver resultados'
				$(divCompetition).find('.link').each(function () {
					$(this).attr('href', $(this).attr('href') + element.id);
				});

				$(divCompetition).find('.titulo').text(element.nombre);
				$(divCompetition).find('.card').addClass('color' + idColor);

				if (idColorGrow) idColor++;
				else idColor--;

				if (idColor > 4 || idColor < 1) {
					idColor = idColorGrow ? 4 : 1;
					idColorGrow = !idColorGrow;
				}

				// Adding the dynamically generated div to the DOM, inside the div with the class 'competencias'
				$('.competencias').append(divCompetition);
				$(divCompetition).show();
			});
		},

		// Gets and loads the data/details regarding a competition, given its ID
		this.getCompetition = function (id) {
			let self = this;
			// Loads in the DOM the data retrieved
			let opciones = $.getJSON(`${server}/competitions/${id}`, data => self.loadCompetition(id, data));
		},

		this.loadCompetition = function (id, data) {
			// 'data' is the info regarding a competition retrieved from the AIP (JSON)
			$('.nombre').text(data.nombre);
			$('.nombre').val(data.nombre);
			$('.genero').text(data.genero_nombre);
			$('.actor').text(data.actor_nombre);
			$('.director').text(data.director_nombre);
		},

		// Gets and loads the voting option (movies)
		this.getOptions = function (id) {
			let self = this; // reference to CompetitionsController);
			let options = $.getJSON(`${server}/competitions/${id}/movies`, data => {
				// console.log(data);
				self.loadOptions(id, data); // The options are loaded in the DOM
			});
		},

		this.loadOptions = function (id, options) {
			$('#nombreCompetencia').text(options.competition); // Loading the competition name/page title

			console.log(options);

			options.movies.forEach((movie, index) => {
				let optionDiv = '#opcion' + (index + 1); // Selecting the div with the option to be loaded
				console.log(movie.id);
				$(`${optionDiv} .idPelicula`).val(movie.id); // Loading the current movie's ID
				$(`${optionDiv} .poster`).attr('src', movie.poster); // Loading the current movie's poster
				$(`${optionDiv} .titulo`).text(movie.titulo); // Loading the current movie's title
			});
		},

		// Sends the selected vote in a competition
		this.vote = function (competitionID, movieID) {
			// Data object to be sent in the body of the POST request to the API
			let data = {
				'movieID': movieID
			};

			$.post(`${server}/competitions/${competitionID}/vote`, data, response => {
				// Redirecting the user to the competition's results
				window.location.replace(`resultados.html?id=${competitionID}`);
			}, 'json');
		},

		// Gets the existing movie genres and loads them in the DOM
		this.loadGenres = function () {
			$.getJSON(`${server}/genres`, data => {
				$('#genero').empty(); // Emptying the element containing the genres
				$('#genero').append(`<option value='0'>Todos</option>`); // Marking all genres as not-selected

				data.forEach(element => {
					$('#genero').append(`<option value="${element.id}">${element.nombre}</option>`);
				});
			});
		},

		// Gets the existing directors and loads them in the DOM
		this.loadDirectors = function () {
			$.getJSON(`${server}/directors`, data => {
				$('#director').empty();
				$('#director').append(`<option value='0'>Todos/as</option>`);

				data.forEach(element => {
					$('#director').append(`<option value="${element.id}">${element.nombre}</option>`);
				});
			});
		},

		// Gets the existing actors and loads them in the DOM
		this.loadActors = function () {
			$.getJSON(`${server}/actors`, data => {
				$('#actor').empty();
				$('#actor').append(`<option value='0'>Todos/as</option>`);

				data.forEach(element => {
					$('#actor').append(`<option value="${element.id}">${element.nombre}</option>`);
				});
			});
		},

		// Gets and loads in the DOM a competition's results, given its ID
		this.getResults = function (id) {
			let self = this;
			let options = $.getJSON(`${server}/competitions/${id}/results`, data => {
				self.loadResults(id, data);
			});
		},

		this.loadResults = function (id, data) {
			$('#nombreCompetencia').text(data.competencia); // Loads the name of the competition/title

			console.log(data);

			data.forEach((element, index) => {
				// Selecting the div where the current result is to be loaded
				let resultDiv = `#puesto${index+1}`;
				$(`${resultDiv} .idPelicula`).val(element.pelicula_id); // Loading the movie ID
				$(`${resultDiv} .poster`).attr('src', element.poster); // Loading the movie poster
				$(`${resultDiv} .titulo`).text(element.titulo); // Loading the movie title

				// Loading the amount of votes the movie got
				let votoOVotos = (element.votos > 1) ? 'VOTOS' : 'VOTO';
				$(`${resultDiv} .votos`).text(`${element.votos} ${votoOVotos}`);
			});
		}
};