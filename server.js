const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

// Set up static folder for serving uploaded files
app.use(express.static(path.join(__dirname, 'uploads')));

// Route to get list of uploaded files
app.get("/files", (req, res) => {
    const uploadPath = path.join(__dirname, 'uploads');
    fs.readdir(uploadPath, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading the files');
        }
        res.json(files);
    });
});

// Serve the index.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
