# Song Lyrics 

A web application for searching, saving, and managing song lyrics. This app leverages the Lyrics.ovh API for retrieving lyrics and uses MongoDB for storing user-saved lyrics.

## Features

- **Search for Lyrics:** Search for song lyrics by artist and song title.
- **Save Lyrics:** Save the lyrics of songs to your personal collection.
- **View Saved Lyrics:** View and manage your saved lyrics.
- **Delete Lyrics:** Remove saved lyrics from your collection.

## Technologies Used

- **Backend:** Node.js with Express.js
- **Database:** MongoDB
- **Frontend:** HTML, CSS, JavaScript
- **APIs:** Lyrics.ovh API
- **Other:** CORS for cross-origin requests, Node Fetch for API requests

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/Song-Lyrics.git
   cd Song Lyrics

Install Dependencies:

- npm install

Set Up MongoDB:

Make sure MongoDB is running locally on the default port (27017). You can start MongoDB with:

- mongod

Start the Server:

npm start

The server will be running on http://localhost:5000`

Access the Frontend:

Open your browser and navigate to http://localhost:5000 to access the application.

## Usage

- Search for Lyrics: Enter an artist and song title in the search bar and click   "Search" to retrieve lyrics.

- Save Lyrics: Click "Save Lyrics" to add the lyrics to your saved collection.
  View Saved Lyrics: Navigate to the "Saved Lyrics" section to view your saved    lyrics.

- Delete Lyrics: Click "Delete" next to a saved lyric to remove it from your col  lection.

## API Endpoints

POST /save-lyrics - Save lyrics to the database.

- Request Body: { "artist": "Artist Name", "songTitle": "Song Title" }

- Response: { "message": "Lyrics saved successfully" }

GET /saved-lyrics - Retrieve all saved lyrics.

  Response: [{ "artist": "Artist Name", "songTitle": "Song Title", "lyrics": "Ly  rics", "savedAt": "Date" }]

GET /saved-lyrics/:id - Retrieve specific lyrics by ID.

- Response: { "artist": "Artist Name", "songTitle": "Song Title", "lyrics": "Lyr  ics", "savedAt": "Date" }

DELETE /delete-lyrics/:id - Delete saved lyrics by ID.

- Response: { "message": "Lyrics deleted successfully" }`

## Contributing

- Fork the repository.
- Create a feature branch (git checkout -b feature/YourFeature).
- Commit your changes (git commit -am 'Add new feature').
- Push to the branch (git push origin feature/YourFeature).
- Create a new Pull Request.

## License

- This project is licensed under the MIT License. See the LICENSE file  for details.

## Contact

- For questions or feedback, please contact Korir Julius.

  on korirjulius001@gmail.com


