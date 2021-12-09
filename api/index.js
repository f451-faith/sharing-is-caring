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
  if (Object.keys(req.query).length) {
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
    if (key == "min_year") data = filterDataByMinYear(data, value);
  });
  return data;
}

function filterDataByQ(data, value) {
  data = data.filter((book) => book.title.toLowerCase().includes(value.toLowerCase()));
  return data;
}

function filterDataByAuthor(data, value) {
  // Filter the data with the value
  return data;
}

function filterDataByMinYear(data, value) {
  // Filter the data with the value
  return data;
}

function getSpecificBook(req, res) {
  const id = req.params.book;
  const item = data.find((i) => i.id == id);
  res.send(item);
}
