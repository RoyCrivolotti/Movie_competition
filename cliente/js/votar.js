/* global getQueryParam, CompetitionsController */
$(() => {
	const competitionID = getQueryParam('id'); // Using helper function from helpers.js

	const competitionsController = new CompetitionsController();
	competitionsController.getOptions(competitionID);

	$('.pelicula').click(function () {
		const movieID = $(this).find('.idPelicula').val(); // Getting movie ID
		console.log(`competitionID: ${competitionID}, movieID: ${movieID}`);
		competitionsController.vote(competitionID, movieID);
	});
});
