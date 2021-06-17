const express = require("express");

const router = express.Router();

const Chats = require("../models/chats");

// Routes

router.get("/", (req, res) => {
  Chats.find({})
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

  const newGame = new Chats(data);

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
  console.log("hi", id, data);
  Chats.findOneAndUpdate(
    { user: id },
    { messages: data.messages },
    { useFindAndModify: false }
  )
    .then(() => {
      return res.json({ msg: "Bet is saved successfully!" });
    })
    .catch(() => {
      return res.status(500);
    });
});

module.exports = router;
