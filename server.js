const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Custom middleware for video files with proper headers and range support (Edge compatibility)
app.use('/videos', (req, res, next) => {
    // Get the filename from the request path
    const filename = req.path.replace(/^\//, ''); // Remove leading slash
    const filePath = path.join(__dirname, 'public', 'videos', filename);

    // Security: Prevent directory traversal
    if (filePath.indexOf(path.join(__dirname, 'public', 'videos')) !== 0) {
        return res.status(403).send('Forbidden');
    }

    // Check if file exists
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        return next();
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // Set proper MIME type
    if (filePath.endsWith('.mp4')) {
        res.setHeader('Content-Type', 'video/mp4');
    } else if (filePath.endsWith('.webm')) {
        res.setHeader('Content-Type', 'video/webm');
    } else if (filePath.endsWith('.ogg') || filePath.endsWith('.ogv')) {
        res.setHeader('Content-Type', 'video/ogg');
    }

    // Support range requests for video streaming (Edge requires this)
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': res.getHeader('Content-Type'),
            'Cache-Control': 'public, max-age=31536000'
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        // No range request, send entire file
        const head = {
            'Content-Length': fileSize,
            'Content-Type': res.getHeader('Content-Type'),
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'public, max-age=31536000'
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
});

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Routes for Policy Pages
// Routes for Policy Pages
app.get('/privacy', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'privacy.html'));
});
app.get('/privacy.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'privacy.html'));
});

app.get('/terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'terms.html'));
});
app.get('/terms.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'terms.html'));
});

app.get('/cookies', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cookies.html'));
});
app.get('/cookies.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cookies.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
