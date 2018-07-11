const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const setupHTTPLogger = require("./setupHTTPLogger");

const port = parseInt(process.env.PORT, 10) || 3001;

mongoose.connect(
  "mongodb://db:27017/documents",
  { useNewUrlParser: true }
);

const Message = mongoose.model("Class", {
  createdAt: { type: String, required: true },
  text: { type: Number, required: true }
});

/**
 * Setup server
 */
const app = express();
setupHTTPLogger(app);

app.use(cors());
app.use(bodyParser.json());

/**
 * Setup API routes
 */
app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find({});
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

app.post("/messages", async (req, res) => {
  console.log(req.body);
  const { text } = req.body;
  const message = new Message({ createdAt: Date.now(), text });
  try {
    await message.save();
    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

/**
 * The catch-all handler returns a nice JSON 404 error
 */
app.all("*", (req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(port, () => {
  console.log(`api listening on ${port}`);
});
