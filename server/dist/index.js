"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//Get All Movies
//Get Movie by Search Query
app.get('/movies/search', async (req, res) => {
    try {
        const searchQuery = req.query;
        if (!searchQuery || typeof searchQuery !== 'string') {
            return res.status(400).send('Bad Request: Missing or invalid search query');
        }
        const response = await axios_1.default.get(`${process.env.API_URL}/?s=${searchQuery}&apikey=${process.env.API_KEY}`);
        if (response.data.status !== 200) {
            return res.status(400).send('Bad Request: Error fetching data');
        }
        res.json(response.data);
    }
    catch (error) {
        res.status(500).send('Server Error');
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
