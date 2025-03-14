const express = require("express");
const router = express.Router();

const books = require("../data/books");
const reviews = require("../data/reviews");

router
  .route("/")
  // get all books in the library or all books matching a query
  .get((req, res) => {
    const { isbn, title, author, genre, publicationYear } = req.query
    let filteredBooks = books

    if(isbn) {
        filteredBooks = filteredBooks.filter(book => book.isbn.includes(isbn))
    }

    if(title) {
        filteredBooks = filteredBooks.filter(book => book.title.includes(title))
    }

    if (author) {
        filteredBooks = filteredBooks.filter(book => book.author.includes(author))
    }

    if (genre) {
        filteredBooks = filteredBooks.filter(book => book.genre.includes(genre))
    }
    
    if(publicationYear) {
        filteredBooks = filteredBooks.filter(book => book.publicationYear == publicationYear)
    }

    res.json(filteredBooks);
  })
  // add a new book (requires isbn, title, author, description, genre, and publication year)
  .post((req, res) => {
    if (
      req.body.isbn &&
      req.body.title &&
      req.body.author &&
      req.body.description &&
      req.body.genre &&
      req.body.publicationYear
    ) {
      const newBook = {
        id: books[books.length - 1].id + 1,
        isbn: req.body.isbn,
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        genre: req.body.genre,
        publicationYear: req.body.publicationYear,
      };
      books.push(newBook);
      res.json(newBook);
    } else {
      res.json({ error: "insufficient data to add book" });
    }
  });

router
  .route("/:bookId")
  // get a single book by it's id
  .get((req, res) => {
    const book = books.find((b) => b.id == req.params.bookId);

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "book not found" });
    }
  })
  // update a book from the book's id
  .patch((req, res) => {
    const book = books.find((b, i) => {
      if (b.id == req.params.bookId) {
        for (const key in req.body) {
          book[i][key] = req.body[key];
        }
        return true;
      }
    });
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "book not found" });
    }
  })
  // delete a single book
  .delete((req, res) => {
    const book = books.find((b, i) => {
        if(b.id == req.params.bookId){
            books.splice(i, 1)
            return true
        }
    })
    if (book) {
        res.json(book)
    } else {
        res.status(404).json({error: 'book not found'})
    }
  })

// get all reviews for a specific book
router.route("/:bookId/reviews").get((req, res) => {
  const reviewsForBook = reviews.filter(
    (review) => review.bookId == req.params.bookId
  );
  if (reviewsForBook.length > 0) {
    res.json(reviewsForBook);
  } else {
    res.status(404).json({ error: "no reviews for book id" });
  }
});

// get all reviews for a specific book by a specific user
router.route("/:bookId/reviews/:userId").get((req, res) => {
  const reviewsByUser = reviews.filter(
    (review) =>
      review.bookId == req.params.bookId && review.userId == req.params.userId
  );
  if(reviewsByUser.length > 0){
    res.json(reviewsByUser)
  } else {
    res.status(404).json({error: 'reviews not found'})
  }
});

module.exports = router;
