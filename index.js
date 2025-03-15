const express = require('express');
const bodyParser = require('body-parser')

app = express();
PORT = 3000

const booksRouter = require('./routes/books')
const reviewsRouter = require('./routes/reviews')
const usersRouter = require('./routes/users')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.send('This is the home page')
})

app.use('/books', booksRouter)
app.use('/reviews', reviewsRouter)
app.use('/users', usersRouter)

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
})