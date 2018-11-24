  # Requirements
  The assignment consists of building an Audio library/player 📻:
  The backend will serve the library (list of songs with metadata), while
  the frontend will display the library and play the songs.

  You'll be building this in two steps with discussion in between:
  Step 1 covers the skeleton of backend and takes ~1.5 hours
  Step 2 is about actually building it out and takes ~4 hours

  Backend:
  The backend should be written in Node.js and would be used as an API for serving songs and songs metadata.

  Frontend:
  The frontend should be written in React and use some UI library to help the task (Material-ui preferred but any other clean UI lib can be used).
  The "app" should be a single page app which should display the complete music library and a player (think about a very simple iTunes).

  Storage of songs/metadata:
  Songs can be stored in a directory in the backend.
  Metadata can be stored as JSON in a directory in the backend

  Bonus:
  Any bonus will be valued when we will review your code.

  How to score bonus points during the test:
  Frontend uses Redux.
  Songs are stored/retrieved from some network storage (dropbox, drive, s3).
  Metadata could be fetched from some external API instead of being statically stored in a JSON file.
  Usage of websockets in order to implement some live information on what other users are listening (you are free to display that however you prefer).

  ## Assignment:
  Time: 4-5h

  Build the frontend of the app and modify the backend to support all the functionality mentioned in the spect above.
 Websocket implementation for live "What others are listening to"