var timeoutid;

// Update a particular HTML element with a new value
function updateHTML(elmId, value) {
document.getElementById(elmId).innerHTML = value;
}

// This function is called when an error is thrown by the player
function onPlayerError(errorCode) {

	if (errorCode==100) {  // find error code !! 
		$.jGrowl("Initial Loading .. completed"); 
		}
	else{
		$.jGrowl("An error occured of type:" + errorCode);
	}
}

// This function is called when the player changes state
function onPlayerStateChange(newState) {
	if (newState==0) {
		//$.jGrowl("in the loop");
		var cs = getCurrentSong();
		var obj = getUtilityObj();


        if(obj.repeat!="1"){
			changeCurrentSong(cs+1);
			playPlaylist();
		}
		if(obj.repeat=="1"){ 
			//changeCurrentSong(cs);
			//1. find url : obj.url
			//2. play url
			playVideo(obj.url);
		}

}
}

// Display information about the current state of the player
function updatePlayerInfo() {
// Also check that at least one function exists since when IE unloads the
// page, it will destroy the SWF before clearing the interval.
if(ytplayer && getstate()==1) {
 
 var currenttime =  ytplayer.getCurrentTime();
 var totaltime = ytplayer.getDuration();
 var loaded = ytplayer.getVideoBytesLoaded();
 var totalbyte = ytplayer.getVideoBytesTotal();
 var playPc = (currenttime/totaltime);
 var LoadPc =  (loaded/totalbyte * 100);
 
 
 
 
 
 var str1 = playPc*370;
 var str2 = ''+LoadPc+'%';
   // console.log(str1);
$('div.jplayer-load-bar').width(str2);
$('div.jplayer-play-bar').width(str1);
$('div.jplayer-load-bar').css("background-color","darkgrey");
$('div.jplayer-play-bar').css("background-color","red");
////console.log(str1);
////console.log(str1);

//update playtime and total duration
	$('#jplayer_play_time').empty();
	var ct = Math.round(currenttime/60)+":"+ Math.round(currenttime%60);
	$('#jplayer_play_time').append(ct);
  
  
  //for smart radio
  var rad = getUtilityObj();
  

  var cs = getCurrentSong();
  var len = localStorage.length-2;
   // console.log(rad.func + rad.repeat + playPc + cs + len);
  if(rad.func == "radio" && rad.repeat=="0" && playPc>.90 && cs==len ) { //checking for radio, then play percentage is 90%, then its the last song in the playlist
	
	//get currentsong
	var csObj = getObject(cs);
	var artist = rad.artist;
	var track = rad.track;
	
	//console.log(artist," ", track)
	
	var lastfm = new LastFM(
		{
		apiKey    : '6572dfc58ea6579033dfa2fcc1280422',
		apiSecret : '50ac009bb3c27911f366f0f533b667e0'
		}
	);
	
	lastfm.track.getSimilar({track: track, artist:artist, autocorrect:1, limit:20},{
					success: function(res1){
							var i = Math.floor(Math.random()*20);
							var Artists = res1.similartracks.track[i].artist.name;
							var Tracks = res1.similartracks.track[i].name;
							//console.log(i+" "+Artists+" "+Tracks);
							var j = len+1;
							findOnePlaylist(Artists,Tracks); 
						},
					error: function(code, message){
					}
	});
			
	$.jGrowl("fetching next song for radio.. ");
	setTimeout(loadplaylist, 5000);
  
  }

}
}

function seekPlayerTo(pos){

if(ytplayer){
// get time from position
    var calc = pos/370 * ytplayer.getDuration();
////console.log(calc);
    ytplayer.seekTo(calc, true); }

    //move current play position to this point

    $('div.jplayer-play-bar').width(calc);
}

function seekVolTo(pos){
// get percentage
	var vol = Math.round(pos/46 * 100);
	if(ytplayer){
	ytplayer.setVolume(vol); }
    //console.log(vol);
    $('.jp-volume-bar-value').css({width: pos});
}

function playVideo(url) {
if (ytplayer) {
  clearInterval(timeoutid);
  ytplayer.loadVideoByUrl(url);

    //check quality, get one with lowest quality
    var qua = ytplayer.getAvailableQualityLevels();
    var quality = qua[qua.length-1];
    //set to lowest
    ytplayer.setPlaybackQuality(quality);



  ytplayer.playVideo();
  
  var ab = getUtilityObj();

    //update title
 document.title = ab.artist + '-' + ab.track;

  var art,tra,string;
  //console.log(ab.func);
  if(ab.func != "playvid")  {
	  var obj = getObject(getCurrentSong());
	  string = ""+obj.name+"-"+obj.trackSearched;
	  if(obj.name=="" || obj.trackSearched=="") { string = obj.tracks}
	  art =obj.name;
	  tra =obj.trackSearched;
	  setPlayVar(art,tra,url);
	  //console.log("here");
 }	  
 
 if(ab.func =="playvid")  {
		
		var obj = getUtilityObj();
		art = obj.artist;
		tra = obj.track;
		string = art+'-'+tra;
		//setFunction("radio");
		//console.log(string);
 }
 
  $('#jplayer_song_title').empty();
  $('#jplayer_song_title').append(string);
 //console.log(art+ " "+tra);

 bg_magic(art);
 
 $("#container").show();
 collage(art);

 $("#lyrics").slideDown();
 setTimeout( function() { lyrics(art,tra); }, 2000);

 timeoutid =setInterval(function() {
							bg_magic(art);
							$.jGrowl("changing bg");
				  }, 90000);
  
  
  $.jGrowl(string);
  
  if( $('.TopArtists').is(":visible")){
	$(".TopArtists").css({'left':'30%'});
	$(".TopArtists").css({'width':'30%'});
  }
  
  
  //send the track to FB publish!!
  /*if(FB.getAccessToken){
	//publish
	videoTicker(ab.artist, ab.track, getIdfromlink(url));
  }*/
}	
}

function unpauseVideo() {
if(ytplayer){
	ytplayer.playVideo();
}
}

function pauseVideo() {
if (ytplayer) {
  ytplayer.pauseVideo();
 //ocument.title='Paused playback';
}
}

function muteVideo() {
if(ytplayer) {
  ytplayer.mute();
  $('.jp-volume-bar-value').css({'width': '0'});
}
}

function unMuteVideo() {
if(ytplayer) {
  ytplayer.unMute();
  var pos = ytplayer.getVolume()*.46;
  $('.jp-volume-bar-value').css({width: pos});
}
}

getstate = function() {
if(ytplayer){
return ytplayer.getPlayerState(); }
}


// This function is automatically called by the player once it loads
function onYouTubePlayerReady(playerId) {
ytplayer = document.getElementById("ytPlayer");
// This causes the updatePlayerInfo function to be called every 250ms to
// get fresh data from the player
setInterval(updatePlayerInfo, 1000);
ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
ytplayer.addEventListener("onError", "onPlayerError");
//Load an initial video into the player
   seekVolTo(23);
}

// The "main method" of this sample. Called when someone clicks "Run".
function loadPlayer() {
// Lets Flash from another domain call JavaScript
var params = { allowScriptAccess: "always" };
// The element id of the Flash embed
var atts = { id: "ytPlayer" };
// All of the magic handled by SWFObject (http://code.google.com/p/swfobject/)

swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&version=3"+
				   "&playerapiid=player1&autoplay=0",
				   "videoDiv", "320", "240", "8", null, null, params, atts);
				   
//swfobject.embedSWF("http://www.youtube.com/e/y1Lzydhhdzi?&enablejsapi=1&playerapiid=ytplayer", "ytplayer", "425", "365", "8", null, null, params);				   
}
function _run() {
loadPlayer();
}
google.setOnLoadCallback(_run);

function playPlaylist()	{
	currentsong = localStorage.getItem("currentSong");
		
    var cs = jQuery.parseJSON(currentsong);
	cs = getObject(cs);
    var art = cs.name;
    var tra = cs.trackSearched;
    var link = cs.link;
	
    setPlayVar(art,tra,link);
	playVideo(link);
	$(".jp-pause").show();
	$(".jp-play").hide();
}

function toggleplay() {

	if(localStorage.length <=2)
	{
		reset();
		$.jGrowl("nothing to play");
	}
	
  var state = getstate();
  if (state==1) { //playing
	//get pause button in action
	ytplayer.pauseVideo();
  }
  
  if (state == 2) { //paused
   // get player button in action
  unpauseVideo();
  }
  
  //for stopped videos
  if (state == -1) {
	playPlaylist();
}
}

function nextSong() {
var cs = getCurrentSong();
var curS = getUtilityObj();
 if (curS.radio!="1" && cs==localStorage.length-2) { changeCurrentSong(1); $.jGrowl("reached end, relooping") }	
 if (curS.radio!="1" && cs<localStorage.length-2) { changeCurrentSong(cs+1); }
 if (curS.radio=="1") { changeCurrentSong(cs); console.log("repeating"); }
 playPlaylist();
}

function previousSong() {
var cs = getCurrentSong();
 if (cs==1) { changeCurrentSong(localStorage.length-2); }	
if (cs>1) { changeCurrentSong(cs-1); }

playPlaylist();
}

function stopVid() { 

if(ytplayer) {
	ytplayer.stopVideo(); 
}	
$(".jp-pause").hide();
$(".jp-play").show();

}

function toggleMute() {
if(ytplayer.isMuted()==true) { unMuteVideo(); }
else { muteVideo(); }
}

function maxVol() { seekVolTo(46);}

// bind keys for next previous volup and vol down
$(document).keydown(function(e){
  if ( !$(e.target).is("#artist, #track") ) {
            // do something
        
	if (e.which == 84 || e.which==116){
			//goto previous song
			previousSong();		
    }
	
	if (e.which ==89 || e.which==121) { nextSong();}
	
	if(e.which ==38) {
		vol = ytplayer.getVolume();
		pos = vol*46/100; 
		
		if(vol!=100) {
			pos = pos*1.1<=46?pos*1.1:46;
			seekVolTo(pos);
		}
	}
	
	if(e.which ==40) {
		vol = ytplayer.getVolume();
		pos = vol*46/100;
		
		if(vol!=100) {
			pos = pos*0.9>=0? pos*.9: 0;
			seekVolTo(pos);
		}
	}
	
	if(e.which ==114 || e.which==82)
	{	
        toggleradiomode();
	}
	}

});

function toggleradiomode(){

            var cs = getUtilityObj();
    		if( cs.func !="radio"){
                setFunction("radio");
                $.jGrowl("radio mode ON!! Press R/r or click to toggle");
                imgsrc = '../images/rred.png';
                $('a.radiomode').css('background-image', 'url(' + imgsrc + ')');
    		}
    		else if (cs.func =="radio"){
                setFunction("playlist");
                imgsrc = '../images/rblack.png';
                $('a.radiomode').css('background-image', 'url(' + imgsrc + ')');
                $.jGrowl("radio mode OFF!! Press R/r or click to toggle");
    		}
}

