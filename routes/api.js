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
  let name = req?.query?.name;

  if (!name) {
    res
      .status(404)
      .json({ msg: `Not found id (${name})`, type: typeMsg.error });
    return;
  }

  Games.findOneAndUpdate(
    { name: name },
    { bets: data.bets },
    { useFindAndModify: false }
  )
    .then((games) => {
      res.json({
        msg: "Settings is saved successfully!",
        type: typeMsg.success,
      });
    })
    .catch((err) => {
      res.status(500);
    });
});

module.exports = router;
