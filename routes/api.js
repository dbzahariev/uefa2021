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

router.post("/update", (req, res) => {
  const data = req.body || {};
  let id = req?.query?.id;

  if (!id) {
    res.status(404).json({ msg: `Not found id (${id})` });
    return;
  }

  Games.findOneAndUpdate(
    { _id: id },
    { bets: data.bets },
    { useFindAndModify: false }
  )
    .then(() => {
      return res.json({ msg: "Bet is saved successfully!" });
    })
    .catch(() => {
      return res.status(500);
    });
});

// Games.findOne(id).then((game) => {
//   console.log(game);
//   // Games.findOneAndUpdate(
//   //   { _id: id },
//   //   { bets: data.bets },
//   //   { useFindAndModify: false }
//   // )
//   //   .then(() => {
//   //     return res.json({ msg: "Bet is saved successfully!" });
//   //   })
//   //   .catch(() => {
//   //     return res.status(500);
//   //   });
// });
// });

module.exports = router;
