var apikey = 'AI39si7FxgtfyF7NQKFI-iZ6N7pNLmhZ-8YwCuyt6m_p3hI0h5Rc6G3DDq5hIX1Jf4nPOb2l0k-9B-MgH_Rl-v2nAgCxgSLcUQ';
var scopes = 'https://gdata.youtube.com';
var clientId = '854482824996@developer.gserviceaccount.com';
var tokenType = 'Bearer';

function handleClientLoad() {
    console.log("test");
    gapi.client.setApiKey(apikey);
    window.setTimeout(checkAuth, 1);
}

function checkAuth() {
    gapi.auth.authorize({client_id:clientId, scope:scopes, immediate:true}, handleAuthResult);
}

//hide userplaylists when it starts
$('#myplaylists').hide();

function handleAuthResult(authResult) {
    //var authorizeButton = document.getElementById('authorize-button');
    if (authResult) {
        // $('.authorize-button').hide();
        getDisplayName();
        getPlaylistforUser();
        $('.authorize-button').bind('click', function(){
            $('#myplaylists').toggle("slow");
        });
    } else {

        // $('.authorize-button').show();
        // authorizeButton.style.visibility = '';
        $('.authorize-button').click(handleAuthClick);
    }
}

function handleAuthClick(event) {
    gapi.auth.authorize({client_id:clientId, scope:scopes, immediate:false}, handleAuthResult);
    return false;
}

// Helper method to set up all the required headers for making authorized calls to the YouTube API.
function generateYouTubeApiHeaders() {
    return {
        Authorization:tokenType + ' ' + gapi.auth.getToken().access_token,
        'GData-Version':2,
        'X-GData-Key':'key=' + apikey
    };
}

// display name of user
function getDisplayName() {
    $.ajax({
        // Other examples deal with XML data, but if you use alt=json|jsonc, you can get JSON data back too.
        dataType:'json',
        type:'GET',
        url:'https://gdata.youtube.com/feeds/api/users/default?alt=json',
        headers:generateYouTubeApiHeaders(),
        success:function (responseJson) {
            var displayName = responseJson['entry']['yt$username']['display'];
            $('.authorize-button').width(200);
            $('.authorize-button').empty();
            $('.authorize-button').append('Logged In as <span>' + displayName + '</span>');
        },
        error:function (jqXHR) {
            alert('Unable to get display name: ' + jqXHR.responseText);
        }
    });
}

// Some basic XML entity escaping. Not meant to be comprehensive.
function escapeXmlEntities(input) {
    if (input) {
        return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    } else {
        return '';
    }
}

//headers for new playlist request
function generateCPHeaders() {
    return {
        'Content-Type':'application/atom+xml',
        'Authorization':tokenType + ' ' + gapi.auth.getToken().access_token,
        'GData-Version':2,
        'X-GData-Key':'key=' + apikey
    };
}

//var global;
//try creating a new playlist
function createPlaylist(name) {

    name = escapeXmlEntities(name);
    descrip = escapeXmlEntities(getDiscription());


    var dataXml = '<?xml version="1.0"?> <entry xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://gdata.youtube.com/schemas/2007"><title type="text">' + name + '</title><summary>' + descrip + '</summary></entry>';
    $.ajax({
        datatype:'xml',
        type:'POST',
        url:'https://gdata.youtube.com/feeds/api/users/default/playlists',
        headers:generateCPHeaders(),
        processData:false,
        data:dataXml,
        success:function (responseXml) {

            var global = $.xml2json(responseXml);
            // console.log(global.playlistId);
            playId = global.playlistId;

        },
        error:function () {
            alert("failed, please report as bug");
        }

    });
}

function pushAlltoPlaylist(playlistID) {
    var dataXml, link, videoID;
    var myurl = 'https://gdata.youtube.com/feeds/api/playlists/' + playlistID;
    for (var i = 1; i <= localStorage.length - 2; i++) {
        abc = localStorage.getItem(i + '');
        abc = $.parseJSON(abc);
        link = abc.link;
        videoID = getIdfromlink(link);

        dataXml = '<?xml version="1.0"?> <entry xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://gdata.youtube.com/schemas/2007"><id>' + videoID + '</id><yt:position>' + i + '</yt:position></entry>';
        $.ajax({
            datatype:'xml',
            type:'POST',
            url:myurl,
            headers:generateCPHeaders(),
            processData:false,
            data:dataXml,
            success:function (responseXml) {

                console.log("success");

            },
            error:function () {
                alert("failed, please report as bug");
            }

        });

    }
}

function getIdfromlink(link) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = link.match(regExp);
    if (match && match[2].length == 11) {
        return match[2];
    } else {
        //error
    }
}

function getDiscription() {

    var obj = {"Eargasm":[]};
    var abc, artist, track;
    for (var i = 1; i <= localStorage.length - 2; i++) {
        abc = localStorage.getItem(i + '');
        abc = $.parseJSON(abc);
        artist = abc.name;
        track = abc.trackSearched;
        //starts from indice 0
        obj.Eargasm[i - 1] = {"artist":artist, "track":track};
    }

    var desc = JSON.stringify(obj);
    return desc;
}


function getPlaylistforUser() {
    var myurl = 'https://gdata.youtube.com/feeds/api/users/default/playlists?v=2&alt=json';

    $.ajax({

        dataType:'json',
        type:'GET',
        url:myurl,
        headers:generateYouTubeApiHeaders(),
        success:function (responseJson) {
            //console.log(responseJson);
            var entry;
            var count = 0;
            $('.myplaylists ul').empty();
            for (var i = 0; i < responseJson.feed.entry.length; i++) {
                entry = responseJson.feed.entry[i];
                if (entry.summary.$t.toLowerCase().search("eargasm") != -1) {
                    count = count + 1;
                    //validate ith
                    //show this playlist - remember to get the playlistID
                    var Id = entry.yt$playlistId.$t;
                    var desc = entry.summary.$t;
                    var title = entry.title.$t;
					console.log(Id);
                    //add this  playlist to myplaylists
                    var addIt = '<li> <a href="#" id="sharePlaylists" playId="'+ Id+ '">&nbsp;&nbsp;</a><a id="myplaylistsAnchor" title="' + title + '" playId="' + Id + '">' + title + '</a> </li>';
                    $('.myplaylists ul').append(addIt);
                }
            }
            console.log(count);

        }

    })

}


var playId;
var currentPlaylistname;
function savePlaylist() {
    if (gapi.auth.getToken() != null) {
        var answer = prompt("Give a title for playlist", "");
        createPlaylist(escapeXmlEntities(answer));
        //console.log(playlistId);
        currentPlaylistname = answer;
        setTimeout("pushAlltoPlaylist(playId)", 5000);

        var obj = getUtilityObj();
        obj.playlist = currentPlaylistname;
        localStorage.setItem("currentState", JSON.stringify(obj));
		
		//refresh playlists
        getPlaylistforUser();
    }
    else if (localStorage.length <= 2) {
        alert("nothing in playlist");
    }
    else {
        alert("you need to Sign IN before u can save");
    }
}


function deletePlaylist(id) {
//        var myurl =
}


function updateDescription(playlistId){

    var myurl = 'https://gdata.youtube.com/feeds/api/users/default/playlists/' + playlistId;
    var name = escapeXmlEntities(currentPlaylistname);
    var descrip = escapeXmlEntities(getDiscription());
    var dataXml = '<?xml version="1.0"?> <entry xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://gdata.youtube.com/schemas/2007"><title type="text">' + name + '</title><summary>' + descrip + '</summary></entry>';

    $.ajax({
            datatype:'xml',
            type:'PUT',
            url: myurl,
            headers:generateCPHeaders(),
            processData:false,
            data:dataXml,
            success:function (responseXml) {
                   console.log("updated");
            },
            error:function () {
                alert("failed, please report as bug");
            }

        });

}

function AddoneToPlaylist(playlistId, url) {

            videoID = getIdfromlink(url);
            var myurl = 'https://gdata.youtube.com/feeds/api/playlists/' + playlistID;
            var position = localStorage.length-1;
            dataXml = '<?xml version="1.0"?> <entry xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://gdata.youtube.com/schemas/2007"><id>' + videoID + '</id><yt:position>' + position+ '</yt:position></entry>';
            $.ajax({
                datatype:'xml',
                type:'POST',
                url:myurl,
                headers:generateCPHeaders(),
                processData:false,
                data:dataXml,
                success:function (responseXml) {

                    console.log("success");

                },
                error:function () {
                    alert("The addedsong couldnt be saved in ur playlist, report as bug");
                }

            });

}


function fetchAllsongs(playlistId){
    reset();
   var myurl = 'https://gdata.youtube.com/feeds/api/playlists/' + playlistId +'?v=2';
   var artist, track, link,videoId;
   $.ajax ({
       datatype:'xml',
       type:'GET',
       url:myurl,
       success: function(res){
          // console.log(res);
           var obj = $.xml2json(res)
            //console.log($(res).find("subtitle").text());
          // /console.log(res.data.description);
           //get description
           var desc = obj.subtitle;
           desc = $.parseJSON(desc);
           // get links
           for (var i=0;i<obj.entry.length;i++){
             artist = desc.Eargasm[i].artist;
             track = desc.Eargasm[i].track;
             link = obj.entry[i].link[0].href;
             videoId=getIdfromlink(link);
              link = IdToLink(videoId);
            //   console.log(artist + track + link);
               addthistoplaylist(artist,track,link);
           }
           //add to empty playlist
       }
   })

  //modify current playId variable
    playId = playlistId;

}


function IdToLink(videoId){
    return ('http://www.youtube.com/v/'+ videoId + '?version=3&f=videos&app=youtube_gdata');
}

//