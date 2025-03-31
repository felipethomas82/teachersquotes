const express = require('express');
const { setRoutes } = require('./routes/index');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Define the path to the JSON file
const quotesFilePath = path.join(__dirname, 'data', 'quotes.json');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes
// setRoutes(app);

// POST route to save a teacher's quote
app.post('/quotes', (req, res) => {
    const { teacher, quote } = req.body;
    console.log(req.body);
    

    if (!teacher || !quote) {
        return res.status(400).json({ error: 'Teacher and quote are required.' });
    }

    const newEntry = { teacher, quote };

    // Read the existing quotes
    fs.readFile(quotesFilePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).json({ error: 'Failed to read quotes file.' });
        }

        const quotes = data ? JSON.parse(data) : [];
        quotes.push(newEntry);

        // Write the updated quotes back to the file
        fs.writeFile(quotesFilePath, JSON.stringify(quotes, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save quote.' });
            }
            res.status(201).json({ message: 'Quote saved successfully.' });
        });
    });
});

// GET route to fetch random quotes
app.get('/quotes/random', (req, res) => {
    fs.readFile(quotesFilePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).json({ error: 'Failed to read quotes file.' });
        }

        const quotes = data ? JSON.parse(data) : [];
        if (quotes.length === 0) {
            return res.status(404).json({ error: 'No quotes available.' });
        }

        // Select 4 random quotes
        const randomQuotes = quotes.sort(() => 0.5 - Math.random()).slice(0, 4);
        res.json(randomQuotes);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});