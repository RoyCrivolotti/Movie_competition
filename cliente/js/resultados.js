$(function () {
	let idCompetencia = getQueryParam('id');
	let competitionsController = new CompetitionsController();
	competitionsController.getResults(idCompetencia);
});