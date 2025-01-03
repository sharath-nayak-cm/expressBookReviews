const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function findBooksByAuthor(author) {
  for (let bookId in books) {
    if (books[bookId].author.toLowerCase().includes(author.toLowerCase())) {
      return books[bookId];
    }
  }
}

function findBooksByTitle(title) {
  for (let bookId in books) {
    if (books[bookId].title.toLowerCase().includes(title.toLowerCase())) {
      return books[bookId];
    }
  }
}

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!doesExist(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
    res.send(book);
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  let book = findBooksByAuthor(author);
  if (book) {
    res.send(book);
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  let book = findBooksByTitle(title);
  console.log(book);
  if (book) {
    res.send(book);
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];
  console.log(book);
  if (book) {
    res.status(200).json({ review: book.reviews });
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

module.exports.general = public_users;
