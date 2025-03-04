# NotesApp Backend

This is the backend service for the NotesApp, built using Express.js and SQLite. It provides a RESTful API for managing notes, including creating, reading, updating, and deleting notes. The application also categorizes notes using the Hugging Face API.

## Features

- **Create Notes**: Add new notes with a title and content.
- **Read Notes**: Retrieve all notes or a specific note by ID.
- **Update Notes**: Modify existing notes.
- **Delete Notes**: Remove notes by ID.
- **Search Notes**: Search notes by keyword.
- **Categorize Notes**: Automatically categorize notes into "Work", "Personal", or "Ideas" using the Hugging Face API.

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm (Node Package Manager)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/notesapp.git
   cd notesapp/backend

2.  Install dependencies:
    npm install
    npm install axios

3. Environment Variables:

Create a .env file in the backend directory and add your Hugging Face API key:
    HUGGING_FACE_API_KEY=your_hugging_face_api_key
    Excecute the command on terminal: npm install dotenv

4. Running the Application
    To start the server, run:
    node api/server.js

he server will run on http://localhost:3001 by default.

# API Endpoints
POST /notes: Create a new note.
GET /notes: Retrieve all notes.
GET /:id: Retrieve a note by ID.
PUT /:id: Update a note by ID.
DELETE /:id: Delete a note by ID.
GET /search?keyword=: Search notes by keyword.  

# Future Enhancements
Persistent Storage: Transition to a persistent database like PostgreSQL or MongoDB.
Authentication: Implement user authentication and authorization.
Error Handling: Improve error handling and logging.
Testing: Add unit and integration tests.
License
This project is licensed under the MIT License - see the LICENSE file for details.

# Acknowledgments
Express.js
SQLite
Hugging Face API
