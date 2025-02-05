const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

// Set up static folder for serving uploaded files
app.use(express.static(path.join(__dirname, 'public')));

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        // Create uploads folder if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Preserve original filename and add a timestamp
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Route to upload PDF files
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.send({ message: "File uploaded successfully", file: req.file });
});

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
