import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

if (!API_URL || !API_KEY) {
    console.error('Missing required environment variables. Create a .env file with API_URL and API_KEY.');
    process.exit(1);
}


app.use(cors());
app.use(express.json());



//Get Movie by Search Query
app.get('/movies/search', async (req, res) => {
    try {
        const searchQuery = req.query.s;
        if (!searchQuery || typeof searchQuery !== 'string') {
            return res.status(400).send('Bad Request: Missing or invalid search query');
        }

        const response = await axios.get(`${API_URL}/`, {
            params: { s: searchQuery, apikey: API_KEY }
        });

        if (response.status !== 200) {
            return res.status(response.status).send('Error fetching data from API');
        }

        if (response.data && response.data.Response === 'False') {
            return res.status(400).json({ error: response.data.Error || 'Error fetching data from API' });
        }

        res.json(response.data);
    } catch (error: any) {
        console.error('Movie search error:', error?.message || error);
        res.status(500).send('Server Error');
    }
});
// Render health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});