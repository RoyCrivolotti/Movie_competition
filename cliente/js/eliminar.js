/* global server, CompetitionsController, getQueryParam */
$(() => {
	// Get the ID from the URL using the function in helpers.js
	const competitionID = getQueryParam('id');

	const competitionsController = new CompetitionsController();
	competitionsController.getCompetition(competitionID);

	$('#formCompetencia').ajaxForm({
		url: `${server}/competitions/${competitionID}`,
		type: 'delete',
		success: res => window.location.replace('./index.html?exito=True'),
		error: (response, status, xhr) => $('#mensajeDeError').text(response.responseText),
	});

	// If the user cancels, it redirects to index.html
	$('.cancelar').click(() => window.location.replace('./index.html'));
});
