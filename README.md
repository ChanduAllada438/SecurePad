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

Follow these steps to clone and run Secure Pad on your local machine.

📋 1. Prerequisites
Before you begin, ensure you have the following installed and configured:

Node.js: Download Node.js (v18.0.0 or higher).

Git: Download Git.

MongoDB Atlas: A free cluster account.

Supabase: A free project for media storage.

Code Editor: VS Code is recommended.

⚙️ 2. Cloud Environment Setup (Zero-to-Hero)
A. MongoDB Setup (The Database)
Create a free cluster at MongoDB Atlas.

Network Access: Click "Network Access" -> "Add IP Address" -> Select "Allow Access From Anywhere" (0.0.0.0/0).

Database Access: Create a user with a username and password.

Connection String: Click "Connect" -> "Drivers" -> Copy the mongodb+srv://... string.

B. Supabase Setup (The Storage)
Create a project at Supabase.

Storage: Click "Storage" in the sidebar -> "New Bucket" -> Name it exactly files.

Permissions: Toggle the bucket to "Public".

API Keys: Go to Project Settings -> API -> Copy the Project URL, anon public key, and service_role key.

💻 3. Local Installation & Configuration
Step 1: Clone the Project
Bash
git clone https://github.com/your-username/secure-pad.git
cd secure-pad
Step 2: Backend Configuration (/server)
Bash
cd server
npm install
Create a file named .env in the server folder and paste your keys:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CLIENT_URL=http://localhost:5173
Step 3: Frontend Configuration (/client)
Open a new terminal window:

Bash
cd ../client
npm install
Create a file named .env in the client folder:

Code snippet
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:5000
🚀 4. How to Run (Execution Commands)
You must keep two terminals running simultaneously.

Terminal 1: Start the Backend Server
Bash
cd server
node server.js
You should see: ✅ SUCCESS: Connected to MongoDB Atlas

Terminal 2: Start the Frontend Application
Bash
cd client
npm run dev
You should see: VITE vX.X.X  ready in XX ms

Now, open your browser to http://localhost:5173 to start using Secure Pad!

🛠️ 5. Technical Architecture
Frontend: React.js with Vite, Tailwind CSS, and Lucide Icons.

Backend: Node.js & Express.js.

Database: MongoDB (NoSQL) for metadata and room logic.

File Storage: Supabase (Object Storage) for media.

Security Features:

TTL Indexing: MongoDB automatically deletes records after 86400 seconds (24 hours).

Burn-on-Read: Backend logic triggers an immediate deleteOne() command upon successful room access if the setting is enabled.

CORS Protection: Restricted origin access to prevent unauthorized API calls.

👨‍💻 Author
Allada Chandra Sekhar Swamy - 3rd Year CSE Student 
