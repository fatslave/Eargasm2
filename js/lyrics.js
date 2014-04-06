function lyrics(artist,song) {
			//var song = data.bq2.value || 'Metallica',artist = data.bq1.value || 'Nothing Else Matters';	
			//$("#lyrics).empty();	
			
			//artist = artist.toLowerCase();
			//song = song.toLowerCase();

            if ($("#discolist").is(':visible') && $("#lyrics").is(':visible')) {
                            $("#discolist").css({'top':'60%', 'height':'38%'});
            }

			var resultsQuery = 'USE \'http://www.datatables.org/google/google.search.xml\' AS google.search; ' +
					'SELECT unescapedUrl, titleNoFormatting FROM google.search ' +
					'WHERE q="'+artist+' '+song +' site:http://lyrics.wikia.com/"';
					
				$.ajax({
					'url' : 'http://query.yahooapis.com/v1/public/yql?format=json',
					'data' : {'q': resultsQuery},
					'dataType' : 'jsonp',
					'jsonp' : 'callback',
					'jsonpCallback' : 'processResults'
				});
			};

	
			
processResults = function(res)	{
		var query = res.query,
					results = query.results.results,
					url = results[0].unescapedUrl;
		getLyricsContent(url);
};

getLyricsContent = function(href) {
				var xpath = '//div[@class=\'lyricbox\']//p';
				var charset =  'utf-8';
				var getLyricsQuery = 'SELECT * FROM html WHERE url="' + href + '" AND xpath="'+xpath +'" AND charset="'+charset +'"';
				
				$.ajax({
					'url' : 'http://query.yahooapis.com/v1/public/yql?format=xml',
					'data' : {'q': getLyricsQuery},
					'dataType' : 'jsonp',
					'jsonp' : 'callback',
					'jsonpCallback' : 'processLyrics'
				});
			};	
processLyrics = function(res)	{
	var results = res.results[0];
	$('#lyrics').html(results || 'No lyrics found');
};	


	