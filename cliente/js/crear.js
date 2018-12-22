$(function () {
	let competitionsController = new CompetitionsController();

	competitionsController.loadGenres();
	competitionsController.loadDirectors();
	competitionsController.loadActors();

	// When the form is sent, a POST is needed
	$('#formCompetencia').ajaxForm({
		url: `${server}/competitions`,
		type: 'post',
		// Success
		success: function (res) {
			window.location.replace('./index.html?exito=True');
		},
		// Validation errors
		error: (response, status, xhr) => {
			if (response.status == 422) {
				$('#mensajeDeError').text(response.responseText);
			}
		}
	});

	$('.cancelar').click(() => window.location.replace('./index.html'));
});