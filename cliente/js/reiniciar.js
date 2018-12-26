$(function () {
	let idCompetition = getQueryParam('id');

	let competitionsController = new CompetitionsController();
	competitionsController.getCompetition(idCompetition)

	$('#formCompetencia').ajaxForm({
		url: `${server}/competitions/${idCompetition}/votes`,
		type: 'delete',
		success: res => window.location.replace('./index.html?exito=True'),
		error: (response, status, xhr) => $('#mensajeDeError').text(response.responseText)
	});

	// If the user cancels, it redirects to index.html
	$('.cancelar').click(() => window.location.replace('./index.html'));
});