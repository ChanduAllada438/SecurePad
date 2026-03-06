const mongoose = require('mongoose');

const lockerSchema = new mongoose.Schema({
    roomPassword: { type: String, required: true, unique: true },
    fileUrl: { type: String },
    fileType: { type: String },
    textContent: { type: String },
    settings: {
        burnOnRead: { type: Boolean, default: false },
        allowDownload: { type: Boolean, default: true },
        permission: { type: String, enum: ['view', 'edit'], default: 'view' }
    },
    createdAt: { type: Date, default: Date.now, expires: 86400 } // Auto-delete after 24 hours
});

module.exports = mongoose.model('Locker', lockerSchema);