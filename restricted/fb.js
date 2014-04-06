
function facebook (playlistId) {
  FB.ui({
      method: 'stream.publish',
      attachment: {
        name: "Give some pleasure to your ears!",
        href: "http://eargasm.xtreemhost.com/#playlist/" + playlistId,
        description: ("Eargasm (Beta) is the new way to experience music !! Enjoy the playlist"),
      },
      display: 'popup'
    },
    function (response) {
    }
  );
  return false;
}



function share_video_facebook (artist, track , videoId) {
  FB.ui({
      method: 'stream.publish',
      attachment: {
        name: artist+ '-'+ track + ", brought to you by Eargasm!",
        href: "http://eargasm.xtreemhost.com/#" + videoId + '/' + artist + '/' + track,
        description: ("Eargasm (Beta) is the new way to experience music !! Enjoy the song")
      },
      display: 'popup'
    },
    function (response) {
    }
  );
  return false;
}

function videoTicker(artist, track , videoId)
{
	var url = 'http://eargasm.xtreemhost.com/index.php&propa='+escape(artist)+'&propb='+escape(track)+'&propc='+videoId+'?title='+ escape(artist) + '-' + escape(track);
	//console.log(url);
	FB.api(
		'/me/fatslave:catch&music='+ url ,'post',  function(response) {
			if (!response || response.error) {	
			    alert('Error occured');
			  } else {
			    console.log('Post was successful! Action ID: ' + response.id);
			  }
		});
}


function doRedirect(){
	if(window.location.href.search('fb_action_ids')){
	
	var actionID = window.location.href.split('=')[1].split('&')[0];
		// do redirect	
	
	//console.log(actionID);
	
	var url = 'https://graph.facebook.com/'+ actionID + '?access_token=' + FB._authResponse.accessToken;
	$.ajax({
		url:url,
		type:'GET',
		dataType:'json',
		success:function (res) {
            //console.log(responseJson);
			var videoId=res.data.propc;
			var artist= res.data.propa;
			var track=res.data.propb;
			//window.location.href = 'http://eargasm.xtreemhost.com/#' +videoId+ '/'+artist+'/'+track;
			
			setPlayVar(artist, track, IdToLink(videoId));
			addthistoplaylist(artist, track, IdToLink(videoId));
			localStorage.setItem("currentSong",localStorage.length-2);
			getTopArtists();
			
			$.jGrowl('Push Play to play ur song');
        } 
	});
	
  }
}