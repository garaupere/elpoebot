// ELPOEBOT Server - Handle file persistence
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

// File paths
const CORPUS_FILE = path.join(__dirname, 'corpus.txt');
const BOOK_FILE = path.join(__dirname, 'book.json');

// Initialize files if they don't exist
function initializeFiles() {
    if (!fs.existsSync(CORPUS_FILE)) {
        fs.writeFileSync(CORPUS_FILE, '', 'utf-8');
    }
    if (!fs.existsSync(BOOK_FILE)) {
        fs.writeFileSync(BOOK_FILE, JSON.stringify([]), 'utf-8');
    }
}

initializeFiles();

// API: Get corpus
app.get('/api/corpus', (req, res) => {
    try {
        const data = fs.readFileSync(CORPUS_FILE, 'utf-8');
        const lines = data.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));
        res.json({ corpus: lines });
    } catch (error) {
        console.error('Error reading corpus:', error);
        res.status(500).json({ error: 'Error reading corpus' });
    }
});

// API: Add verse to corpus
app.post('/api/corpus', (req, res) => {
    try {
        const { verse } = req.body;
        if (!verse || verse.trim() === '') {
            return res.status(400).json({ error: 'Verse is required' });
        }
        
        // Read existing corpus
        let data = fs.readFileSync(CORPUS_FILE, 'utf-8');
        
        // Add new verse
        if (data && !data.endsWith('\n')) {
            data += '\n';
        }
        data += verse.trim() + '\n';
        
        // Save to file
        fs.writeFileSync(CORPUS_FILE, data, 'utf-8');
        
        // Return updated corpus
        const lines = data.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));
        res.json({ corpus: lines, message: 'Verse added successfully' });
    } catch (error) {
        console.error('Error adding verse:', error);
        res.status(500).json({ error: 'Error adding verse' });
    }
});

// API: Get book
app.get('/api/book', (req, res) => {
    try {
        const data = fs.readFileSync(BOOK_FILE, 'utf-8');
        const book = JSON.parse(data || '[]');
        res.json({ book });
    } catch (error) {
        console.error('Error reading book:', error);
        res.status(500).json({ error: 'Error reading book' });
    }
});

// API: Add poem to book
app.post('/api/book', (req, res) => {
    try {
        const { poem } = req.body;
        if (!poem) {
            return res.status(400).json({ error: 'Poem is required' });
        }
        
        // Read existing book
        const data = fs.readFileSync(BOOK_FILE, 'utf-8');
        const book = JSON.parse(data || '[]');
        
        // Add timestamp if not present
        if (!poem.timestamp) {
            poem.timestamp = new Date().toISOString();
        }
        if (!poem.date) {
            poem.date = new Date().toLocaleString('ca-ES');
        }
        
        // Add poem to book
        book.push(poem);
        
        // Save to file
        fs.writeFileSync(BOOK_FILE, JSON.stringify(book, null, 2), 'utf-8');
        
        res.json({ book, message: 'Poem added successfully' });
    } catch (error) {
        console.error('Error adding poem:', error);
        res.status(500).json({ error: 'Error adding poem' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`ELPOEBOT server running on http://localhost:${PORT}`);
    console.log(`Corpus file: ${CORPUS_FILE}`);
    console.log(`Book file: ${BOOK_FILE}`);
});
