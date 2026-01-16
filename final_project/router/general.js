const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


public_users.post("/register", (req,res) => {
  //Write your code here
    const { username, password } = req.body;

  if (isValid(username)) {
    return res.status(400).send(`The user ${username} already exists!`);
  }

  users.push({ username, password });

  return res.send(`The user ${username} has been registered!`);
});

// Get the book list available in the shop
public_users.get('/',async (req, res) => {
  //Write your code here
   try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
     try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data[isbn]);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
  //Write your code here
  const author = req.params.author;
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(Object.entries(response.data)
    .filter(([isbn, book]) => book.author === author)
    .map(([isbn, book]) => ({ isbn, ...book })));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
 
});

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
  //Write your code here

  const title = req.params.title;

 try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(Object.entries(response.data)
    .filter(([isbn, book]) => book.title === title)
    .map(([isbn, book]) => ({ isbn, ...book })));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
