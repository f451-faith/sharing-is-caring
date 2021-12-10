/*
GENERAL SETUP
*/

const fetch = require("node-fetch");
const fs = require("fs");
const dataFromJSON = JSON.parse(fs.readFileSync("./book.json"));
let data = dataFromJSON;

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

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
    const filteredData = getFilteredData(data, req.query);
    res.send(filteredData);
  } else {
    res.send(data);
  }
}

function getFilteredData(data, parameters) {
  Object.entries(parameters).forEach(([key, value]) => {
    if (key == "q") data = filterDataByQ(data, value);
    if (key == "editor") data = filterDataByEditor(data, value);
    if (key == "min_year") data = filterDataByMinYear(data, value);
    if (key == "max_year") data = filterDataByMaxYear(data, value);
    if (key == "sort_by_pages") data = sortDataByPages(data, value);
  });
  return data;
}

function sortDataByPages(data, direction) {
  if (direction == "asc") {
    data = data.sort(function (bookA, bookB) {
      return bookA["numberOfPages"] - bookB["numberOfPages"];
    });
  } else if (direction == "desc") {
    data = data.sort(function (bookA, bookB) {
      return bookB["numberOfPages"] - bookA["numberOfPages"];
    });
  }
  return data;
}

function filterDataByQ(data, value) {
  data = data.filter(function (book) {
    // Transform our object into an array of values
    var values = Object.values(book);
    // Check which values include the string we search for
    values = values.filter(function (val) {
      if (Array.isArray(val)) val = val.join(", ");
      if (Number.isInteger(val)) val = val.toString();
      return val.toLowerCase().includes(value.toLowerCase());
    });
    // If there's any value that include the string we search for, keep the item
    if (values.length > 0) {
      return true;
    } else {
      return false;
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
