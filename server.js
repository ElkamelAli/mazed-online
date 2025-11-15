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
    phone: String,
    picture: String,
    solde: Number
}));

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
app.post('/register', async (req, res) => {
  console.log("trying to register.....");
      const { fullname, email, password, phone, picture } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({ fullname, email, password: hashed, phone, picture, solde:100 });
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

    const {user, name, price, picture, winner} = req.body;
    console.log("Adding new item.....");

    const newItem = new Item({user, name,  price, picture, winner });
    //await db.collection("items").insertOne(newItem);
    const savedItem= await newItem.save();
    res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add item" });
    console.log(error);
  }
});


// PUT /item/:id/increment
app.put("/item/:id/:email/increment", async (req, res) => {
  const { id, email } = req.params;
  const item = await Item.findById(id);
  if (!item) return res.status(404).send("Item not found");
  item.price += 1;
  item.winner = email;
  await item.save();
  res.json(item);
});
// get /item/:id/increment
app.get("/mywins/:email", async (req, res) => {
  const { email } = req.params;
   s=0.0;
  if (!email) return res.status(400).json({ error: "Email parameter required" });

  try {
    const items = await Item.find({ winner: email }).lean();
    if (!items.length) {
      return res.status(404).json({ message: "No wins found for this user" });
    }

     for (let i=0; i<items.length; i++){
        s=s+items[i].price;
    }
    console.log("email:  ", email);    
    console.log("s:  ", s);

    const user=User.findOne({email });
    console.log("user name:  ",user.email);
   // s=user['solde']- s;
   // await User.updateOne({email: email},{$set: {solde: s}});
    res.json(items);


  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});
 
app.get("/users/:email", async (req, res) => {
  const { email } = req.params;
  if (!email) return res.status(400).json({ error: "Email parameter required" });

  try {
    const users = await User.find({ email: email }).lean();
    if (!users.length) {
      return res.status(404).json({ message: "No user found" });
    }
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});
 
app.listen(3000, () => console.log("Server running on port 3000"));
