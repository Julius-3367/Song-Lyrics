import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const app = express();

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from 'frontend' directory
app.use(express.static(resolve(__dirname, 'Frontend')));

// Set strictQuery to true or false to suppress the warning
mongoose.set('strictQuery', true);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/lyricsApp', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const lyricsSchema = new mongoose.Schema({
  artist: String,
  songTitle: String,
  lyrics: String,
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

const Lyrics = mongoose.model('Lyrics', lyricsSchema);

// Save lyrics to the database
app.post('/save-lyrics', async (req, res) => {
  const { artist, songTitle } = req.body;
  const apiURL = `https://api.lyrics.ovh/v1/${artist}/${songTitle}`;

  try {
    // Check if lyrics already exist in the database
    const existingLyrics = await Lyrics.findOne({ artist, songTitle });
    if (existingLyrics) {
      return res.status(409).json({ message: 'Lyrics already saved' });
    }

    const response = await fetch(apiURL);
    const data = await response.json();

    if (data.error) {
      return res.status(404).json({ message: 'Lyrics not found' });
    }

    const lyrics = data.lyrics;
    const newLyrics = new Lyrics({ artist, songTitle, lyrics });
    await newLyrics.save();
    res.status(201).json({ message: 'Lyrics saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Retrieve saved lyrics from the database
app.get('/saved-lyrics', async (req, res) => {
  try {
    const lyrics = await Lyrics.find().sort({ savedAt: -1 });
    res.status(200).json(lyrics);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Retrieve specific lyrics by ID
app.get('/saved-lyrics/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const lyrics = await Lyrics.findById(id);
    if (!lyrics) {
      return res.status(404).json({ message: 'Lyrics not found' });
    }
    res.status(200).json(lyrics);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete saved lyrics from the database
app.delete('/delete-lyrics/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLyrics = await Lyrics.findByIdAndDelete(id);
    if (!deletedLyrics) {
      return res.status(404).json({ message: 'Lyrics not found' });
    }
    res.status(200).json({ message: 'Lyrics deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
