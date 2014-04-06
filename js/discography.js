//discography
//find artist
function findArt(artist)	{
	var my_key ='jodgudlastaumkringinghefna';
	var my_url = 'http://api.bandcamp.com/api/band/3/search?key=jodgudlastaumkringinghefna&name='+escape(artist)+'&callback=?';


	$.ajax({
		'url': my_url,
		'type': "GET",
		'dataType': 'jsonp',
		success: function(res) {
			var bandId = res.results[0].band_id;
			console.log(bandId);
		}
	});

}
//find discography
function findDisco(bandId)	{
	var my_key ='jodgudlastaumkringinghefna';
	var my_url = 'http://api.bandcamp.com/api/band/3/discography?key=jodgudlastaumkringinghefna&band_id='+bandId+'&callback=?';

	$.ajax({
		'url': my_url,
		'type': "GET",
		'dataType': 'jsonp',
		success: function(res) {
			var bandId = res.results[0].band_id;
			console.log(bandId);
		}
	});		

}


