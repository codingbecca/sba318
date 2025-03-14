const express = require('express')
const router = express.Router()

const reviews = require('../data/reviews')

router
    .route('/')
    // get all reviews
    .get((req, res) => {
        res.json(reviews)
    })
    // add a new review (requires bookId, userId, and review)
    .post((req, res) => {
        if(req.body.bookId && req.body.userId && req.body.review){
            const newReview = {
                id: reviews[reviews.length - 1].id + 1,
                bookId: req.body.bookId,
                userId: req.body.userId,
                review: req.body.review
            }

            reviews.push(newReview)
            res.json(newReview)
        } else {
            res.status(400).json({ error: "insufficient data to add review" });
        }
    })

router
    .route('/:reviewId')
    // get a single review by id
    .get((req, res) => {
        const review = reviews.find(r => r.id == req.params.reviewId)

        if(review) {
            res.json(review)
        } else {
            res.status(404).json({error: 'review not found'})
        }
    })
    // update a review
    .patch((req, res) => {
        const review = reviews.find((r, i) => {
            if (r.id == req.params.reviewId) {
              for (const key in req.body) {
                review[i][key] = req.body[key];
              }
              return true;
            }
          });
          if (review) {
            res.json(review);
          } else {
            res.status(404).json({ error: "review not found" });
          }
    })
    // delete a single review
    .delete((req, res) => {
        const review = reviews.find((r, i) => {
            if(r.id == req.params.reviewId){
                reviews.splice(i, 1)
                return true
            }
        })
        if (review) {
            res.json(review)
        } else {
            res.status(404).json({error: 'review not found'})
        }
    })

//gets all reviews by specified user
router.get('/users/:userId', (req, res) => {
    const reviewsByUser = reviews.filter(r => r.userId == req.params.userId)
    if (reviewsByUser.length > 0){
        res.json(reviewsByUser)
    } else {
        res.status(404).json({error: 'reviews not found'})
    }
})

module.exports = router