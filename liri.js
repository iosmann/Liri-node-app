require("dotenv").config();


var keys = require("./keys.js");
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var fs = require("fs");

var nodeArgv = process.argv;
var action = process.argv[2];

var title = "";

for (let i = 3; i < nodeArgv.length; i++) {
    if (i > 3 && i < nodeArgv.length) {
        title = title + "+" + nodeArgv[i];
    } else {
        title += nodeArgv[i];
    }
};



switch (action) {
    case "my-tweets":
        tweets();
        break;

    case "spotify-this-song":
        if (title) {
            spotifySong(title)
        } else {
            spotifySong("The Sign")
        };
        break;

    case "movie-this":
        if (title) {
            movieThis(title)
        } else {
            movieThis("Mr Nobody")
        };
        break;

    case "do-what-it-says":
        doIt();
        break;
}


function tweets() {
    var params = {
        screen_name: "iosmann"
    };
    client.get("statuses/user_timeline", params, function (error, tweets, response) {
        if (!error) {
            for (let i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                console.log("@iosmann: " + tweets[i].text + "Created at: " + date);
                console.log("----------------------");

                fs.appendFile("log.txt", '@iosmann: ' + tweets[i].text + "Created at: " + date)
                // fs.appendFile("log.txt", '--------------------');
            }
        } else {
            console.log("An error occured. Tweet better content.");

        }
    });
};


function spotifySong(title) {
    spotify.search({
        type: "track",
        query: title
    }, function (err, data) {
        if (err) {
            return console.log("Error occurred: " + err);
        } else {
            for (let i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];
                console.log("Artists: " + songData.artists[0].name);
                console.log("Song: " + songData.name);
                console.log("Preview: " + songData.preview_url);
                console.log("Album: " + songData.album.name);


            }


        }
    });
};


function movieThis(title) {
    var queryURL = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy"

    console.log(queryURL);

    request(queryURL, function (err, response, body) {
        if (!err && response.statusCode === 200) {
            var body = JSON.parse(body);

            console.log("Title: " + body.Title);
            console.log("Year: " + body.Year);
            console.log("IMDB Rating: " + body.imdbRating);
            console.log("Rotten Tomatoes Rating: " + body.Ratings[1].Value);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);

        } else {
            console.log("An error has occured");
        }
    });
};


function doIt() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        var text = data.split(",")
        var search = text[1]
        spotifySong(search);
    })
};