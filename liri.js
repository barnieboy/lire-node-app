var command = process.argv[2];


var spotify = require('spotify');
var omdb = require('omdb');
var fs = require("fs");
var Twitter = require('twitter');


var albumObj = {};
var movieObj = {};


var myKeys = require('./keys');
var myTokens = myKeys.twitterKeys;
var myConsKey = myTokens.consumer_key;
var myConsSec = myTokens.consumer_secret;
var myAccToKey = myTokens.access_token_key;
var myAccToSec = myTokens.access_token_secret;
 
var client = new Twitter({
  consumer_key: myConsKey,
  consumer_secret: myConsSec,
  access_token_key: myAccToKey,
  access_token_secret: myAccToSec
});


var params = {screen_name: 'Tadesse', count: 20};



function liriBot() {
if (command === "my-tweets") {
	logCommand(command);
	myTweets();
} else if (command === "spotify-this-song") {
	logCommand(command);
	var songName = process.argv[3];
		if (songName === undefined) {
			songName = "The Sign";
			var artist = "Ace of Base";
			defaultSongResults(songName, artist);
		} else {
			songSearch(songName);
		}
} else if (command === "movie-this") {
	logCommand(command);
	var movie = process.argv[3];
		if (movie === undefined) {
			movie = "Mr. Nobody";
			movieSearch(movie);
		} else {
			movieSearch(movie);
		}
} else if (command === "do-what-it-says") {
	logCommand(command);
	doWhatItSays();
}
}

function myTweets(){
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	console.log("Tweets will be loaded here");
	    for (var i = 0; i < tweets.length; i++) {
	    console.log("=========================");
	    console.log("Date " + tweets[i].created_at);
	    console.log(tweets[i].text);
		}
	  }
	});	
}

 
function songSearch(song){
	spotify.search({ type: 'track', query: song }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    } else {
		    
		    var albumInfo = data.tracks.items;
		    
		    albumObj.songName = song;
		    var previewUrl = albumInfo[0].preview_url;
		    albumObj.previewUrl = albumInfo[0].preview_url;
		    var albumName = albumInfo[1].album.name;
		    albumObj.albumName = albumInfo[1].album.name;
		    var artist = albumInfo[0].artists;
		    albumObj.artist = artist[0].name;
		    
		    console.log("=========ALBUM-INFO=============");
		    console.log(albumObj);
		}
	});
}


function defaultSongResults(song, band){
	spotify.search({ type: 'artist', query: band} && { type: 'track', query: song}, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    } else {
	    	albumObj.songName = song;
	    	albumObj.albumName = "The Sign (US Album) [Remastered]";
	    	albumObj.previewUrl = 'https://p.scdn.co/mp3-preview/5T7q4f8VHnXYf9R8Cmq1mu7NCvcV4Of4X1pQCKuaF3L9E?cid=null';
	    	albumObj.artist = band;
    		console.log(albumObj);
		}
	});
}


function movieSearch(title) { 
	omdb.search(title, function(err, movies) {
	    if(err) {
	        return console.error(err);
	    }
	 
	    if(movies.length < 1) {
	        return console.log("No movies found. Please try another movie.");
	    }
	     
	    for (var i = 0; i < movies.length; i++) {
	        	omdb.get({ title: movies[i].title, year: movies[i].year }, true, function(err, movie) {
    				if(err) {
        			return console.error(err);
    				}
    				    if(!movie) {
    				    	return console.log("No movies found. Please try another movie");
					    }
					    console.log("=================");
					    ot into Object - movieObj
					    var movieTitle = movie.title;
					    var year = movie.year;
					    var imdbRating = movie.imdb.rating;
					    var actors = movie.actors;
					    var countries = movie.countries;
					    var plot = movie.plot;
					    movieObj.movieTitle = movie.title;
					    movieObj.movieTitle = movie.title;
					    movieObj.year = movie.year;
					    movieObj.imdbRating = movie.imdb.rating;
					    movieObj.actors = movie.actors;
					    movieObj.countries = movie.countries;
					    movieObj.plot = movie.plot;
					    
					    console.log(JSON.stringify(movieObj, null, 2));

	    		});
    	}
    });
}
 
function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(err, data) {
	  
	  var output = data.split(",");
	   
	    command = output[0];
	    readFileSong = output[1];
	    process.argv[3] = readFileSong;
	    liriBot();
	});
}
function logCommand(entry) {
  // Add the command value to the log file.
  fs.appendFile("log.txt", ", " + entry);
}