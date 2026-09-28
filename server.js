const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './public/uploads';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, 'prod-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const pool = new Pool({
    user: process.env.USER || 'u0_a150',
    host: 'localhost',
    database: 'nazeeft_db',
    port: 5432,
});

// استدعاء ملف مسار تحليل البقع الخارجي
require('./stainController')(app, pool, upload);

app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));

