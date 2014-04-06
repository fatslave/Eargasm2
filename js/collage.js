var lastfm = new LastFM({
		apiKey    : '6572dfc58ea6579033dfa2fcc1280422',
		apiSecret : '50ac009bb3c27911f366f0f533b667e0'
		//cache     : cache
	});

var callfromtop=0; //if user clicks the getcollage button.
function collage(artist) {
    var obj=getUtilityObj();
    if ((obj.artist != obj.lastart || !$('#box').is(':visible')) || callfromtop==1) {

	lastfm.artist.getSimilar({artist:artist, limit:30},{
					success: function(res1){
						//get similar artists
						var similarArtists = res1.similarartists.artist;
						var img;
						for (var i=0;i<29;i++){
							// find an image for this artist
							//img = similarArtists[i].image[3].text;
							//processUrl(img, similarArtists[i].name,i);
							imaged(similarArtists[i].name,i);
						}
					},
					error: function(code, message){
						}
			});

    }
    if(callfromtop==1){callfromtop==0;}


   // obj.lastart = artist; //get last artist
   // localStorage.setItem("currentState", JSON.stringify(obj));
}
function imaged(artist,i) {
	$("#container").empty();
	var my_url = 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q="'+artist+'"&imgsz=medium&alt=json&max-result=3'
	var url;
	$.ajax({
					'url' : my_url,
					'dataType' : 'jsonp',
					'jsonp' : 'callback',
					//timeout:2000,
					success: function(res){
							var data = res.responseData.results;
							url=data[1].unescapedUrl;	
							processUrl(url,artist,i);
					}
	});
	
}

function processUrl(url,artist,i)	{
	newY = randomFromTo(1, 70);
    newX = randomFromTo(1, 70);
	var b="box"+i;
	$("#container").append('<img id="'+b+'" name="'+artist+'" title="'+artist+'" style="position:absolute; top:'+newY+'%; left:'+newX+'%;" class="box" src='+url+' />');
}


function randomFromTo(from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function getTopTracks(artist) {
	$("#videos").empty();
	lastfm.artist.getTopTracks({artist:artist, limit:15},{
					success: function(res1){
						//get songs
                        //var playerUrl;
						var length = res1.toptracks.track.length;
						for(var i=0;i<length;i++) {
							var track=res1.toptracks.track[i].name;
							findOneVideo(artist,track);


                        }



                    }
    });
    $("#videos").show();
}


//appends this artist, track and link to videos listing
function addthistoVideos(artist, track,tlink)
{
    //console.log(tlink);
    var title = artist+"-"+	track;
    var local = '<ul><li><p><a link="'+tlink+'" artist="'+artist+'" track="'+track+'" id="1" class="play" href="#">&nbsp;</a><a class="addToPlaylist" artist="'+artist+'" track="'+track+'" mp3link="'+tlink+'" title="'+title+'" href="#"><img src="../images/add.png" /></a>';
    local += ''+title+'</p></li></ul>';
    //console.log(local);
    $("#videos").append(local);
}

//appends a track to playlist
function addthistoplaylist(artist,track,tlink)
{
    var title = artist+"-"+	track;
    var myobj = {'name':artist, 'trackSearched':track, 'tracks':title,'link':tlink};
    console.log(myobj);
    var jsonString = JSON.stringify(myobj);
    localStorage.setItem(localStorage.length-1, jsonString);
    loadplaylist();
}

//puts all the files from videos to a playlist
function SendAlltoPlaylist()
{
    var count=0;

    //test if there is something to send?
    if ($("#videos").is(":visible"))  {
    //console.log("visible");
   // do i want my playlist to be empty?
    $(".play").each( function(){
        var link = $(this).attr('link');
        var artist = $(this).attr('artist');
        var track = $(this).attr('track');

        //console.log(link);
        var title = artist+"-"+	track;
        var myobj = {'name':artist, 'trackSearched':track, 'tracks':title,'link':link};
        //console.log(myobj);
        var jsonString = JSON.stringify(myobj);
        localStorage.setItem(localStorage.length-1, jsonString);

        count = count+1;
    })

    loadplaylist();
    $.jGrowl("added" +count+ " tracks to playlist");
    }
    else
    {
        $.jGrowl("nothing to transfer")
    }
};




var AutoplaylistId = ['FFDA7F1CE2861BA5', 'A30148708BD6517A','E133D52E1F98D298','7A2E487AA18F9F0C',' D1407892F2A445B7'];
var PlaylistName = ['From TV series', 'Fathers day special','Popular This Week!', 'Misc Rock', 'Linkin Park: Living Things[2012]'];


function LoadOnStartup()
{	
	//show all the playlists with name
	for(var i=0;i<AutoplaylistId.length;i++){
			var anchorElem = '<a href="#" class="playPS" PlayId="'+AutoplaylistId[i]+'">&nbsp;</a><p>'+PlaylistName[i]+ '</p>';
			$('#selectedPS').append(anchorElem);
	}
}
