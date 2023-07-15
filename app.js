require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();
app.use(express.static("public"));

// require spotify-web-api-node package here:

// credentials are optional
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// Our routes go here:
app.get("/", (req, res) => {
  res.render("home");
});

//http://localhost:3000/artist-search?artist=nombredelartista
app.get("/artist-search", (req, res) => {
  let artistName = req.query.artist;

  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      //data representa la respuesta de la appi
      res.render("artists.hbs", { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );

  // res.send(artistName);
});

//http://localhost:3000/albums/23439847239
app.get("/albums/:idArtista", (req, res) => {
  let artistid = req.params.idArtista;
  spotifyApi
    .getArtistAlbums(artistid)
    .then((data) => {
      res.render("artist-search-results.hbs", { albums: data.body.items });

      // console.log("Artist albums", data.body);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/tracks/:albumId", (req, res) => {
  let albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => { 
       res.render("album-tracks.hbs", { tracks: data.body.items }); 
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
