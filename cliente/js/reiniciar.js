$(function () {
	let competitionID = getQueryParam('id');

	let competitionsController = new CompetitionsController();
	competitionsController.getCompetition(competitionID)

	$('#formCompetencia').ajaxForm({
		url: `${server}/competitions/${competitionID}/votes`,
		type: 'delete',
		success: res => window.location.replace('./index.html?exito=True'),
		error: (response, status, xhr) => $('#mensajeDeError').text(response.responseText)
	});

	// If the user cancels, it redirects to index.html
	$('.cancelar').click(() => window.location.replace('./index.html'));
});