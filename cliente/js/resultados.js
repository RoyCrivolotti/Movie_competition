/* global getQueryParam, CompetitionsController */
$(() => {
	const idCompetencia = getQueryParam('id');
	const competitionsController = new CompetitionsController();
	competitionsController.getResults(idCompetencia);
});
