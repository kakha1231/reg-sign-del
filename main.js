const express = require('express')
const fs = require('fs')
const app = express();
const nanoid = require('nanoid')


app.use((req, res, next) => {
    console.log(req.url);
    next();
  });
app.use(express.json());

app.get("/", (req, res) => {
    const book = allBooks();
    return res.json({ data: book });
  });

app.post("/book", (req, res) => {
  const newBook = {
    id: nanoid(),
    ...req.body,
  };
  writeNewBooks(newBook);
  return res.json({ data: newBook });
});

app.get("/book/:id", (req, res) => {
    const { id } = req.params;
    const book = findBooks(id);
    console.log('find request')
    if (!book) {
      return res.status(404).json({error : '404'});
    }
  else {
   return res.json({data : book})
  }
  });

  app.delete('/book/:id', (req, res) => {
    const { id } = req.params;
   if(findBooks(id)){
       deletebook(id);
      res.status(200).json({success : true})
      }
       res.status(404).json({success : false});
      });
   

  app.listen(8000, () => {
    console.log("Server started on port 8000");
  });




function allBooks() {
  return JSON.parse(fs.readFileSync("./books.json", "utf-8"));
}

function writeNewBooks(books) {
  books = allBooks();
  books.push(books);
  fs.writeFileSync("./books.json", JSON.stringify(books));

  return true;
}

 function deletebook(id){
 const books = allBooks();
  const index = books.findIndex((item, index) => item.id == id);
  const  newbooks = books.splice(!index, 1);
  fs.writeFileSync("./books.json",JSON.stringify(newbooks))
 }

function findBooks(id) {
  const books = allBooks();
  return books.find((item) => item.id === id);
  }
  

