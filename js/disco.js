function getDisco(artist) {
	var lastfm = new LastFM({
		apiKey    : '6572dfc58ea6579033dfa2fcc1280422',
		apiSecret : '50ac009bb3c27911f366f0f533b667e0'
		//cache     : cache
	});
	
	lastfm.artist.getTopAlbums({artist:artist, limit:15},{
					success: function(res1){
						//get songs
						$("#lyrics").css("height","40%");
						$("#discolist").show();
						$("#discolist").empty();
						var local='<ul>';
						var length = res1.topalbums.album.length;
						for(var i=0;i<length;i++) {
							var album=res1.topalbums.album[i].name;
							local+='<li link="'+album+'" name="'+artist+'">'+album+'</li>';
						}
						$("#discolist").append(local+'</ul>');
						
					},
					error: function(code, message){
						}
			});
	
	//setTimeout(function(){	$("#videos").append("</ul>"); },2000);
}

function getAlbumTracks(album,artist) {
	$("#videos").empty();
	lastfm.album.getInfo({artist:artist, album:album},{
					success: function(res1){
						//get songs
						var len = res1.album.tracks.track.length;
						console.log("abc")
						for(var i=0;i<len;i++) {
							var track=res1.album.tracks.track[i].name;
							findOneVideo(artist,track);
							//console.log(track);
							
						}
					}
			});
	

}



function getPopular() {

	var lastfm = new LastFM({
		apiKey    : '6572dfc58ea6579033dfa2fcc1280422',
		apiSecret : '50ac009bb3c27911f366f0f533b667e0'
		//cache     : cache
	});
	
	lastfm.chart.getHypedTracks({},{
					complete: function(res1){
						//get songs
						var len = res1.tracks.track.length;
						console.log("abc")
						for(var i=0;i<len;i++) {
							var track=res1.tracks.track[i].name;
							var artist=res1.tracks.track[i].artist.name
							findOnePlaylist(artist,track);
							console.log(track);
							
						}
					}
			});
			
}