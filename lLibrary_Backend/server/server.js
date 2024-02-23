const cors = require('cors');
const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Database connection
const connection = mysql.createConnection({
  host:"database-1.cpiowo2ek0tb.eu-north-1.rds.amazonaws.com",
  port:"3306",
  user:"admin",
  password:"aswinmrds",
  database:"my_db"
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL Successfully');
});


app.post("/mark-as-read", (req, res) => {
  const book = req.body;

  // Insert into "book_data" table
  const insertQuery = `INSERT INTO book_data (Title, Author, Subject, Publish_Date) VALUES (?, ?, ?, ?)`;
  connection.query(insertQuery, [book.Title, book.Author, book.Subject, book.Publish_Date], (err, result) => {
    if (err) {
      console.error("Error inserting into book_data table:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Delete from "library" table
    const deleteQuery = `DELETE FROM library WHERE Title = ?`;
    connection.query(deleteQuery, [book.Title], (err, result) => {
      if (err) {
        console.error("Error deleting from library table:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.status(200).json({ message: "Book marked as read successfully" });
    });
  });
});


app.get("/books", (req, res) => {
  const query = `SELECT * FROM library`;
  connection.query(query, [], (err, rows) => {
    if (err) {
      console.error("Error retrieving data:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(rows);
    console.log(rows);
  });
});

app.post('/search', (req, res) => {
  const { searchOption, query } = req.body;
  let searchQuery = '';

  // Choose query based on selected search option
  switch (searchOption) {
    case 'title':
      searchQuery = 'SELECT * FROM library WHERE Title LIKE ?';
      break;
    case 'author':
      searchQuery = 'SELECT * FROM library WHERE Author LIKE ?';
      break;
    case 'subject':
      searchQuery = 'SELECT * FROM library WHERE Subject LIKE ?';
      break;
    default:
      searchQuery = 'SELECT * FROM library';
      break;
  }

  connection.query(searchQuery, [`%${query}%`], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({ books: results, totalBooks: results.length });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
