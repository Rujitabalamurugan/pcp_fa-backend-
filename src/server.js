// Calls dbConnect, then app.listen on process.env.PORT
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// 1. Connect MongoDB Atlas using your URI string [cite: 93, 309]
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://naveen:naveensekhar@pcp-fa.ryugznl.mongodb.net/")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("Database connection failed:", err));

// 2. Create your Mongoose Schema & Model [cite: 94]
const ProductSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // Prevents duplicate insertions [cite: 90, 116]
  name: String,
  price: Number,
  category: String
}, { timestamps: true });

const Product = mongoose.model("Product", ProductSchema);

// 3. Move your logic into the Mandatory POST /sync endpoint 
app.post("/sync", async (req, res) => {
  try {
    // Fetch JWT Token
    const tokenResponse = await axios.post("Public_Test_Server_Link", {
      studentId: "E0223006",
      set: "set",
      password: ""
    });
    
    const token = tokenResponse.data.token; // Changed to const (prevents global leaks)
    console.log("Token Received : ", token);
    console.log("URL : ", tokenResponse.data.dataUrl);

    // Fetch Private Dataset using Bearer Header [cite: 77, 113]
    const dataResponse = await axios.get("Private_Test_Server_Link", {
      headers: { Authorization: `Bearer ${token}` } //[cite: 77]
    });

    // Handle extraction (Adapting to your specific structure payload)
    const productsList = dataResponse.data.data.products || [];
    console.log("Data Struture : ", dataResponse.data);
    
    let totalFetched = productsList.length;
    let inserted = 0;
    let duplicates = 0;
    let rejected = 0;

    // Loop, Validate, and Save directly into MongoDB [cite: 85, 86, 95]
    for (const item of productsList) {
      // Data rules validation [cite: 78, 86]
      if (!item.name || item.name.trim() === "") {
        rejected++; // [cite: 124]
        continue; // Reject structural data anomalies [cite: 89]
      }

      // Check for duplicates inside MongoDB collection [cite: 90, 116]
      const existingProduct = await Product.findOne({ id: item.id });
      if (existingProduct) {
        duplicates++; // [cite: 123]
        continue; // Skip duplicate insertion [cite: 90, 116]
      }

      // Save valid data [cite: 29, 95, 115]
      await Product.create({
        id: item.id,
        name: item.name.trim(),
        price: item.price,
        category: item.category
      });
      inserted++; // [cite: 122]
    }

    // Standard structural sync response format required by evaluation scripts [cite: 117, 159]
    return res.status(200).json({
      success: true,
      message: "Sync completed",
      data: { totalFetched, inserted, duplicates, rejected } //[cite: 121, 122, 123, 124, 166]
    });

  } catch (error) {
    const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error("Sync pipeline error:", errorMsg);
    
    return res.status(500).json({ 
      success: false, 
      message: "Sync pipeline failed: " + errorMsg // [cite: 169, 171]
    });
  }
});

// 4. Mandatory Health API [cite: 151, 152]
app.get("/health", async (req, res) => {
  const count = await Product.countDocuments();
  res.status(200).json({
    success: true,
    database: "connected",
    documentCount: count//[cite: 156, 157, 158]
  });
});

app.listen(PORT, () => console.log(`Server executing securely on port ${PORT}`));