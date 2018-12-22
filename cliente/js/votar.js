$(function () {
	let competitionID = getQueryParam('id'); // Using helper function from helpers.js

	let competitionsController = new CompetitionsController();
	competitionsController.getOptions(competitionID);

	$('.pelicula').click(function () {
		let movieID = $(this).find('.idPelicula').val(); // Getting movie ID
		console.log(`competitionID: ${competitionID}, movieID: ${movieID}`);
		competitionsController.vote(competitionID, movieID);
	});
});