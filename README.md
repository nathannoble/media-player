# media-player
Media Player in Node.js, Express, Redux and React

### Pre-requisites:
* Node.js
* NPM

### To Run:
* Clone the repo
* cd to media-player/backend
* run npm install
* run node server.js

### Sample API calls
* localhost:5000/api/v1/genre/jazz/songs
* localhost:5000/api/v1/artists/1/songs
* localhost:5000/api/v1/songs

### Sample play the mp3
* Open the frontend/index.html in chrome or any browser

### TODOs for Improvements
* Add testing using mocha or other
* Add logging such as morgan
* Add more error handling such as when the data file is not present or corrupted
* Use a database backend for storing the metadata
* Use server side caching like AWS Elasticache for static data
* Add auth (i.e. user registration and sign on to restrict access)
* Add security (i.e. Use TLS, Helmet, protect session cookies, CSRF, etc.)
* Other features
