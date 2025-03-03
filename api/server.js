// js::server.js::notesapp/backend/api/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 3001;

app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE notes (id INTEGER PRIMARY KEY, title TEXT, content TEXT, category TEXT)");
});

app.post('/notes/', async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const category = await categorizeNoteContent(content);
    db.run("INSERT INTO notes (title, content, category) VALUES (?, ?, ?)", [title, content, category], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, category });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Edit a note
app.get('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  db.get("SELECT * FROM notes WHERE id = ?", [noteId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(row);
  });
});

// Endpoint to update a note by ID
app.put('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const { title, content, category } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  db.run("UPDATE notes SET title = ?, content = ?, category = ? WHERE id = ?", [title, content, category, noteId], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note updated successfully' });
  });
});


// Delete a note
app.delete('/notes/:id', (req, res) => {
  db.run("DELETE FROM notes WHERE id = ?", req.params.id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ changes: this.changes });
  });
});

// Search notes
app.get('/notes/search', (req, res) => {
  const keyword = req.query.keyword;
  console.log(`In serach`);
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }
  db.all("SELECT * FROM notes WHERE title LIKE ? OR content LIKE ?", [`%${keyword}%`, `%${keyword}%`], (err, rows) => {
    if (err) {
      console.log(`Search failed`);
      return res.status(500).json({ error: err.message });
    }
    console.log(`Search success`);
    res.json(rows);
  });
});

// View all notes
app.get('/notes/', (req, res) => {
  db.all("SELECT * FROM notes", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});




async function categorizeNoteContent(content) {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
      { inputs: content, parameters: { candidate_labels: ['Work', 'Personal', 'Ideas'] } },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
      }
    );
    return response.data.labels[0];
  } catch (error) {
    console.error('Error in categorizing content:', error);
    throw new Error('Failed to categorize content');
  }
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app; // Export app for testing
