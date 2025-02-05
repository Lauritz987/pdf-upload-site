const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Serve static files (HTML, JS)
app.use(express.static(__dirname));

// Create uploads directory if not exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Handle file upload
app.post("/upload", upload.single("file"), (req, res) => {
    res.json({ message: "File uploaded successfully!" });
});

// Serve uploaded files
app.use("/uploads", express.static(uploadDir));

// Get list of uploaded files
app.get("/files", (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            res.status(500).json({ error: "Unable to fetch files" });
        } else {
            res.json(files);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
