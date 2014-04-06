<!--
<?php

$params = array();
if(count($_GET) > 0) {
    $params = $_GET;
} else {
    $params = $_POST;
}
// defaults
if($params['title'] == "") $params['title'] = "Some artist";
if($params['type'] == "") $params['type'] = "music";

?>-->


<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="en-US" xmlns:fb="https://www.facebook.com/2008/fbml"> 
<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# fatslave: http://ogp.me/ns/fb/fatslave#">
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
  <!-- Open Graph meta tags 
        <meta property="fb:app_id" content="382787418436991" />

		<meta property="og:type" content="fatslave:<?php echo $params['type']; ?>"/>
		<meta property="og:url" content="http://eargasm.xtreemhost.com/index.php?type=<?php echo $params['type']; ?>&title=<?php echo $params['title']; ?>"/>
        <meta property="og:title" content="<?php echo $params['title']; ?>"/>
        <meta property="og:image" content="https://s-static.ak.fbcdn.net/images/devsite/attachment_blank.png"/>
        <meta property="og:description" content="Pleasure to your ears!!"/>
-->
    <LINK REL="SHORTCUT ICON" HREF="images/eargasm.ico">
    <title>Eargasm : A musical journey</title>

    <META NAME="Description" CONTENT="Search music, artists, tracks, play sort make playlists youtube lyrics dynamic background magic wand discography">

    <!-- All css here -->
    <link href="css/template.css" type="text/css" rel="stylesheet">
    <link href="css/jplay.css" type="text/css" rel="stylesheet">
    <link href="css/jquery.jgrowl.css" type="text/css" rel="stylesheet">
    <link href="css/footer.css" type="text/css" rel="stylesheet">
    <link type="text/css" rel="stylesheet" href="css/suggest.min.css"/>
	<style>
	<!--
	.addToPlaylist{
		background:url(../images/add.png) no-repeat center;
		display:block; 
		position:relative; 
		width:22px; 
		height:22px;
		float:right;
		margin-right:10px;
	}
	-->
	</style>


</head>
<body>

<div id="bg-magic"></div>
<div id="bglayer"></div>
<div class="subheader-topwrapper"></div>
<div id="top-wrapper">	
	
    <div class="button-wrap">
        <div id="authorize" class='authorize-button'>Sign <span> IN</span></div>
    </div>
	
    <div id="top-wrapper-form">
        <FORM onSubmit="return false">
            <TABLE BORDER="0" CELLSPACING="0" CELLPADDING="0">
                <TR>
                    <TD>
                        <image src="/images/check.png" onclick="verify()" title="validate song"/>
                    </TD>
                    <TD><INPUT TYPE="text" NAME="bq1" VALUE="metallica" id="artist"></TD>
                    <TD><INPUT TYPE="text" Name="bq2" Value="nothing else matters" id="track"></TD>
                    <TD>
                        <image src="/images/search.png" onclick="doSearch()" title="search the song"/>
                    </TD>
                    <TD>
                        <image src="/images/wand.png" onclick="doAuto()" title="magic wand"/>
                    </TD>
                    <TD>
                        <image src="/images/disc.png" onclick="displayDisco()" title="artist discography"/>
                    </TD>
                    <TD>
                        <image src="/images/cloud.png" onclick="getCloud()" title="similar artists"/>
                    </TD>
                    <TD>
                        <image src="/images/best.png" onclick="getPopularSongs()" title="Popular song for artist"/>
                    </TD>
                    <TD>
                        <image src="images/cafe.png" onclick="SendAlltoPlaylist()"
                               title="send all displayed result to playlist"></image>
                    </TD>
                    <!--	<TD><image src="/images/hot.png" onclick="popular()"/></TD> -->
                </TR>
            </TABLE>
        </FORM>
    </div>


</div>

<div class="sheader">
</div>
<!-- dont put elements .. will change their opacity as well -->

<div id="descriptionofsite">Search Any song, Store and make playlists, Get suggestions, Artists and Popular tracks, Smart Radio:</div>


<div class="special">
    <ul>
        <!--	<LI><a onclick="smartRadio('Country')"> Country </a></LI> -->
        <LI><a onclick="smartRadio('Blues')"> Blues </a></LI>
        <LI><a onclick="smartRadio('Pop')"> Pop </a></LI>
        <LI><a onclick="smartRadio('hip hop')"> hip hop</a></LI>
        <LI><a onclick="smartRadio('Rock')"> Rock </a></LI>
        <!--	<LI><a onclick="smartRadio('Metal')">Metal</a></LI> -->
        <LI><a onclick="getPopularTracks()"><img src="/images/hot.png" height="20px" width="20px"/>Popular</a></LI>
        <LI><a onclick="Language()">Language(beta)</a></LI>
        <LI><a onclick="Radiols()">All-Genres</a></LI>
    </ul>
</div>


<!--	<div id="option" class="option"><img src="/images/pref.png" width="24px" height="24px"/></div> -->
<div id="refresh" class="option"><a href="#"><img src="/images/refresh.png" width="24px" height="24px" title="refresh lyrics"/></a>
</div>
<div id="save" onclick="savePlaylist()">&nbsp;</div>
<div id="shuffle">&nbsp;</div>
<div id="reset">&nbsp;</div>
<div class="plBtn">PLAYLIST</div>
<div id="jplayer_playlist" class="jp-playlist"></div>
<div id="myplaylists" class='myplaylists'>
    <ul>
    </ul>
</div>


<!--<div id="sub-header">
    <form>
    <input type="checkbox" name="lyrics" />Lyrics&nbsp;&nbsp;
    <input type="checkbox" name="validation" />Validation&nbsp;&nbsp;
    <input type="checkbox" name="Suggestion" />Suggestions&nbsp;&nbsp;
    <input type="checkbox" name="background" />BG effects&nbsp;&nbsp;
    <input type="checkbox" name="Recommendations" />Recommendation&nbsp;&nbsp;
    </form>
</div>-->


<div class="vmenu">
    <div id="nameofartist" title=""></div>
    <Table border="0">
        <TR>
            <TD>
                <div id="getdisco" class="first_li" title="discography"><img src="/images/disc.png"/></div>
            </TD>
            <TD>
                <div id="getbest" class="first_li" title="Auto playlist"><img src="/images/best.png"/></div>
            </TD>
            <TD>
                <div id="getradio" class="first_li" title="Artists Radio"><img src="/images/radio.png"/></div>
            </TD>
        </TR>
    </TABLE>
</div>


<div id="mid">
    <div id="videos"></div>
    <div id="lyrics"></div>
    <div id="container"></div>
    <div id="discolist"></div>
    <div id="PlaylistStartup">
		<div id="titlePS"> Some Playlists For you to get Started </div>
		<div id="selectedPS"> </div>
	</div>
	<div id="slider" class='TopArtists'>

        <div id="outerContainer">
            <div id="imageScroller">
                <div id="viewer" class="js-disabled">
                    <a class="wrapper" href="" title="move from here :P"><img class="logo" id="apple"
                                                                              src="images/trans.gif"
                                                                              alt="move from here">
                     <!-- remember do not close </a>   -->
                </div>
            </div>
        </div>
    </div>
</div>

<div id="footer">

    <!-- Audio Player -->
    <div class="jp-playlist-player">
        <div class="jp-interface">
            <ul class="jp-controls">
                <li><a href="#" id="jplayer_play" class="jp-play" tabindex="1">play</a></li>
                <li><a href="#" id="jplayer_pause" class="jp-pause" tabindex="1">pause</a></li>
                <li><a href="#" id="jplayer_stop" class="jp-stop" tabindex="1">stop</a></li>
                <li><a href="#" id="jplayer_volume_min" class="jp-volume-min" tabindex="1">min volume</a></li>
                <li><a href="#" id="jplayer_volume_max" class="jp-volume-max" tabindex="1">max volume</a></li>
                <li><a href="#" id="jplayer_previous" class="jp-previous" tabindex="1">previous</a></li>
                <li><a href="#" id="jplayer_next" class="jp-next" tabindex="1">next</a></li>
                <li><a href="#" id="repeat" class="repeat" tabindex="1">repeat</a></li>
                <li><a href="#" id="radiomode" class="radiomode" tabindex="1">Radio mode</a></li>
            </ul>
            <div class="jp-progress">
                <div id="jplayer_load_bar" class="jplayer-load-bar">
                    <div id="jplayer_play_bar" class="jplayer-play-bar">&nbsp;</div>
                </div>
            </div>
            <div id="jplayer_volume_bar" class="jp-volume-bar">
                <div id="jplayer_volume_bar_value" class="jp-volume-bar-value">
                </div>
            </div>
            <div id="jplayer_play_time" class="jp-play-time">
            </div>
            <div id="jplayer_total_time" class="jp-total-time">
            </div>
            <div id="jplayer_song_title" class="jp_song_title">
            </div>
        </div>

    </div>
    <!-- end footer -->


</div>
<div class="radiolist">
    <ul>
        <li> African</li>
        <li> Avant Garde</li>
        <li> Country</li>
        <li> Jazz</li>
        <li> Blues</li>
        <li> Instrumental</li>
        <li> Electronic</li>
        <li> Hip hop</li>
        <li> pop</li>
        <li> Modern folk</li>
        <li> Ska</li>
        <li> Soca</li>
        <li> Blues</li>
        <li> Rock</li>
        <li> Metal</li>
        <li> Rhythm</li>
        <li> Punk</li>
        <li> Death Metal</li>
        <li> Black Metal</li>
        <li> indian pop</li>
    </ul>
</div>

<div class="langlist">
    <ul>
        <li> Francais</li>
        <li> hindi</li>
        <li> German</li>
    </ul>
</div>

<a id="timeline" href="http://www.tiki-toki.com/timeline/entry/4505/Music-Cookie/" onclick="window.open(this.href, '_blank'); return false;">Time-line</a>
<a id="bug" href="http://www.easy-bugs.com/projects/eargasm" onclick="window.open(this.href, '_blank'); return false;">Bug Report</a>
<div id="fb-root"></div>
	

<div style="width:1px; height:1px; left:-100px; overflow:hidden;">
    <div id="videoDiv"></div>
</div>


<!--- all JS here -->
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="fb.js"></script>
<script type="text/javascript" src="js/function.js"></script>
<script type="text/javascript" src="js/scroll.js"></script>
<script type="text/javascript" src="js/lyrics.js"></script>
<script type="text/javascript" src="js/lastfm.api.md5.js"></script>
<script type="text/javascript" src="js/lastfm.api.js"></script>
<script type="text/javascript" src="js/validate.js"></script>
<script type="text/javascript" src="js/jquery.mousewheel.js"></script>
<script type="text/javascript" src="js/lyrics.js"></script>
<script type="text/javascript" src="js/collage.js"></script>
<script type="text/javascript" src="js/disco.js"></script>
<script type="text/javascript" src="js/json2.js"></script>
<script type="text/javascript" src="js/cors.js"></script>
<script src="js/jquery.xml2json.js" type="text/javascript" language="javascript"></script>
<script type="text/javascript" src="https://apis.google.com/js/client.js?onload=handleClientLoad"></script>
<script src="js/jquery.jgrowl_minimized.js"></script>
<script src="js/impromptu.js"></script>
<!--  all youtube stuff here  -->
<script src="js/jsapi.js" type="text/javascript"></script>
<script type="text/javascript">
    google.load("swfobject", "2.1");
</script>
<script type="text/javascript" src="js/utube_search.js"></script>

<script type="text/javascript" src="js/base.js"></script>
<script type="text/javascript" src="js/slider.js"></script>


<!-- routing try -->
<script type="text/javascript">

    var JSON = JSON || {};
    var allowsCC = /*@cc_on!@*/!1;
    var pUrl, url;

    var artist = "";
    var track = "";


    $(document).ready(function () {
//routing here
        url = window.location.hash;
		
		if(window.location.href.search('fb_action_ids')){
			$.jGrowl('Processing your request, loading in 5 seconds');
		}
	if(window.location.href.search('fb_action_ids')==-1){
        pUrl = url.split('/');
        //console.log(pUrl);
        if (pUrl.length <= 1) {
            getTopArtists();
            checkpositions();
			LoadOnStartup();
			$('#PlaylistStartup').fadeIn("slow");			
        }

        if (pUrl.length == 2 && pUrl[0]!='#playlist') {
            artist = pUrl[1];
            track = "";
            //console.log(artist);
            $('.TopArtists').hide();
            $("input#artist").attr('Value', artist);
            $("input#track").attr('Value', track);
            getPopularSongs();
        }

        if (pUrl.length ==3 && pUrl[0]=='#') {
            $('.TopArtists').hide();
            artist = pUrl[1];
            track = pUrl[2];
            //console.log(artist+ '-' +track);
            $("input#artist").attr('Value', artist);
            $("input#track").attr('Value', track);
            doSearch();
            getDisco(artist);
        }
		
		//play a playlist directly
		if (pUrl.length ==2 && pUrl[0]=='#playlist')
		{
			//check if exists
			$('.TopArtists').hide();	
			
			//load playlist
			fetchAllsongs(pUrl[1]);
			$.jGrowl('Ur playlist has been loaded,click play to start');
			
			//setTimeOut(playPlaylist,10000); this wont work because page reloads for OAUTH 2.0 
		}
		
		//play a song directly
		if (pUrl.length ==3 && pUrl[0]!='#'){
			$('.TopArtists').hide();
			var artist = pUrl[1];
			var track = pUrl[2];
			var videoId = pUrl[0].split('#')[1];
			console.log(videoId);
			
			//add this to playVar
			setPlayVar(artist, track, IdToLink(videoId));
			addthistoplaylist(artist, track, IdToLink(videoId));
			localStorage.setItem("currentSong",localStorage.length-2);
			
			$.jGrowl('Push Play to play ur song');
		}	
		
		if (window.location.href.split('/')[3] == '#playlist')
		{
			//check if exists
			$('.TopArtists').hide();	
			var id = window.location.href.split('/')[4].split('&')[0];
			//load playlist
			fetchAllsongs(id);
			$.jGrowl('Ur playlist has been loaded,click play to start');
			
			//setTimeOut(playPlaylist,10000); this wont work because page reloads for OAUTH 2.0 
		}
	}
	
	    setTimeout(doRedirect,5000);
        //scroll in header
        scrollbackground();

        $("#discolist").hide();
        $("#lyrics").hide();
        $("#container").hide();
        $("#sub-header").hide();
        $("#radiolist").hide();


    });

    //google analytics
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-32387740-1']);
      _gaq.push(['_trackPageview']);

      (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
	
	//facebook init function
	window.fbAsyncInit = function() {
          FB.init({
            appId      : '382787418436991',
            status     : true, 
            cookie     : true,
            xfbml      : true,
          });
        };
        (function(d){
           var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
           js = d.createElement('script'); js.id = id; js.async = true;
           js.src = "//connect.facebook.net/en_US/all.js";
           d.getElementsByTagName('head')[0].appendChild(js);
         }(document));	
		 
		 
		$('.shareSongFb').live('click', function(){
			var art, tra, id;
			art = $(this).attr('artist');
			tra = $(this).attr('track');
			id = $(this).attr('videoid');
			console.log(art +tra+ id);
			share_video_facebook(art, tra, id);
		});
		
		$('#sharePlaylists').live('click',function(){
			var id;
			id = $(this).attr('playid');
			
			share_playlist(id);
		});
		
	
</script>
</body>
</html>