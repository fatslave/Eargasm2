function verify()	{
		var art = $("#artist").val();
		var tra = $("#track").val();
		//var cache = new LastFMCache();
		
		var lastfm = new LastFM({
			apiKey    : '6572dfc58ea6579033dfa2fcc1280422',
			apiSecret : '50ac009bb3c27911f366f0f533b667e0'
			//cache     : cache
		});

		// case 1 : verify artist
	
		/*if (art!="") {
			// get artist and spell correct 
			lastfm.artist.getInfo({artist: art, autocorrect:1},{
					success: function(result){
							data.artist.value = result.artist.name;
								}, 
					error: function(code, message){
					// do stuff
						}
			});
		}*/
		
		if (art!="" && tra!="") {
			var error=0;
			lastfm.track.getCorrection({track: tra, artist:art},{
					success: function(res1){
						if(res1.corrections.correction!= "")	 {
							if(res1.corrections.correction.@attr.artistcorrected=="1" || res1.corrections.correction.@attr.trackcorrected=="1") {
								$("#artist").val(res1.corrections.correction.track.artist.name);
								$("#track").val(res1.corrections.correction.track.name);
								error=1;
							}
						}
						
						if (!res1.corrections.correction){ error=2;}
						
					},
					error: function(code, message){
						}
			});

			
			//get track info
			lastfm.track.getInfo({track: tra, artist:art},{
					success: function(res){
						},
					error: function(code,message){
						}
			});
		}

		// verify song track and add artist if the artist is not specified in the first place
		 
			lastfm.track.search({track: tra},{
					success: function(res){
						if(art=="")	{
							$("#artist").val(res.results.trackmatches.track[0].artist);
							$("#track").val(res.results.trackmatches.track[0].name);

							}
					if (art!=0 || error==2)	{
							$("#artist").val(res.results.trackmatches.track[0].artist);
						}
						}, 
					error: function(code, message){
					// do stuff
						}
			}); 
}
