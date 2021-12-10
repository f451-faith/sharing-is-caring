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

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
  next();
});

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
    if (key == "single_editor") data = checkIfSingleEditor(data, value);
    if (key == "title_colon") data = filterDataByTitleColon(data, value);
    if (key == "post_cold_war") data = filterDataByPostColdWar(data, value);
    if (key == "sort_by_title") data = sortDataByTitle(data, value);
    if (key == "exhib_country") data = filterDataByCountry(data, value);
    if (key == "filter_tld") data = filterDataByTLD(data, value);
    if (key == "publish_loc") data = filterDataByPublishingCity(data, value);
    if (key == "min_book_age") data = filterDataByMinBookAge(data, value);
    if (key == "sort_by_age") data = sortDataByAges(data, value);
  });
  return data;
}

function filterDataByTLD(data, value) {
  data = data.filter(function (book) {
    if (book.exhibition) {
      var url = new URL(book.exhibition);
      var extension = url.hostname.split(".").pop();
      return extension == value;
    }
  });
  return data;
}

function filterDataByCountry(data, value) {
  const extensions = JSON.parse(fs.readFileSync("./table_tld.json"));
  data = data.filter(function (book) {
    if (book.exhibition) {
      var url = new URL(book.exhibition);
      var extension = "." + url.hostname.split(".").pop();
      var ext = extensions.find(function (e) {
        return e["Name[7]"] == extension;
      });
      if (ext) {
        var country = ext["Entity"];
        return country.toLowerCase().includes(value.toLowerCase());
      }
    }
  });
  return data;
}

function sortDataByTitle(data, direction) {
  if (direction == "asc") {
    data = data.sort(function (bookA, bookB) {
      return bookA.title.localeCompare(bookB.title);
    });
  } else if (direction == "desc") {
    data = data.sort(function (bookA, bookB) {
      return bookB.title.localeCompare(bookA.title);
    });
  }
  return data;
}

function sortDataByAges(data, direction) {
  var today = new Date();
  var year = today.getFullYear();

  data.forEach(function (book) {
    book["age"] = year - book["year"];
  });

  if (direction == "asc") {
    data = data.sort(function (bookA, bookB) {
      return bookA["age"] - bookB["age"];
    });
  } else if (direction == "desc") {
    data = data.sort(function (bookA, bookB) {
      return bookB["age"] - bookA["age"];
    });
  }

  return data;
}

function filterDataByPostColdWar(data, value) {
  data = data.filter(function (book) {
    if (book.year) {
      return book.year > 2016;
    }
  });
  return data;
}

function filterDataByPublishingCity(data, value) {
  data = data.filter(function (book) {
    if (book.publisher) {
      var city = book.publisher.split(",")[1];
      return city.toLowerCase().includes(value.toLowerCase());
    }
  });
  return data;
}

function filterDataByMinBookAge(data, value) {
  data = data.filter(function (book) {
    if (book.year) {
      var currentYear = new Date().getFullYear();
      book.age = currentYear - book.year;
      return currentYear - book.year <= value;
    }
  });
  data = data.sort(function (bookA, bookB) {
    return bookA.age - bookB.age;
  });
  return data;
}

function filterDataByTitleColon(data) {
  data = data.filter(function (book) {
    if (book.title) {
      return book.title.includes(":");
    }
  });
  return data;
}

function checkIfSingleEditor(data, value) {
  data = data
    .filter(function (book) {
      return book.editor;
    })
    .filter(function (book) {
      if (book.editor.toLowerCase().includes(", ") || book.editor.toLowerCase().includes(" and ")) {
        if (value == "true") {
          return false;
        } else {
          return true;
        }
      } else {
        if (value == "true") {
          return true;
        } else {
          return false;
        }
      }
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
