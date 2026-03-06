# 🛡️ Secure Pad | Encrypted ephemeral File & Note Sharing

**Secure Pad** is a high-tech, privacy-focused MERN stack application designed for sharing sensitive notes and media. It features "Burn on Read" logic and granular download permissions, making it ideal for temporary, secure data exchange.

---

## 🚀 Key Features
* **Encrypted Gateway**: Access or create rooms using a unique secret key.
* **Burn on Read**: Optional self-destruct mechanism that deletes data immediately after the first view.
* **Multi-Media Support**: Seamlessly share text, images, video, and audio using Supabase Storage.
* **Granular Permissions**: Toggle-able download restrictions for shared files.
* **Ephemeral Storage**: Built-in TTL (Time-to-Live) that auto-deletes any room after 24 hours.
* **Cyberpunk UI**: Modern, responsive interface built with Tailwind CSS and Lucide icons.

---

## 🛠️ Tech Stack
* **Frontend**: React.js, Tailwind CSS v4, Lucide React, Axios.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB Atlas (Metadata & TTL).
* **Cloud Storage**: Supabase (Media Hosting).

---

## 📦 Installation & Setup

### 1. Prerequisites
* Node.js (LTS version)
* MongoDB Atlas Account
* Supabase Project

### 2. Backend Setup
```bash
cd server
npm install
# Create a .env file with:
# MONGO_URI, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
node server.js

### 3. Frontend Setup
cd client
npm install
npm run dev

🛡️ Security Protocol
Data integrity is maintained through a combination of MongoDB TTL indexes and logic-based deletion. The "Burn on Read" feature ensures that once a room is accessed, the metadata is purged from the database instantly.
