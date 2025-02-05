const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const basicAuth = require('basic-auth');  // Add basic-auth module
const app = express();

// Set up file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);  // Create the uploads folder if it doesn't exist
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Basic authentication function
const authenticate = (req, res, next) => {
  const user = basicAuth(req);
  if (!user || user.name !== 'lauritz987' || user.pass !== 'Quizzers') {  // Replace with your username and password
    res.setHeader('WWW-Authenticate', 'Basic realm="Example"');
    return res.status(401).send('Authentication required');
  }
  next();
};

// Serve static files (for file download)
app.use(express.static('uploads'));

// Upload route (authenticated)
app.post('/upload', authenticate, upload.single('pdf'), (req, res) => {
  res.send('File uploaded successfully');
});

// Route to view uploaded PDFs
app.get('/files', (req, res) => {
  fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
    if (err) {
      return res.status(500).send('Unable to list files');
    }
    res.json(files);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
