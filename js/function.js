function smartRadio(getTag) {
    //reset();
    var len = localStorage.length - 2;

    lastfm.tag.getTopTracks({tag:getTag, limit:50}, {
        success:function (res1) {
            var i = Math.floor(Math.random() * 49);
            var Artist = res1.toptracks.track[i].artist.name;
            var Track = res1.toptracks.track[i].name;
            //	//console.log(i+" "+Artist+" "+Track);
            var j = len + 1;
            findOnePlaylist(Artist, Track);
            //set function = radio
            setFunction("radio");
        },
        error:function (code, message) {
            //for late
        }
    });

    changeCurrentSong(localStorage.length - 1);
    setTimeout(playPlaylist, 3000);
    setTimeout(loadplaylist, 3000);
}

var duration, speed;
function getTopArtists() {

    var dataUrl = 'http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=6572dfc58ea6579033dfa2fcc1280422&limit=50';
    var res1;
    $.ajax({
        'url':dataUrl,
        'dataType':'xml',
        success:function (result) {
            res1 = $.xml2json(result);

            for (i = 1; i < 50; i++) {
                artist = res1.artists.artist[i].name;
                var ArtistImage = res1.artists.artist[i].image[3].text;
                //console.log(ArtistImage);
                var temp = '<a class="wrapper" title="' + artist + '">';
                temp = temp + '<img class="logo" id="' + artist + '" src="' + ArtistImage + '" alt="' + artist + '">';
                $("div#imgcontain").append(temp);

            }
        }

    });


    //work out duration of anim based on number of images (1 second for each image)
    duration = $(".wrapper").length * 7000;

    //store speed for later (distance / time)
    speed = (parseInt($("div#imgcontain").width()) + parseInt($("div#viewer").width())) / duration;

    //set direction
    var direction = "rtl";

    //set initial position and class based on direction
    (direction == "rtl") ? $("div#imgcontain").css("left", $("div#viewer").width()/2).addClass("rtl") : $("div#imgcontain").css("left", 0 - $("div#imgcontain").width()/2).addClass("ltr");


    animator($("div#imgcontain"), duration, direction);
}

var track;
function getPopularTracks() {

    var dataUrl = 'http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=6572dfc58ea6579033dfa2fcc1280422&limit=25';
    var res1;
    var entries = localStorage.length - 2;
	
	$('#videos').empty();
	$('#videos').empty();
	
    $.ajax({
        'url':dataUrl,
        'dataType':'xml',
        success:function (result) {
            res1 = $.xml2json(result);

            for (i = 1; i < 25; i++) {
                track = res1.tracks.track[i].name;
                artist = res1.tracks.track[i].artist.name;
                console.log(artist + '-' + track);
                findOneVideo(artist, track);

            }
        }

    });

    //entries = localStorage.length-entries;
    $.jGrowl("Popular Tracks are listed here, U can add them to playlist if u want");
	$('#videos').show();
}
;

function doSearch() {
    //do everything here .. what ever the fuck u want to do !!
    //alert("wow");
    var artist = $("#artist").val();
    var track = $("#track").val();

    // if the song and artist are good!!
    // if(artist==""  || track==""){ checkifexist(artist,track);}
    checkpositions();
	$('#PlaylistStartup').hide();
    searchOrg(artist, track);

}

function checkifexist(art, tra) {

    lastfm.track.getInfo({artist:art, track:tra}, {
        success:function (res1) {
            console.log("exists");
            return true;
        },
        error:function (code, message) {
            //for late
            console.log("nothing of this...");
            return false;
        }
    });


}

function doAuto() {
    //do everything here .. what ever the fuck u want to do !!
    //alert("wow");
    var artist = $("#artist").val();
    var track = $("#track").val();

    autoPlaylist(artist, track);
    checkpositions();
}

// function autoplaylist based on initial search _ uses both youtube api and last.fm api
function autoPlaylist(art, tra) {
    //step 0
    //reset(); //localstorage.length = 2
    //step 1: last.fm verification
    //var cache = new LastFMCache();

    var len = localStorage.length - 2;


    lastfm.track.getSimilar({track:tra, artist:art, autocorrect:1, limit:11}, {
        success:function (res1) {
            //auto correct
            //$("#artist").val(res1.similartracks.@attr.artist);
            //$("#track").val(res1.similartracks.@attr.track);

            //fetch similartracks _ change 25 if limit is to be changed
            var i;
            for (i = 0; i < 10; ++i) {

                //get track fields
                var Artist = res1.similartracks.track[i].artist.name;
                var Track = res1.similartracks.track[i].name;
                ////console.log(i+" "+Artist+" "+Track);
                //get youtube link and title for that artist and track
                //var j = len+i+1;
                findOnePlaylist(Artist, Track);
                //  addthistoVideos(artist, track, playerUrl);
            }


        },
        error:function (code, message) {
        }
    });
    //refresh
    $.jGrowl("please wait, fetching similar songs (playlist might not show tracks, click on play to continue)");
    setTimeout(loadplaylist, 5000);

}
/**/
//billboard api used here!!
function popular() {
    //step 0
    reset(); //localstorage.length = 2
    //step 1: last.fm verification
    //var cache = new LastFMCache();

    var apiKey = '9ag3exqupn6jjdt9jmkkzkhd';
    var my_url = 'http://api.billboard.com/apisvc/chart/v1/list?start=1&count=25&sort=date-&format=json&api_key=9ag3exqupn6jjdt9jmkkzkhd';
    var len = localStorage.length - 2;

    $.ajax({
        'url':my_url,
        'dataType':'jsonp',
        'jsonp':'callback',
        success:function (result) {
            //$.jGrowl("fuck!!");
            ////console.log(result)
            var i;
            for (i = 0; i < 25; ++i) {

                var Artist = result.searchResults.chartItem[i].artist;
                var Track = result.searchResults.chartItem[i].song;
                //	//console.log(i+" "+Artist+" "+Track);
                //var j = i+1;
                findOnePlaylist(Artist, Track);
                // addthistoVideos(artist, track, playerUrl);
            }
        }
    });
    //refresh
    $.jGrowl("loading popular song, please wait");
    setTimeout(loadplaylist, 5000);
    //setTimeout(playPlaylist,2000);


}

function reset() {
    localStorage.clear();
    $("#jplayer-playlist").empty();
    localStorage.setItem("currentSong", 1);
    var myobj = {'func':'radio', 'lastfunc':'playlist', 'lastart':'', 'playlist':'', 'repeat':'0', 'lyrics':1, 'bgEffects':1, 'autoValidate':0, 'suggest':0, 'artist':"metallica", 'track':'nothing else matters', 'url':''};
    localStorage.setItem("currentState", JSON.stringify(myobj));
    if ($("#jplayer-playlist").is(":visible") !== 1) {
        $("#jplayer-playlist").slideUp();
        loadplaylist();
    }
    //stopVid();
}


function loadplaylist() {
    var localTrackList = '', i;

    for (i = 1; i <= localStorage.length - 2; i++) {
        var str = localStorage.getItem(i);
        var obj = jQuery.parseJSON(str);
        ////console.log(i)
        localTrackList += '<li class="" name="' + i + '" title="' + obj.tracks + '" link="' + obj.link + '">';
        localTrackList += '<a name="' + i + '" class="playFromPlaylist">';
        localTrackList += '<p>' + obj.tracks + '</a>';
        localTrackList += '<a href="#" class="remove" name="' + i + '">&nbsp;</a></p></li>';
        ////console.log(localTrackList)
    }

    $("#jplayer_playlist").empty();
    $("#jplayer_playlist").append('<ul>' + localTrackList + '</ul>');

}

getCurrentSong = function () {
    var currentSong = localStorage.getItem("currentSong");
	if (currentSong=='0'){
		currentSong = '1';
	}
    return parseInt(currentSong, 10);

};

getNextSong = function () {
    var currentSong = getCurrentSong();
    if (currentSong === localStorage.length - 1) {
        return currentSong - 2;
    }
    else {
        return currentSong - 1;
    }
};


// returns the keyvalue of next song 
getPreviousSong = function () {
    var currentSong = getCurrentSong();

    if (currentSong === localStorage.length - 1) {
        return currentSong;
    }
    else {
        return currentSong + 1;
    }
};

getObject = function (songNumber) {
    return jQuery.parseJSON(localStorage.getItem(songNumber));
};

function changeCurrentSong(number) {
    localStorage.setItem("currentSong", JSON.stringify(number));
}

function listls() {
    var i = 0;
    for (i = 0; i <= localStorage.length - 1; i++) {
        console.log(localStorage.key(i));
        console.log(localStorage.getItem(localStorage.key(i)));
    }
}

// needs modification, if ytplayer is running and my track goes anywhere .. the currentsong value has to be changed too
function shufflePlaylist() {
    var len = localStorage.length - 2; //length of my playlist
    var rand = 0, tempObj;
    var change = 0, i;
    for (i = 1; i <= len; i++) {
        rand = Math.floor(Math.random() * len) + 1;
        ////console.log(rand," ",i);
        if (i !== rand) {
            tempObj = localStorage.getItem(i);
            localStorage.setItem(i, localStorage.getItem(rand));
            localStorage.setItem(rand, tempObj);
            if (getCurrentSong() === i) {
                localStorage.setItem("currentSong", rand);
                change = 1;
            }
            if (getCurrentSong() === rand && change === 0) {
                localStorage.setItem("currentSong", i);
            }
        }
        change = 0;
    }
    loadplaylist();
}

getUtilityObj = function () {
    var str = localStorage.currentState;
    var obj = jQuery.parseJSON(str);
    return obj;
};


function setFunction(curr) {
    var cuo = getUtilityObj();
    cuo.func = curr;
    localStorage.setItem("currentState", JSON.stringify(cuo));
}

function setPlayVar(artist, track, url) {
    var cuo = getUtilityObj();
   // cuo.lastart = cuo.artist; //get last artist
    cuo.artist = artist;
    cuo.track = track;
    cuo.url = url;
	//console.log(artist+'-'+track+'-'+url);
    localStorage.setItem("currentState", JSON.stringify(cuo));
}

function Radiols() {
    $('.radiolist').slideToggle();
}
function Language() {
    $('.langlist').slideToggle();
}

function bg_magic(artist) {

    var my_url = 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q="' + artist + '"&imgsz=xxlarge&alt=jsonp&max-result=15';

    $.ajax({
        'url':my_url,
        'dataType':'jsonp',
        'jsonp':'callback',
        success:function (res) {
            var data = res.responseData.results;
            var rand = Math.floor(Math.random() * data.length);
            var url = data[rand].unescapedUrl;
            //var href = $('body').css('background-image');
            jQuery("#bg-magic").css('background-image', 'url("' + url + '")');
            //var href = $('body).css('background-image');
            jQuery("#bg-magic").fadeIn(5000);
            //alert(href);
        }
    });
}


$(function () {
    var timeoutid;
    var currentsong, currentstate;
    //$("#jplayer_play").show();
    $("#jplayer_pause").hide();
    //initialise currentsong number from first song

    if (localStorage.length === 0) {
        reset();
    }

    $("#videos").hide();
    $(".jp-playlist").hide();
    $(".radiolist").hide();
    $(".langlist").hide();
    $("#sub-header").hide();
//


    $("#videos").bind("mousewheel", function (ev, delta) {
        var scrollTop = $(this).scrollTop();
        $(this).scrollTop(scrollTop - 10 * delta);

        //$.jGrowl(delta);
    });

    $("#radiolist").bind("mousewheel", function (ev, delta) {
        var scrollTop = $(this).scrollTop();
        $(this).scrollTop(scrollTop - 10 * delta);
    });

    $("#lyrics").bind("mousewheel", function (ev, delta) {
        var scrollTop = $(this).scrollTop();
        $(this).scrollTop(scrollTop - 10 * delta);
    });

    $("#discolist").bind("mousewheel", function (ev, delta) {
        var scrollTop = $(this).scrollTop();
        $(this).scrollTop(scrollTop - 10 * delta);
    });

    //for container

    var maxZindex = 101;
    var minZindex = 101;


    $('.box').live('mousedown',
        function (e) {
            if ((e.which == 1)) {
                clickedId = $(this).attr("id");
                maxZindex++;
                prop = maxZindex + '';
                $("#" + clickedId).css("z-index", prop);
                $('.vmenu').hide();
                return false;
            }
            // context menu here
            if ((e.which == 3)) {
                thisartist = $(this).attr("title");
                $('#nameofartist').attr("title", thisartist);
                $('.vmenu').css({ left:e.pageX, top:e.pageY, zIndex:'101' }).show();
                return false;
                $('.vmenu').hide();
            }
            else if ((e.which == 2)) {
                //             alert("code to play famous song for this artist");

            }
            e.preventDefault();
        }).live('contextmenu', function (e) {
            e.preventDefault();
        });


    $('.box').live('dblclick', function () {
        var artist = $(this).attr("title");
        getTopTracks(artist);
        getDisco(artist);
    });

    $('.box').live('dblclick', function () {
        var artist = $(this).attr("title");
        getTopTracks(artist);
        getDisco(artist);
//             $('.vmenu').hide();
    });

    $('#getdisco').live('click', function () {
        var artist = $('#nameofartist').attr("title");
        getDisco(artist);
        $('.vmenu').hide();
    })

    $('#getbest').live('click', function () {
        var artist = $('#nameofartist').attr("title");
        getTopTracks(artist);
        $('.vmenu').hide();
    })

    $('#getradio').live('click', function () {
        var artist = $('#nameofartist').attr("title");
        smartRadio(artist);
        $('.vmenu').hide();
    })

    $('#discolist ul li').live('dblclick', function () {
        var album = $(this).attr("link");
        var artist = $(this).attr("name");
        if ($("#videos").is(":hidden")) {
            $("#videos").show();
        }
        getAlbumTracks(album, artist);
    });


    $('a.addToPlaylist').live('click', function () {
        var track_title = $(this).attr('title');
        var track_link = $(this).attr('mp3link');
        var artist = $(this).attr('artist');
        var track_searched = $(this).attr('track');

        addthistoplaylist(artist, track_searched, track_link);
        $.jGrowl("current track has been added to your playlist");
        return false;
    });

    $('a.play').live('click', function () {
        //	alert("wow");
        var url = $(this).attr('link');
        var art = $(this).attr("artist");
        var tra = $(this).attr("track");
        setFunction("playvid");
        setPlayVar(art, tra, url);
        $.jGrowl("The track is being started, playlist is paused");
        playVideo(url);
    });


//function to dbl click on a playlist and load it.


    $('#myplaylists ul li').live('dblclick',function(){
        var playlistId = $(this).children('#myplaylistsAnchor').attr('playid');
        var name = $(this).text();
        //console.log(playlistId);
        fetchAllsongs(playlistId);
        $('.plBtn').text(name);
    })

    $('.plBtn').live('click', function () {

        //("#radiolist").hide();
        //("#langlist").hide();

        if ($("#jplayer_playlist").is(':empty')) {
            loadplaylist();
        }
        else {
            $("#jplayer_playlist").slideToggle("slow");
        }
    });

    $('#option').live('click', function () {
        $("#sub-header").slideToggle("slow");
    });


    $('#refresh').live('click', function () {
        refreshLyr();
    });
	
    //playing from playlist
    $('a.playFromPlaylist').live('dblclick', function () {
        var track_num = $(this).attr('name');

        // if any song is already running pause it
        localStorage.setItem("currentSong", track_num);
        setFunction("playlist");
        $.jGrowl("loading this song, For mode radio press R/r");
        playPlaylist();
    });

    $("div.jp-progress").click(function (e) {
        var y = $(".jp-progress");
        var pos = y.offset();
        var x = (e.pageX - pos.left);
        ////console.log(x);
        seekPlayerTo(x);
    });

    $("div.jp-volume-bar").click(function (e) {
        var y = $(".jp-volume-bar");
        var pos = y.offset();
        var x = (e.pageX - pos.left);
        //console.log(x);
        seekVolTo(x);
    });

    $("#jplayer_play").live('click', function () {
        toggleplay();
        $("#jplayer_play").hide();
        $("#jplayer_pause").show();
    });

    $("#jplayer_pause").live('click', function () {
        toggleplay();
        $("#jplayer_play").show();
        $("#jplayer_pause").hide();
    });

    $("#jplayer_next").live('click', function () {
        //check if radio is playing and if its the last song!!
        var obj = getUtilityObj();
        var cs = getCurrentSong();
        var csObj = getObject(cs);
		//console.log(csObj);
        var artist = csObj.name;
        var track = csObj.trackSearched;
		var link = csObj.link;
		
		//setPlayVar(artist, track, link);
		
        var j = localStorage.length - 1;

        if (obj.func == "radio" && localStorage.length == cs + 2) {

            lastfm.track.getSimilar({track:track, artist:artist, autocorrect:1, limit:50}, {
                success:function (res1) {
                    var i = Math.floor(Math.random() * 50);
                    var Artists = res1.similartracks.track[i].artist.name; 
                    var Tracks = res1.similartracks.track[i].name;
                    ////console.log(i+" "+Artists+" "+Tracks);
                    findOnePlaylist(Artists, Tracks);
                    // addthistoVideos(artist, track, playerUrl);
                },
                error:function (code, message) {
                }
            });
            $.jGrowl("dont press next when u are listening radio, fetching next song anyways");
            setTimeout(nextSong, 2000);
			loadplaylist();
        }
        else {
            nextSong();
        }
    });

    $("#jplayer_previous").live('click', function () {
        previousSong();
    });

    $("#jplayer_stop").live('click', function () {
        stopVid();
    });

    $("#jplayer_volume_min").live('click', function () {
        //toggle between mute and unmute
        toggleMute();
    });

    $("#jplayer_volume_max").live('click', function () {
        //toggle between mute and unmute
        maxVol();
    });

//remove from playlist on click remove
    $('a.remove').live('click', function () {
        var songId = $(this).attr('name');
        var tempobj, i;
        ////console.log(parseInt(songId,10));
        for (i = parseInt(songId, 10); i <= localStorage.length - 3; i++) {
            tempobj = localStorage.getItem(i + 1);
            localStorage.setItem(i, tempobj);
        }

        localStorage.removeItem(localStorage.length - 2);
        loadplaylist();
    });

    $("#reset").live('dblclick', function () {
        //toggle between mute and unmute
        reset();
        $('.plBtn').text('PLAYLIST');
        $.jGrowl("playlist cleaned, U are off to a new one!!");
    });

    $("#shuffle").live('click', function () {
        //toggle between mute and unmute
        shufflePlaylist();
        $.jGrowl("playlist shuffled");
    });

    $(".radiolist li").live('click', function () {

        stopVid();
        reset();

        var getTag = $(this).text();
        ////console.log(getTag)
        //smart radio now
        //get song 1 :P from a list of 20 songs
        //change current function = radio

        smartRadio(getTag);

    });
    $(".langlist li").live('click', function () {

        stopVid();


        var getTag = $(this).text();
        ////console.log(getTag)
        //smart radio now
        //get song 1 :P from a list of 20 songs
        //change current function = radio

        smartRadio(getTag);

    });

    var lastfm = new LastFM({
        apiKey:'6572dfc58ea6579033dfa2fcc1280422',
        apiSecret:'50ac009bb3c27911f366f0f533b667e0'
        //cache     : cache
    });

});


function displayDisco() {
    var artist = $("#artist").val();
    checkpositions();
	getDisco(artist);
    
}

function getCloud() {
    var artist = $("#artist").val();
    $("#container").empty();
    $("#container").show();
    callfromtop=1;
    collage(artist);
    checkpositions();
}

function getPopularSongs() {
    var artist = $("#artist").val();
    getTopTracks(artist);
}


function refreshLyr() {
// get current artist!!
//get current track!!
    var obj = getUtilityObj();
    var artist = obj.artist;
    var track = obj.track;

    artist = artist.toLowerCase();
    track = track.toLowerCase();
    //console.log(artist+ ' ' +track);
//refresh lyrics!!
    lyrics(artist, track);

}


function resetMenuState() {
    //get current state of all drop down menus
    $("#radiolist").hide();
}

function checkpositions() {

    if ($(".TopArtists").is(':visible')) {
        //console.log("0");
        //case 1: only lyrics is visible
        if ($("#lyrics").is(':visible')) {
            $(".TopArtists").css({'left':'30%'});
            //console.log()

            if ($("#discolist").is(':visible')) {
                $("#discolist").css({'top':'60%', 'height':'38%'});
            }
        }

        //case 2: disco is already visible
        if ($("#discolist").is(':visible') && $("#lyrics").is(':visible')) {
                        $("#discolist").css({'top':'60%', 'height':'38%'});
        }

        //if videos is visible
        if ($("#videos").is(':visible')) {
            $("#videos").css({'top':'50%', 'height':'35%'});
			$('#PlaylistStartup').hide();
        }

        //if container(collage is visible)
        if ($("#container").is(':visible')) {
            if ($("#lyrics").is(':hidden')) {
                $(".TopArtists").css({'width':'58%'});
            }
            else {
                $(".TopArtists").css({'width':'28%'});
            }

        }

        //if no lyrics but only .TopArtists is visible
        if ($("#lyrics").is(':hidden')) {
            $(".TopArtists").css({'left':'2%'});
            $("#discolist").css({'top':'50%', height:'48%'});
        }


    }
	
}


$('a.repeat').live('click', function () {
    var cs = getUtilityObj();
    var imgsrc;
    if (cs.repeat != '1') {
        cs.repeat = '1';
        //change image to Red for ON;
        imgsrc = '../images/repeatred.png';
        $('a.repeat').css('background-image', 'url(' + imgsrc + ')');
    }
    else {
        cs.repeat = '0';
        imgsrc = '../images/repeatblack.png';
        $('a.repeat').css('background-image', 'url(' + imgsrc + ')');
    }
    ;
    localStorage.setItem("currentState", JSON.stringify(cs));
});


$('a.radiomode').live('click', function () {
    toggleradiomode();
});

$('.playPS').live('click',function() {
	//playlist id
	var PlaylistID = $(this).attr('PlayId');
	//fetch songs for this playlist
	fetchAllsongs(PlaylistID);
	$.jGrowl("starting your playlist in 3 seconds, Have fun!!");
	setTimeout(playPlaylist, 3000);
	$('#PlaylistStartup').fadeOut("slow");
});
