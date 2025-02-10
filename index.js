const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (Use your MongoDB Atlas URI if needed)
mongoose.connect("mongodb+srv://Sperky:QLFvegthwbKXOg0w@cluster0.kglzhgp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define Schema
const visitSchema = new mongoose.Schema({
    profile: String,
    count: { type: Number, default: 0 }
});

// Create Model
const Visit = mongoose.model("Visit", visitSchema);

// API Endpoint
app.get("/api", async (req, res) => {
    const id = req.query.id || "default";
    const label = req.query.label || "Profile Views";
    const pretty = req.query.pretty === "true"; // Optional pretty mode

    let visit = await Visit.findOne({ profile: id });

    if (!visit) {
        visit = new Visit({ profile: id, count: 1 });
    } else {
        visit.count += 1;
    }

    await visit.save();

    // SVG Response
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="50">
        <rect width="200" height="50" fill="${pretty ? '#4CAF50' : 'black'}" rx="5"/>
        <text x="10" y="30" fill="white" font-size="16px" font-family="Arial">${label}:</text>
        <text x="160" y="30" fill="white" font-size="16px" font-family="Arial">${visit.count}</text>
    </svg>`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
