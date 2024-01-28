const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json()); 
// const passport = require("passport");
// const session = require('express-session');
// const jwt = require('jsonwebtoken');
require('dotenv').config();



 
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

let spotifyAccessToken;
let googleAccessToken;

app.get('/spotify-auth', (req, res) => {
  const spotifyAuthUrl = 'https://accounts.spotify.com/authorize' +
    `?client_id=${process.env.CLIENT_ID}` +
    `&redirect_uri=${process.env.REDIRECT_URI}` +
    `&scope=user-read-private user-read-email playlist-read-private 
playlist-read-collaborative` +
    `&response_type=code`;

  res.json({ spotifyAuthUrl });
});

app.post('/spotify-callback', async (req, res) => {
  const authorizationCode = req.body.code;
  console.log('auth code from frontend',authorizationCode);

  try {
    // Exchange authorization code for access token and refresh token
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${process.env.REDIRECT_URI}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
        },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;
    spotifyAccessToken = access_token;
    res.cookie('spotifyAccessToken', spotifyAccessToken, { httpOnly: true, secure: true });
    res.send('Cookie set successfully');
    console.log('Spotify Access Token is',spotifyAccessToken);

    // Send the tokens back to the frontend if needed
   // return res.json({ access_token, refresh_token });
  } catch (error) {
    console.error('Error exchanging code for tokens:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user-playlists', async (req, res) => {
  try {
    // Make a request to Spotify API to get the user's playlists
    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${req.cookies.spotifyAccessToken}`,
      },
    });

    const playlists = response.data.items;
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching user playlists:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/google-auth-url', (req, res) => {
  // Construct the Google OAuth URL on the backend
  
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&scope=https://www.googleapis.com/auth/youtube&response_type=code`;

  res.json({ authUrl });
});

app.get('/check-google-access-token', (req, res) => {
  // Check if the user is already logged in by checking for the presence of the Google access token cookie
  const isLoggedIn = req.cookies.googleAccessToken ? true : false;
  res.json({ isLoggedIn });
});

app.get('/check-spotify-login', (req, res) => {
  // Check if the Spotify access token cookie is present in the request
  const spotifyAccessToken = req.cookies.spotifyAccessToken;

  if (spotifyAccessToken) {
    // The user is considered logged in
    res.json({ loggedIn: true });
  } else {
    // The user is not logged in
    res.json({ loggedIn: false });
  }
});

app.post('/google-exchange-token', async (req, res) => {
  const { code } = req.body;

  try {
    // Exchange authorization code for access token
    const response = await axios.post(
      'https://oauth2.googleapis.com/token',
      `code=${code}&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&grant_type=authorization_code`
    );

    googleAccessToken = response.data.access_token; 
    res.cookie('googleAccessToken', googleAccessToken, { httpOnly: true, secure: true });
    
    console.log('Google Access Token:', googleAccessToken);

    // You can now use the access token as needed

    res.status(200).json({ google_accessToken });
  } catch (error) {
    console.error('Error exchanging code for Google access token:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get-playlist-details/:playlistId', async (req, res) => {
  const playlistId = req.params.playlistId;

  try {
    // Make a request to the Spotify API to get details of the selected playlist
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${req.cookies.spotifyAccessToken}`, // Use your Spotify access token here
      },
    });

    const playlistDetails = response.data;

    // Optionally, you can filter out only the information you need before sending it to the client
    const simplifiedDetails = {
      name: playlistDetails.name,
      tracks: playlistDetails.tracks.items.map(track => ({
        name: track.track.name,
        artist: track.track.artists[0].name,
      })),
    };

    res.json(simplifiedDetails);
  } catch (error) {
    console.error('Error fetching playlist details:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



let createdPlaylistId, videoresultid;

app.post('/temp-playlist-create', async (req, res) => {
  try {
    //// 1. Create Playlist with the same name on YouTube
    let songArray = req.body.songarray;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${req.cookies.googleAccessToken}`);
    let pName = req.body.pName;

    const raw = JSON.stringify({
      snippet: {
        title: pName,
        description:"Made Using Tuneshift"
      },
    });

    const requestOptionsCreatePlaylist = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    const createPlaylistResponse = await fetch("https://www.googleapis.com/youtube/v3/playlists?part=id,snippet&key=YOUR_API_KEY", requestOptionsCreatePlaylist);
    const createPlaylistResult = await createPlaylistResponse.json();

    console.log(createPlaylistResult);
    const createdPlaylistId = createPlaylistResult.id;


     const playlistUrl = `https://www.youtube.com/playlist?list=${createdPlaylistId}`;
    console.log("URL is",playlistUrl);
    res.json({ playlistUrl, createPlaylistResult });


    //// 2. Search for Tracks in SongArray on YouTube
    for (const song of songArray) {
      let searchquery = `${song.name} ${song.artist}`;
      const requestOptionsSearch = {
        method: 'GET',
        redirect: 'follow',
      };

      const searchResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${process.env.YTM_API_KEY}&q=${searchquery}&type=video&part=snippet&maxResults=1`, requestOptionsSearch);
      const searchData = await searchResponse.json();

      const videoresultid = searchData.items[0].id.videoId;

      //// 3. Insert top result to created playlist
      const myHeader = new Headers();
      myHeader.append("Content-Type", "application/json");
      myHeader.append("Authorization", `Bearer ${req.cookies.googleAccessToken}`);

      const rawPlaylistItem = JSON.stringify({
        "snippet": {
          "playlistId": `${createdPlaylistId}`,
          "resourceId": {
            "kind": "youtube#video",
            "videoId": `${videoresultid}`,
          },
        },
      });

      const requestOptionsPlaylistItem = {
        method: 'POST',
        headers: myHeader,
        body: rawPlaylistItem,
        redirect: 'follow',
      };

      const playlistItemResponse = await fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,id,snippet,status", requestOptionsPlaylistItem);
      const playlistItemResult = await playlistItemResponse.json();

      console.log(playlistItemResult);
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


 


  


app.post('/google-logout', (req, res) => {
    googleAccessToken=null;
    res.clearCookie('googleAccessToken').json({ message: 'Google logout successful' });
});

app.post('/spotify-logout', (req, res) => {
    spotifyAccessToken=null;
    res.clearCookie('spotifyAccessToken').json({ message: 'Spotify logout successful' });
});





app.listen(5005, () => {
  console.log('Server is running on port 5005');
});
