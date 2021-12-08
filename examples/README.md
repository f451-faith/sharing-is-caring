# Title

You should include a short and global introduction about the API here.

> Last update: 2021.12.10

### Table of Contents
1. [Release History](#Release-history)
2. [API Endpoints](#API-endpoints)
3. [Response Fields](#Response-fields)
4. [Code Examples](#Code-examples)

# Release History

## Version 1.0 (2021-12-10)
Initial release of API, includes basic search filters and 'GET Book (Specific)'.

# API Endpoints

## `GET` Books (Search)

https://my-url.com/api/books/

| Name | Type | Description |  
|--|--|--|
| **q** | string | Any keyword or phrase that searches against title, editor, book description. |
| **georges_perec** | string | Filter by matches of titles not containing the letter e  |


**Example Request**

https://my-url.com/api/books/?q=computer&skip=1&limit=1

**Example Response**

```json
{
 "info": {
  "total": 10,
  "parameters": {
   "q": "computer",
   "skip": "1",
   "limit": "1",
  }
 },
 "data": [
   {
    "id": 23084,
    "year": 2011,
    "title": "A Little-Known Story About a Movement, a Magazine, and The Computer’s Arrival in Art: New Tendencies and Bit International, 1961-1973",
    "editor": "Margit Rosen, et al.",
    "url": "https://monoskop.org/log/?p=23084",
    "tags": [
      "1960s",
      "1970s",
      "art and science",
      "art history",
      "artistic research",
      "computer art",
      "computing",
      "conceptual art",
      "concrete art",
      "constructivism",
      "cybernetics",
      "design",
      "kinetic art",
      "media art",
      "new tendencies",
      "op art",
      "yugoslavia"
    ],
    "cover": "https://monoskop.org/images/d/d5/Rosen_Margit_ed_New_Tendencies_and_Bit_International_1961-1973_2011.jpg",
    "isbn": "9780262515818",
    "numberOfPages": 576,
    "description": "When Zagreb was the epicenter of explorations into the aesthetic potential of the new “thinking machines.”\n\nThis book documents a short but intense artistic experiment that took place in Yugoslavia in the 1960s and 1970s but has been influential far beyond that time and place: the “little-known story” of the advent of computers in art. It was through the activities of the movement, begun in Zagreb in 1961, and its supporting institution the Galerija suvremene umjetnosti that the “thinking machine” was adopted as an artistic tool and medium. Pursuing the idea of “art as visual research,” the New Tendencies movement proceeded along a path that led from Concrete and Constructivist art, Op art, and Kinetic art to computer-generated graphics, film, and sculpture.\n\nWith their exhibitions and conferences and the 1968 launch of the multilingual, groundbreaking magazine , the New Tendencies transformed Zagreb—already one of the most vibrant artistic centers in Yugoslavia—into an international meeting place where artists, engineers, and scientists from both sides of the Iron Curtain gathered around the then-new technology. For a brief moment in time, Zagreb was the epicenter of explorations of the aesthetic, scientific, and political potential of the computer.\n\nThis volume documents that exhilarating period. It includes new essays by Jerko Denegri, Darko Fritz, Margit Rosen, and Peter Weibel; many texts that were first published in New Tendencies exhibition catalogs and _Bit International_ magazine; and historic documents. More than 650 black-and-white and color illustrations testify to the astonishing diversity of the exhibited artworks and introduce the movement’s protagonists. Many of the historic photographs, translations, and documents are published here for the first time. Taken together, the images and texts offer the long overdue history of the New Tendencies experiment and its impact on the art of the twentieth century.",
    "pdf": "http://marcell.memoryoftheworld.org/Margit%20Rosen/A%20Little-Known%20Story%20About%20a%20Movement,%20a%20Magazine,%20and%20the%20Computer's%20Arrival%20in%20Art_%20New%20Tende%20(3901)/A%20Little-Known%20Story%20About%20a%20Movement,%20a%20M%20-%20Margit%20Rosen.pdf",
    "worldcat": "http://worldcat.org/oclc/676725801",
    "publisher": "ZKM Center for Art and Media, Karlsruhe, and MIT Press, Cambridge, MA, 2011",
    "exhibition": "http://www02.zkm.de/bit/"
  }
 ]
}
```

## `GET` Book (Specific)

https://my-url.com/api/books/{id}

| Name | Type | Description |  
|--|--|--|
| **fields** | array | Array of fields names that are returned. |

**Example Request**

https://my-url.com/api/books/23129?fields=title,editor

**Example Response**

```json
{
 "info": {
  "id": 23129,
  "parameters": {
   "fields": ["title"],
  }
 },
 "data": {
    "title": "Computer Grrrls",
    "editor": "Inke Arns, Marie Lechner",
  }
}
```

# Response Fields

| Field | Description |  
|--|--|
| **id** | ID on monoskop.org |
| **title** | Title of the book |


# Code Examples

### JS

```js
fetch("https://my-url.com/api/books")
  .then((response) => {
    return response.json();
  })
  .then((json) => {
    const books = json.data;
    console.log(books)
  });
```
