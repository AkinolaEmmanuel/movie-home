"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
if (!API_URL || !API_KEY) {
    console.error('Missing required environment variables. Create a .env file with API_URL and API_KEY.');
    process.exit(1);
}
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//Get Movie by Search Query
app.get('/movies/search', async (req, res) => {
    try {
        const searchQuery = req.query.s;
        if (!searchQuery || typeof searchQuery !== 'string') {
            return res.status(400).send('Bad Request: Missing or invalid search query');
        }
        const response = await axios_1.default.get(`${API_URL}/`, {
            params: { s: searchQuery, apikey: API_KEY }
        });
        if (response.status !== 200) {
            return res.status(response.status).send('Error fetching data from API');
        }
        if (response.data && response.data.Response === 'False') {
            return res.status(400).json({ error: response.data.Error || 'Error fetching data from API' });
        }
        res.json(response.data);
    }
    catch (error) {
        console.error('Movie search error:', error?.message || error);
        res.status(500).send('Server Error');
    }
});
// Render health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.use(express_1.default.static(path_1.default.join(__dirname, '../client/dist')));
app.get('/*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../client/dist', 'index.html'));
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
