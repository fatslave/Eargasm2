function loadVideo(playerUrl, autoplay) {
	// Lets Flash from another domain call JavaScript
  var params = { allowScriptAccess: "always" };
  // The element id of the Flash embed
  var atts = { id: "myytPlayer" };
  // All of the magic handled by SWFObject (http://code.google.com/p/swfobject/)

  swfobject.embedSWF(
      playerUrl + 'enablejsapi=1&version=3&playerapiid=ytplayer&autoplay=' + 
      (autoplay?1:0), 'ytplayer', '200', '200', '9.0.0', false, 
      false, {allowfullscreen: 'false'}); //ytplayer is the object id - remember u dumbo!!
	  
	  // to make operations use js function using myytplayer.function()
	 
}

var playerUrl='';
var search = "";
var bannedVideos = [];
var videos = new Array();

function is_blocked (video) {
  var blocked = false;

  if (video.author[0].name.$t.toLowerCase().search('vevo') >= 0) blocked = true;
  if (typeof video.app$control !== "undefined" && video.app$control.yt$state.$t == "Syndication of this video was restricted by the content owner.") blocked = true;
  if (typeof video.app$control !== "undefined" && video.app$control.yt$state.$t == "Syndication of this video was restricted by its owner.") blocked = true;

  return blocked;
}

function is_music (video) {
  var music = true;

  if (video.media$group.media$category[0].$t != "Music") music = false;

  return music;
}


function is_cover_or_remix (video) {
  var cover_or_remix = false;

  if (video.title.$t.toLowerCase().search("cover") != -1 || video.title.$t.toLowerCase().search("remix") != -1 || video.title.$t.toLowerCase().search("alternate") != -1) cover_or_remix = true;

  return cover_or_remix;
}

function is_live (video) {
  var live_video = false;

  if (search.toLowerCase().search("live") > -1) return live_video;

  if (video.title.$t.toLowerCase().search("live") > -1 || video.title.$t.toLowerCase().search("@") > -1 || video.title.$t.toLowerCase().search("19") > -1 || video.title.$t.toLowerCase().search("200") > -1) live_video = true;

  if (!live_video) {
    $.each(video.category, function () {
      if (this.term.toLowerCase() == "live") live_video = true;
    });
  }

  return live_video
}

function is_not_banned (video_id) {
  var video_banned = true;

  $.each(bannedVideos, function () {
    if (this == video_id) video_banned = false;
  });

  return video_banned;
}



function dothis(data)	{
  
  var obj = getUtilityObj();
  var artist = obj.artist;
  var track = obj.track;
  
  
  var feed= data.feed; //bullshit json format .. see firebug if any problem arises
  var entries = feed.entry || [];
  var html = ['<ul>'];
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var embeddable = false;
    // verify if the video is embeddable or not
    if(!embeddable && !is_blocked(entry) && is_music(entry) )
    {
		embeddable = true;
		
		//find the link :) yay ..
		for (var k = 0; k < entry.link.length; ++k) {
		  if (entry.link[k].rel == "alternate") {
			alturl = entry.link[k].href; 
			break;
		  }
		}
		var title = artist+ "-" +track;
		
		if (is_live(entry))
		{
			title = title + ' [live version]';
		}
			
		if(is_cover_or_remix(entry))
		{
			title = entry.title.$t;
		}
		
		// use this link for a chromeless player :P
		var thumbnailUrl = entries[i].media$group.media$thumbnail[0].url;
		var playerUrl = entries[i].media$group.media$content[0].url;
				
		var local = '<li>';
		local = local + '<a class="addToPlaylist" artist="'+artist+'" track="'+track+'" mp3link="'+playerUrl+'" title="'+title+'" href="#">&nbsp;</a>';
		local = local + '<a class="shareSongFb" artist="'+artist+'" track="'+track+'" videoId="'+ getIdfromlink(playerUrl)+'" title="'+title+'" href="#">&nbsp;</a>';
		local = local + '<a link="'+playerUrl+'" artist="'+artist+'" track="'+track+'" id="1" class="play" href="#">&nbsp;</a>';
		local = local + '<p>'+title+'</p></li>';
		
		html.push(local);
                            
	}
  }
  html.push('</ul>');
  document.getElementById('videos').innerHTML = html.join(''); 
    if ($(".TopArtists").is(':visible')){
                $("#videos").css({'top':'50%', 'height':'35%'});
    }
	
	
 /* 
  $('.addToPlaylist').css('background','url(../images/add.png)');
  $('.addToPlaylist').css('float','right');
  $('.addToPlaylist').css({'width':'22px', 'height':'22px'});
  */
  $("#videos").fadeIn("slow");

}


function searchOrg(artist, track) {

  var scriptElement = document.createElement("script");
  scriptElement.setAttribute("id", "jsonScript");
  scriptElement.setAttribute("src", "http://gdata.youtube.com/feeds/api/videos?"+"q="+ 
      escape(artist+" "+track) + "&v=2&alt=json-in-script&callback=dothis&format=5&orderby=relevance");
  scriptElement.setAttribute("type", "text/javascript");
  
  document.documentElement.firstChild.appendChild(scriptElement);
  setPlayVar(artist,track);
};

function findOnePlaylist(artist,track){

  var title;
  var my_url = "http://gdata.youtube.com/feeds/api/videos?"+"q="+
      escape(artist+" "+track) + "&v=2&alt=json&format=5&restriction=89.90.72.181";

  $.ajax({
					'url' : my_url,
					'dataType' : 'json',
					success: function(data){
							  var feed= data.feed;
							  var entries = feed.entry || [];
							  playerUrl = '';
							 for (var i = 0; i < entries.length; i++) {
								var entry = entries[i];
								var embeddable = false;
								// verify if the video is embeddable or not
								if(!embeddable && !is_blocked(entry) && is_music(entry) && !is_cover_or_remix(entry) && !is_live(entry) )
								{
									embeddable = true;
									var entry = entries[i];
									// get title and URL
									//title = entry.title.$t;
									playerUrl = entry.media$group.media$content[0].url;
                                    //console.log(playerUrl);
									break;
								}
							}
							
							
							//if no results were found, include cover and remixes
							if (playerUrl==''){
								for (var i = 0; i < entries.length; i++) {
								var entry = entries[i];
								var embeddable = false;
								// verify if the video is embeddable or not
								if(!embeddable && !is_blocked(entry) && is_music(entry))
								{
									embeddable = true;
									var entry = entries[i];
									// get title and URL
									//title = entry.title.$t;
									playerUrl = entry.media$group.media$content[0].url;
                                    //console.log(playerUrl);
									break;
								}
							}							
							}

								title = artist+"-"+	track;

								////console.log(title)
								var myobj = {'name':artist, 'trackSearched':track, 'tracks':title,'link':playerUrl};
								var jsonString = JSON.stringify(myobj);
								localStorage.setItem(localStorage.length-1,jsonString);
							 // //console.log(number);

					}

	});
   // return playerUrl;

}


function findOneVideo(artist,track){
  $('#PlaylistStartup').hide();
  var title;
  var my_url = "http://gdata.youtube.com/feeds/api/videos?"+"q="+
      escape(artist+" "+track) + "&v=2&alt=json&format=5&restriction=89.90.72.181";

    if ($(".TopArtists").is(':visible')) {
        $("#videos").css({'top':'50%', 'height':'35%'});
    }
  

  $.ajax({
					'url' : my_url,
					'dataType' : 'json',
					success: function(data){
							  var feed= data.feed;
							  var entries = feed.entry || [];
							  playerUrl='';
							 for (var i = 0; i < entries.length; i++) {
								var entry = entries[i];
								var embeddable = false;
								// verify if the video is embeddable or not
								if(!embeddable && !is_blocked(entry) && is_music(entry) && !is_cover_or_remix(entry) && !is_live(entry))
								{
									embeddable = true;
									var entry = entries[i];
									// get title and URL
									//title = entry.title.$t;
									playerUrl = entry.media$group.media$content[0].url;
                                    //console.log(playerUrl);
									break;
								}
							}
							
							//if no results were found, include cover and remixes
							if (playerUrl==''){
								for (var i = 0; i < entries.length; i++) {
								var entry = entries[i];
								var embeddable = false;
								// verify if the video is embeddable or not
								if(!embeddable && !is_blocked(entry) && is_music(entry))
								{
									embeddable = true;
									var entry = entries[i];
									// get title and URL
									//title = entry.title.$t;
									playerUrl = entry.media$group.media$content[0].url;
                                    //console.log(playerUrl);
									break;
								}
							}							
							}

                            var title = artist+"-"+	track;
                            var local = '<ul><li>';
							local = local + '<a class="addToPlaylist" artist="'+artist+'" track="'+track+'" mp3link="'+playerUrl+'" title="'+title+'" href="#">&nbsp;</a>';
							local = local + '<a class="shareSongFb" artist="'+artist+'" track="'+track+'" videoId="'+ getIdfromlink(playerUrl)+'" title="'+title+'" href="#">&nbsp;</a>';
							local = local + '<a link="'+playerUrl+'" artist="'+artist+'" track="'+track+'" id="1" class="play" href="#">&nbsp;</a>';
                            local = local + '<p>'+title+'</p></li></ul>';
                            $("#videos").append(local);

					}
					
	});
   // return playerUrl;
}


