const express = require("express");

const router = express.Router();

const Games = require("../models/games");

// Routes

router.get("/", (req, res) => {
  Games.find({})
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500);
    });
});

router.post("/save", (req, res) => {
  const data = req.body;

  const newGame = new Games(data);

  newGame.save((error) => {
    if (error) {
      res.status(500).json({ msg: "Sorry, internal server errors" });
      return;
    }
    // newGame
    return res.json({
      msg: "Your data has been saved!!!!!!",
    });
  });
});

// router.get("/", (req, res) => {
//   BlogPost.find({})
//     .then((data) => {
//       console.log("Data: ", data);
//       res.json(data);
//     })
//     .catch((error) => {
//       console.log("error: ", daerrorta);
//     });
// });

// router.post("/save", (req, res) => {
//   const data = req.body;

//   const newBlogPost = new BlogPost(data);

//   newBlogPost.save((error) => {
//     if (error) {
//       res.status(500).json({ msg: "Sorry, internal server errors" });
//       return;
//     }
//     // BlogPost
//     return res.json({
//       msg: "Your data has been saved!!!!!!",
//     });
//   });
// });

// router.get("/name", (req, res) => {
//   const data = {
//     username: "peterson",
//     age: 5,
//   };
//   res.json(data);
// });

module.exports = router;
