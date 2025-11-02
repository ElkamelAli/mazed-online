const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json({ limit: "10mb" })); // allow big payloads
app.use(express.json());
app.use(cors());

// Connect MongoDB
mongoose.connect("mongodb+srv://alielkamel:ali123@mazed.3ehwz89.mongodb.net/?retryWrites=true&w=majority&appName=Mazed")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// User model
const User = mongoose.model('User', new mongoose.Schema({
    fullname: String,
    email: { type: String, unique: true },
    password: String,
}));

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
app.post('/register', async (req, res) => {
  console.log("trying to register.....");
    const { fullname, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({ fullname, email, password: hashed });
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: "Email already exists" });
    }
});

// Login
app.post('/login', async (req, res) => {
      console.log("trying to logging.....");
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "secret_key");
    res.json({ token });
});

//items
const Item = require('./models/Item');

// GET all items
app.get('/items', async (req, res) => {
    console.log("collecting items.....");

  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

//add items
app.post("/addItem", async (req, res) => {
  try {
      console.log("Adding new item.....");

    const { name, picture, price } = req.body;
    const newItem = new Item({ name, picture, price });
    //await db.collection("items").insertOne(newItem);
    const savedItem= await newItem.save();
    res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add item" });
    console.log(error);
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
