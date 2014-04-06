function getMusix(artist, song) {
	var my_url = 'http://api.musixmatch.com/ws/1.1/track.search?apikey=ad447f4745e7621e3f71f514f7147eba&q_track='+escape(song)+'&q_artist='+escape(artist)+'&format=jsonp&callback=?';
	//http://api.musixmatch.com/ws/1.1/track.search?apikey=ad447f4745e7621e3f71f514f7147eba&q_track=enter%20sandman&q_artist=metallica&format=jsonp&callback=?

	$.ajax({
		'url': my_url,
		'type': "GET",
		'dataType': "jsonp",
		success: function(res){
			$('#lyrics').show();
			var an= $(res).find("track_id").first().text()
			
			$('#lyrics').append(an);
		}
	});

};

 function parsexml(xml) {
				
				// console.log("mukul")
				// console.log("mukul")
				// console.log("mukul")
				// console.log("mukul")
				// console.log("mukul")
				// console.log("mukul")
				// var songID = $(xml).find("track_id").first().text();
				// console.log(songID)
				//console.log(xml)
			//return songID;
};