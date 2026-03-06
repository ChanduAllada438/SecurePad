// 1. DNS FIX: Forces Node.js to resolve MongoDB Atlas addresses correctly
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); 

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// UPDATED CORS: This allows your local testing AND your future deployed frontend to connect
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 2. SYSTEM CHECK
console.log("--- 🛡️ Secure Pad System Check ---");
if (!process.env.MONGO_URI || !process.env.SUPABASE_URL) {
    console.error("❌ ERROR: Keys missing in .env file!");
    process.exit(1);
}

// 3. INITIALIZE SERVICES
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ SUCCESS: Connected to MongoDB Atlas"))
    .catch(err => {
        console.log("❌ ERROR: MongoDB Connection Failed.");
        console.log("Details:", err.message);
    });

// 4. DATABASE SCHEMA (Metadata for your rooms)
const Locker = mongoose.model('Locker', new mongoose.Schema({
    roomPassword: { type: String, required: true, unique: true },
    fileUrl: String,
    fileName: String,
    fileType: String,
    textContent: String, 
    settings: {
        burnOnRead: { type: Boolean, default: false },
        allowDownload: { type: Boolean, default: true },
        isText: { type: Boolean, default: false }
    },
    createdAt: { type: Date, default: Date.now, expires: 86400 } // Auto-delete after 24hrs
}));

// 5. API ROUTES

// Check or Access Room
app.post('/api/access', async (req, res) => {
    try {
        const { password } = req.body;
        const room = await Locker.findOne({ roomPassword: password });
        
        if (!room) return res.status(404).json({ message: "New Room" });
        
        res.json(room);

        // BURN ON READ LOGIC: Delete after sending
        if (room.settings.burnOnRead) {
            console.log(`🔥 Burning room for password: ${password}`);
            await Locker.deleteOne({ _id: room._id });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Room / Upload Metadata
app.post('/api/create-room', async (req, res) => {
    try {
        const newRoom = new Locker(req.body);
        await newRoom.save();
        res.status(201).json({ message: "Room secured!" });
    } catch (err) {
        res.status(400).json({ error: "Password already in use or invalid data." });
    }
});

// UPDATED PORT: Listen on 0.0.0.0 for external access during deployment
const PORT = process.env.PORT || 5000;
app.listen(5000, () => {
    console.log(`🚀 Secure Pad Backend live at http://localhost:5000`);
});