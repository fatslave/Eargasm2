var AutoplaylistId = ['PLFFDA7F1CE2861BA5', 'PLA30148708BD6517A','PLE133D52E1F98D298','PL7A2E487AA18F9F0C'];
var PlaylistName = ['From TV series', 'Fathers day special','Popular This Week!', 'Misc Rock'];


function LoadOnStartup()
{
	//show all the playlists with name
	for(var i=0;i<AutoPlaylistId.length;i++){
			var anchorElem = '<a href="#" PlayId="'+AutoplaylistId[i]+'"><p>'+PlaylistName[0]+ '</p></a>';
			$('#PlaylistStartup').append(anchorElem);
	}
			
}
