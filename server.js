const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to serve static files (PDFs) from the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve the index.html file when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to list all PDF files in the "uploads" folder
app.get('/files', (req, res) => {
    const fs = require('fs');
    const uploadsDir = path.join(__dirname, 'uploads');
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error('Error reading uploads directory:', err);
            res.status(500).send('Error reading files');
        } else {
            const pdfFiles = files.filter(file => file.endsWith('.pdf'));
            res.json(pdfFiles); // Send the list of PDF files
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
