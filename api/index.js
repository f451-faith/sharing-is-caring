/*
GENERAL SETUP
*/

const fetch = require("node-fetch");
const fs = require("fs");
const dataFromJSON = JSON.parse(fs.readFileSync("../book.json"));
let data = dataFromJSON;

const express = require("express");
const app = express();
const port = 3000;

app.listen(port, () => console.log("Server available at http://localhost:3000 🏗️"));

/*
LIST OF URLs
*/

app.get("/", (req, res) => res.send("Nothing to show 🚧"));
app.get("/books", getAllBooks);
app.get("/books/:book/", getSpecificBook);

/*
LIST OF FUNCTIONS
*/

function getAllBooks(req, res) {
  if (Object.keys(req.query).length > 0) {
    // Check if there's anything on the parameters
    const filteredData = getFilteredData(data, req.query);
    res.send(filteredData);
  } else {
    res.send(data);
  }
}

function getFilteredData(data, parameters) {
  Object.entries(parameters).forEach(([key, value]) => {
    if (key == "q") data = filterDataByQ(data, value);
    if (key == "author") data = filterDataByAuthor(data, value);
    if (key == "editor") data = filterDataByEditor(data, value);
    if (key == "min_year") data = filterDataByMinYear(data, value);
    if (key == "max_year") data = filterDataByMaxYear(data, value);
  });
  return data;
}

function filterDataByQ(data, value) {
  data = data.filter(function (book) {
    if (book.title) {
      return book.title.toLowerCase().includes(value.toLowerCase());
    }
  });
  return data;
}

function filterDataByAuthor(data, value) {
  data = data.filter(function (book) {
    // Check if the book has an ISBN
    if (book.isbn) {
      // Create the URL for the Google API where the info of the book are
      var url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + book.isbn;
      // Fetch the data from this URL
      fetch(url)
        .then(function (response) {
          // We transform the data to JSON
          return response.json();
        })
        .then(function (json) {
          // We go to the items array
          var items = json.items;
          // We check if there's any item
          if (items.length > 0) {
            // We get the first item
            var item = items[0];
            // We go to the authors
            var authors = item["volumeInfo"]["authors"];
            // We check if there's any author
            if (authors.length > 0) {
              // Transform array of authors into a string
              var authorsString = authors.join(", ");
              // Check if the author's string includes the value
              return authorsString.toLowerCase().includes(value.toLowerCase());
            }
          }
        });
    }
  });

  return data;
}

function filterDataByEditor(data, value) {
  data = data.filter(function (book) {
    if (book.editor) {
      return book.editor.toLowerCase().includes(value.toLowerCase());
    }
  });
  return data;
}

function filterDataByMinYear(data, value) {
  data = data.filter(function (book) {
    if (book.year) {
      return book.year >= value;
    }
  });
  return data;
}

function filterDataByMaxYear(data, value) {
  data = data.filter(function (book) {
    if (book.year) {
      return book.year <= value;
    }
  });
  return data;
}

function getSpecificBook(req, res) {
  const id = req.params.book;
  const item = data.find((i) => i.id == id);
  res.send(item);
}
