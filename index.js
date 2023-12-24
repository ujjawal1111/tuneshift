const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
app.use(express.json()); // This parses JSON
const passport = require("passport");
const session = require('express-session');
//const GoogleStrategy = require("passport-google-oauth20").Strategy;
//const fetch = require('node-fetch');

const CLIENT_ID = '608f93ae25dd4fd6be9ac36ee761a8ef';
const REDIRECT_URI = 'http://localhost:3000/spotify-callback';
const CLIENT_SECRET = 'c5e18864618744df8b94493bb4029ec9';
const YTM_API_KEY = 'AIzaSyDGfzGghC31EVH0OuuUrZuCqOEzABf3oEs';
const GOOGLE_CLIENT_ID='44802528841-m8du3hasop1g9l49k7jmk37kbjli3v8p.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET='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';
const GOOGLE_REDIRECT_URI='http://localhost:3000/google-callback';

 
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

let spotify_accessToken;
let google_accessToken;

app.get('/spotify-auth', (req, res) => {
  const spotifyAuthUrl = 'https://accounts.spotify.com/authorize' +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${REDIRECT_URI}` +
    `&scope=user-read-private user-read-email` +
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
      `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${REDIRECT_URI}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;
    spotify_accessToken = access_token;
    console.log('Spotify Access Token is',spotify_accessToken);

    // Send the tokens back to the frontend if needed
    res.json({ access_token, refresh_token });
  } catch (error) {
    console.error('Error exchanging code for tokens:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user-playlists', async (req, res) => {
  try {
    // Assume you have stored the user's access token in the session or request headers
   // const accessToken = req.headers.authorization.split(' ')[1];

    // Make a request to Spotify API to get the user's playlists
    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${spotify_accessToken}`,
      },
    });

    const playlists = response.data.items;
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching user playlists:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/google-auth-url', (req, res) => {
  // Construct the Google OAuth URL on the backend
  
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&scope=https://www.googleapis.com/auth/youtube&response_type=code`;

  res.json({ authUrl });
});

app.post('/google-exchange-token', async (req, res) => {
  const { code } = req.body;

  try {
    // Exchange authorization code for access token
    const response = await axios.post(
      'https://oauth2.googleapis.com/token',
      `code=${code}&client_id=${GOOGLE_CLIENT_ID}&client_secret=${GOOGLE_CLIENT_SECRET}&redirect_uri=${GOOGLE_REDIRECT_URI}&grant_type=authorization_code`
    );

    google_accessToken = response.data.access_token;
    console.log('Google Access Token:', google_accessToken);

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
        Authorization: `Bearer ${spotify_accessToken}`, // Use your Spotify access token here
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


// app.post('/transfer-to-youtube-music', async (req, res) => {
//   try {
//     const { playlistName } = req.body;

//     if (!playlistName) {
//       return res.status(400).json({ error: 'Playlist name is required' });
//     }

//     const data = {
//       snippet: {
//         title: playlistName,
//         description: 'made using tuneshift'
//       }
//     };

//     const config = {
//       url: 'https://www.googleapis.com/youtube/v3/playlists?part=id,snippet&key=AIzaSyDGfzGghC31EVH0OuuUrZuCqOEzABf3oEs',
//       method: 'post',
//       headers: { 
//         'Content-Type': 'application/json', 
//         'Authorization': 'Bearer ya29.a0AfB_byDkQfDf4Bu2KULsTKaYBXsEoPG3QaqlBI0LtbUoYwJQx1VQIeq_LXMFpdGCHQRzK4fXoj4gLN7Qs1Yh2NG8bPaya9AxHGyEPYKu6EU0hgiwsaRK2LDyZNvMwKL-SFOkPeFul1sUn-4J5Zp1kzqBIeEvQlfubSyYAMAaCgYKAWQSARMSFQHGX2Mi1d40mRlpbwP4O_R1Z4lhow0174', 
//       },
//       data: JSON.stringify(data)
//     };

//     // Await the axios.post call to get the response
//     const response = await axios.post(config.url, config.data, { headers: config.headers });

//     console.log(JSON.stringify(response.data));
//     res.json({ message: 'Playlist creation successful' });
//   } catch (error) {
//     console.error('Error creating YouTube playlist:', error.message); // Log the error message
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// });

let createdPlaylistId, videoresultid;

app.post('/temp-playlist-create', async (req, res) => {
  try {
    //// 1. Create Playlist with the same name on YouTube
    let songArray = req.body.songarray;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${google_accessToken}`);
    let pName = req.body.pName;

    const raw = JSON.stringify({
      snippet: {
        title: pName,
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
    res.json(createPlaylistResult); // Send the result as a response to the client

    //// 2. Search for Tracks in SongArray on YouTube
    for (const song of songArray) {
      let searchquery = `${song.name} ${song.artist}`;
      const requestOptionsSearch = {
        method: 'GET',
        redirect: 'follow',
      };

      const searchResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${YTM_API_KEY}&q=${searchquery}&type=video&part=snippet&maxResults=1`, requestOptionsSearch);
      const searchData = await searchResponse.json();

      const videoresultid = searchData.items[0].id.videoId;

      //// 3. Insert top result to created playlist
      const myHeader = new Headers();
      myHeader.append("Content-Type", "application/json");
      myHeader.append("Authorization", `Bearer ${google_accessToken}`);

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


 


  


app.post('/logout', (req, res) => {
  // Assuming you store the access and refresh tokens, you might clear them here
  // accessToken = null;
  // refreshToken = null;

  // Perform any other cleanup necessary for your application

  res.json({ message: 'Logout successful' });
});

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: GOOGLE_REDIRECT_URI,
//        passReqToCallback: true,
//     },
//     (accessToken, refreshToken, profile, done) => {
//       // You can save user information to your database here
//       return done(null, profile);
//     }
//   )
// );

// Serialize user information to store in the session
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });
// app.use(
//   session({
//     secret: 'jhgjhgjhgvjhgjhjkhkj', // Replace with a strong secret key
//     resave: true,
//     saveUninitialized: true,
//   })
// );
// // Use Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// Routes
// app.get(
//   "/google-oauth-login",
//   (req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header("Access-Control-Allow-Credentials", true);
//     next();
//   },
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// app.get(
//   "/google-callback",
//   (req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header("Access-Control-Allow-Credentials", true);
//     next();
//   },
//   passport.authenticate("google", { failureRedirect: "/" }),
//   (req, res) => {
//     // Successful authentication, redirect or send response as needed
//     res.redirect("/");
//   }
// );


app.get('/google-oauth-login', (req, res) => {
  // Redirect the user to Google's OAuth consent screen
  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&scope=profile email&response_type=code`;
  res.redirect(authUrl);
});

// Route to handle the callback from Google after the user grants/denies permission
// Route to handle the callback from Google after the user grants permission

// app.post('/google-exchange-token', async (req, res) => {
//   const { code } = req.body;

//   try {
//     console.log('Received authorization code from frontend:', code);

//     // Exchange the authorization code for an access token
//     const tokenResponse = await axios.post(
//       'https://accounts.google.com/o/oauth2/token',
//       `code=${code}&client_id=${GOOGLE_CLIENT_ID}&client_secret=${GOOGLE_CLIENT_SECRET}&redirect_uri=${GOOGLE_REDIRECT_URI}&grant_type=authorization_code`
//     );

//     const googleAccessToken = tokenResponse.data.access_token;

//     // Log the Google access token
//     console.log('Google Access Token:', googleAccessToken);

//     // Fetch user information using the access token
//     const userResponse = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
//       headers: { Authorization: `Bearer ${googleAccessToken}` },
//     });

//     const user = userResponse.data;

//     // Store user information in the session or your database as needed
//     // req.session.user = user;

//     // Log user information
//     console.log('User Information:', user);

//     // Send a response or perform further actions as needed
//     res.json({ message: 'Google OAuth token exchange successful', user });
//   } catch (error) {
//     console.error('Error during Google OAuth token exchange:', error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// app.post('/transfer-to-youtube-music/:spotifyPlaylistId', async (req, res) => {
//   const spotifyPlaylistId = req.params.spotifyPlaylistId;

//   try {
//     const spotifyResponse = await axios.get(`https://api.spotify.com/v1/playlists/${spotifyPlaylistId}`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     const spotifyPlaylist = spotifyResponse.data;

//     const youtubePlaylistResponse = await axios.post(
//       'https://youtube.googleapis.com/youtube/v3/playlists',
//       {
//         snippet: {
//           title: spotifyPlaylist.name,
//         },
//       },
//       {
//         params: {
//           part: 'snippet',
//           key: YTM_API_KEY,
//         },
//       }
//     );

//     const youtubePlaylistId = youtubePlaylistResponse.data.id;

//     for (const track of spotifyPlaylist.tracks.items) {
//       const youtubeSearchResponse = await axios.get(
//         'https://youtube.googleapis.com/youtube/v3/search',
//         {
//           params: {
//             q: `${track.track.name} ${track.track.artists[0].name}`,
//             part: 'snippet',
//             type: 'video',
//             key: YTM_API_KEY,
//           },
//         }
//       );

//       const firstResult = youtubeSearchResponse.data.items[0];

//       if (firstResult) {
//         const youtubeVideoId = firstResult.id.videoId;

//         await axios.post(
//           `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet`,
//           {
//             snippet: {
//               playlistId: youtubePlaylistId,
//               resourceId: {
//                 kind: 'youtube#video',
//                 videoId: youtubeVideoId,
//               },
//             },
//           },
//           {
//             params: {
//               part: 'snippet',
//               key: YTM_API_KEY,
//             },
//           }
//         );
//       }
//     }

//     const youtubePlaylistDetailsResponse = await axios.get(
//       `https://youtube.googleapis.com/youtube/v3/playlists/${youtubePlaylistId}`,
//       {
//         params: {
//           part: 'snippet',
//           key: YTM_API_KEY,
//         },
//       }
//     );

//     const youtubePlaylistDetails = youtubePlaylistDetailsResponse.data.snippet;

//     res.json({
//       message: 'Playlist transfer to YouTube Music completed!',
//       youtubePlaylist: {
//         id: youtubePlaylistId,
//         title: youtubePlaylistDetails.title,
//         description: youtubePlaylistDetails.description,
//       },
//     });
//   } catch (error) {
//     console.error('Error transferring playlist to YouTube Music:', error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// Check if both tokens exist in your server variables
// if (accessToken && google_accessToken) {
//   console.log(accessToken);
//   console.log('new');
//   console.log(google_accessToken);
// }



app.listen(5005, () => {
  console.log('Server is running on port 5005');
});
