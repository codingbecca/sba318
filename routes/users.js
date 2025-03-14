const express = require('express')
const router = express.Router()

const users = require('../data/users')

router
    .route('/')
    .get((req, res) => {
        res.json(users)
    })
    .post((req, res) => {
        if(req.body.name && req.body.username && req.body.email){
            if (users.find((u) => u.username == req.body.username)) {
                res.json({ error: "username already exists" });
                return;
              }

            const newUser = {
                id: users[users.length -1].id + 1,
                name: req.body.name,
                username: req.body.username,
                email: req.body.email
            }

            users.push(newUser)
            res.json(newUser)
        } else {
            res.json({ error: "insufficient data to add user" });
        }
    })

router
    .get('/:userId', (req, res) => {
        const user = users.find(u => u.id == req.params.userId)

        if (user) {
            res.json(user);
          } else {
            res.status(404).json({ error: "user not found" });
          }
    })

module.exports = router